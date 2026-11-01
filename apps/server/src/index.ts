import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient, Prisma } from '@prisma/client';
import { CreateOrderSchema } from '@coffee-shop/shared';
import { OrderService } from './services/order.service.js';
import { AvailabilityService } from './services/availability.service.js';
import { AlertService } from './services/alert.service.js';
import { StockService } from './services/stock.service.js';
import { createAuthRouter } from './routes/auth.routes.js';
import { createAdminRoutes } from './routes/admin.routes.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  },
});

const prisma = new PrismaClient();
const orderService = new OrderService(prisma);
const availabilityService = new AvailabilityService(prisma);
const alertService = new AlertService(prisma);

app.use(cors({
  origin: ['http://localhost:5000', 'http://localhost:5001', 'http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3001'],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Menu API
app.get('/api/menu', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        items: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
          include: {
            optionGroups: {
              include: {
                choices: true,
              },
            },
          },
        },
      },
    });

    const availabilityMap = await availabilityService.checkAndUpdateAvailability();

    // Attach isAvailable flag to items and choices
    const enhancedCategories = categories.map((cat: any) => ({
      ...cat,
      items: cat.items.map((item: any) => ({
        ...item,
        isAvailable: availabilityMap[item.id] ?? true,
      })),
    }));

    const storeConfig = await prisma.storeConfig.findFirst({ where: { id: 1 } });
    const activePromotions = await prisma.promotion.findMany({ where: { isActive: true } });

    res.json({
      data: {
        categories: enhancedCategories,
        storeConfig,
        activePromotions,
      }
    });
  } catch (error) {
    console.error('Menu API Error:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch menu data' } });
  }
});

// Orders API
app.post('/api/orders', async (req, res) => {
  try {
    const validation = CreateOrderSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid order payload',
          details: validation.error.format(),
        }
      });
    }

    const order = await orderService.createOrder(validation.data);

    // Broadcast new order to KDS and Admin rooms
    io.to('kds').emit('order:new', order);
    io.to('admin').emit('order:new', order);

    // Check low stock and broadcast if any
    const lowStock = await alertService.checkLowStock(io);
    if (lowStock.length > 0) {
      io.to('admin').emit('stock:low', lowStock);
    }

    // Broadcast updated menu availability to public
    const availabilityMap = await availabilityService.checkAndUpdateAvailability();
    io.to('public').emit('menu:availability', availabilityMap);

    res.status(201).json({ data: order });
  } catch (error: any) {
    console.error('Create Order Error:', error);
    res.status(400).json({
      error: {
        code: 'ORDER_FAILED',
        message: error.message || 'Failed to create order',
      }
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Auth & Admin Routes
app.use('/api/auth', createAuthRouter(prisma));
app.use('/api/admin', createAdminRoutes(prisma, io));

// Orders status & management API
app.patch('/api/orders/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, cancelReason, treatPreparingAsWaste } = req.body;

    const order = await prisma.order.findUnique({ where: { id }, include: { items: true } });
    if (!order) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Order not found' } });
    }

    // If canceling an order that was PREPARING or RECEIVED, handle stock
    if (status === 'CANCELED' && order.status !== 'CANCELED') {
      const stockService = new StockService(prisma);
      // We need to restore or waste stock requirements
      // Let's compute requirements for order items
      const itemIds = order.items.map((i: any) => i.menuItemId);
      const menuItems = await prisma.menuItem.findMany({
        where: { id: { in: itemIds } },
        include: { recipes: true, optionGroups: { include: { choices: true } } }
      });

      const stockRequirements = new Map<string, number>();
      for (const orderItem of order.items) {
        const menuItem = menuItems.find((m: any) => m.id === orderItem.menuItemId);
        if (!menuItem) continue;

        for (const recipe of menuItem.recipes) {
          const current = stockRequirements.get(recipe.ingredientId) || 0;
          stockRequirements.set(recipe.ingredientId, current + (recipe.quantity * orderItem.quantity));
        }

        const selectedOptions = JSON.parse(orderItem.selectedOptionsJson || '[]');
        for (const opt of selectedOptions) {
          const deltas = await prisma.choiceRecipeDelta.findMany({ where: { choiceId: opt.choiceId } });
          for (const delta of deltas) {
            const current = stockRequirements.get(delta.ingredientId) || 0;
            stockRequirements.set(delta.ingredientId, current + (delta.quantityDelta * orderItem.quantity));
          }
        }
      }

      await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const txStockService = new StockService(tx);
        await txStockService.restoreStockForOrder(order.id, stockRequirements, treatPreparingAsWaste);
        await tx.order.update({
          where: { id },
          data: { status, cancelReason }
        });
      });
    } else {
      await orderService.updateStatus(id, status, cancelReason);
    }

    const updatedOrder = await prisma.order.findUnique({ where: { id }, include: { items: true } });

    io.to('kds').emit('order:update', updatedOrder);
    io.to('admin').emit('order:update', updatedOrder);
    io.to(`order:${id}`).emit('order:update', updatedOrder);

    res.json({ data: updatedOrder });
  } catch (error: any) {
    console.error('Update Order Status Error:', error);
    res.status(400).json({ error: { code: 'UPDATE_FAILED', message: error.message || 'Failed to update order status' } });
  }
});

// Socket.IO
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('join', (room: string) => {
    socket.join(room);
    console.log(`Socket ${socket.id} joined room: ${room}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Serve static files from apps/web/dist or apps/server/public fallback
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.resolve(__dirname, '../../web/dist')));

// SPA fallback for non-API routes
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return next();
  }
  
  res.sendFile(path.resolve(__dirname, '../../web/dist/index.html'));
});

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, async () => {
  console.log(`\n☕ Coffee Shop Server running at http://localhost:${PORT}`);
  
  try {
    const tableTokens = await prisma.tableToken.findMany({ take: 5 });
    if (tableTokens.length > 0) {
      console.log('\n📋 Valid Table Ordering URLs:');
      for (const tt of tableTokens) {
        console.log(`   Table ${tt.tableNo}: http://localhost:${PORT}/?table=${tt.tableNo}&t=${tt.token}`);
      }
    } else {
      console.log('\n⚠️ No table tokens found in DB. Please run seed script.');
    }
  } catch (err) {
    console.error('Failed to fetch table tokens for startup logs:', err);
  }
});

export { io, prisma };
