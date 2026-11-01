import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { StockService } from '../services/stock.service.js';
import QRCode from 'qrcode';
import crypto from 'crypto';

export const createAdminRoutes = (prisma: PrismaClient, io: any) => {
  const router = Router();

  // Protect all admin routes
  router.use(authenticateToken);

  // 5. Table & QR Codes Management
  router.get('/tables', async (req, res) => {
    try {
      const tables = await prisma.tableToken.findMany({ orderBy: { tableNo: 'asc' } });
      res.json({ data: tables });
    } catch (error) {
      res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Failed to fetch tables' } });
    }
  });

  router.post('/tables', async (req, res) => {
    try {
      const { tableNo } = req.body;
      if (!tableNo) {
        return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Table number is required' } });
      }
      const token = crypto.randomBytes(16).toString('hex');
      const table = await prisma.tableToken.upsert({
        where: { tableNo: String(tableNo) },
        update: { token },
        create: { tableNo: String(tableNo), token }
      });
      res.status(201).json({ data: table });
    } catch (error) {
      res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Failed to create/regenerate table token' } });
    }
  });

  router.get('/tables/:tableNo/qr', async (req, res) => {
    try {
      const { tableNo } = req.params;
      let table = await prisma.tableToken.findUnique({ where: { tableNo } });
      if (!table) {
        const token = crypto.randomBytes(16).toString('hex');
        table = await prisma.tableToken.create({
          data: { tableNo, token }
        });
      }

      const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
      const qrDataUrl = `${clientUrl}/menu?table=${tableNo}&token=${table.token}`;
      const qrImage = await QRCode.toDataURL(qrDataUrl);

      res.json({ data: { tableNo, token: table.token, qrDataUrl, qrImage } });
    } catch (error) {
      res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Failed to generate QR code' } });
    }
  });

  // 1. Store Config & Status Management
  router.get('/store/config', async (req, res) => {
    try {
      const config = await prisma.storeConfig.findFirst({ where: { id: 1 } });
      res.json({ data: config });
    } catch (error) {
      res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Failed to fetch store config' } });
    }
  });

  router.patch('/store/config', async (req, res) => {
    try {
      const { status, announcement, scheduleText, holidayNote, acceptOrders, alertWebhookUrl } = req.body;
      const config = await prisma.storeConfig.upsert({
        where: { id: 1 },
        update: { status, announcement, scheduleText, holidayNote, acceptOrders, alertWebhookUrl },
        create: { id: 1, status: status || 'OPEN', announcement, scheduleText, holidayNote, acceptOrders: acceptOrders ?? true, alertWebhookUrl }
      });

      // Broadcast store status change
      io.to('public').emit('store:status', config);
      io.to('admin').emit('store:status', config);

      res.json({ data: config });
    } catch (error) {
      res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Failed to update store config' } });
    }
  });

  // 2. Promotions Management
  router.get('/promotions', async (req, res) => {
    try {
      const promotions = await prisma.promotion.findMany({ orderBy: { startsAt: 'desc' } });
      res.json({ data: promotions });
    } catch (error) {
      res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Failed to fetch promotions' } });
    }
  });

  router.post('/promotions', async (req, res) => {
    try {
      const { title, description, imageUrl, discountType, discountValue, startsAt, endsAt, isActive } = req.body;
      const promotion = await prisma.promotion.create({
        data: {
          title,
          description,
          imageUrl,
          discountType: discountType || 'NONE',
          discountValue: discountValue ? parseFloat(discountValue) : null,
          startsAt: startsAt ? new Date(startsAt) : null,
          endsAt: endsAt ? new Date(endsAt) : null,
          isActive: isActive ?? true
        }
      });
      io.to('public').emit('promotion:update');
      res.status(201).json({ data: promotion });
    } catch (error) {
      res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Failed to create promotion' } });
    }
  });

  router.put('/promotions/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, imageUrl, discountType, discountValue, startsAt, endsAt, isActive } = req.body;
      const promotion = await prisma.promotion.update({
        where: { id },
        data: {
          title,
          description,
          imageUrl,
          discountType,
          discountValue: discountValue !== undefined ? (discountValue ? parseFloat(discountValue) : null) : undefined,
          startsAt: startsAt !== undefined ? (startsAt ? new Date(startsAt) : null) : undefined,
          endsAt: endsAt !== undefined ? (endsAt ? new Date(endsAt) : null) : undefined,
          isActive
        }
      });
      io.to('public').emit('promotion:update');
      res.json({ data: promotion });
    } catch (error) {
      res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Failed to update promotion' } });
    }
  });

  router.delete('/promotions/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await prisma.promotion.delete({ where: { id } });
      io.to('public').emit('promotion:update');
      res.json({ data: { success: true } });
    } catch (error) {
      res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Failed to delete promotion' } });
    }
  });

  // 3. Inventory & Ingredients Management
  router.get('/inventory', async (req, res) => {
    try {
      const ingredients = await prisma.ingredient.findMany({
        include: { stockMovements: { orderBy: { createdAt: 'desc' }, take: 10 } },
        orderBy: { name: 'asc' }
      });
      res.json({ data: ingredients });
    } catch (error) {
      res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Failed to fetch inventory' } });
    }
  });

  router.post('/inventory', async (req, res) => {
    try {
      const { name, unit, stockQty, minLevel, costPerUnit } = req.body;
      const ingredient = await prisma.ingredient.create({
        data: {
          name,
          unit: unit || 'g',
          stockQty: stockQty ? parseFloat(stockQty) : 0,
          minLevel: minLevel ? parseFloat(minLevel) : 0,
          costPerUnit: costPerUnit ? parseInt(costPerUnit) : null
        }
      });
      if (ingredient.stockQty > 0) {
        const stockService = new StockService(prisma);
        await stockService.recordMovement({
          ingredientId: ingredient.id,
          type: 'ADJUSTMENT',
          quantity: ingredient.stockQty,
          note: 'Initial stock creation',
          createdBy: (req as any).user?.name || 'admin'
        });
      }
      res.status(201).json({ data: ingredient });
    } catch (error) {
      res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Failed to create ingredient' } });
    }
  });

  router.patch('/inventory/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { name, unit, minLevel, costPerUnit } = req.body;
      const ingredient = await prisma.ingredient.update({
        where: { id },
        data: { name, unit, minLevel: minLevel !== undefined ? parseFloat(minLevel) : undefined, costPerUnit: costPerUnit !== undefined ? parseInt(costPerUnit) : undefined }
      });
      res.json({ data: ingredient });
    } catch (error) {
      res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Failed to update ingredient' } });
    }
  });

  router.post('/inventory/:id/adjust', async (req, res) => {
    try {
      const { id } = req.params;
      const { type, quantity, note } = req.body; // type: REFILL, ADJUSTMENT, WASTE
      const qtyNum = parseFloat(quantity);
      if (isNaN(qtyNum)) {
        return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Invalid quantity' } });
      }

      const stockService = new StockService(prisma);
      const updated = await stockService.recordMovement({
        ingredientId: id,
        type: type || 'REFILL',
        quantity: qtyNum,
        note,
        createdBy: (req as any).user?.name || 'admin'
      });

      res.json({ data: updated });
    } catch (error: any) {
      res.status(400).json({ error: { code: 'ADJUST_FAILED', message: error.message || 'Failed to adjust stock' } });
    }
  });

  // 4. Menu & Recipe Management
  router.get('/menu', async (req, res) => {
    try {
      const categories = await prisma.category.findMany({
        orderBy: { sortOrder: 'asc' },
        include: {
          items: {
            orderBy: { sortOrder: 'asc' },
            include: {
              recipes: { include: { ingredient: true } },
              optionGroups: {
                include: {
                  choices: {
                    include: {
                      recipeDeltas: { include: { ingredient: true } }
                    }
                  }
                }
              }
            }
          }
        }
      });
      res.json({ data: categories });
    } catch (error) {
      res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Failed to fetch admin menu' } });
    }
  });

  router.post('/menu/items', async (req, res) => {
    try {
      const { categoryId, name, description, imageUrl, basePrice, sortOrder, recipes } = req.body;
      const item = await prisma.menuItem.create({
        data: {
          categoryId,
          name,
          description,
          imageUrl,
          basePrice: parseInt(basePrice),
          sortOrder: sortOrder ? parseInt(sortOrder) : 0,
          recipes: {
            create: (recipes || []).map((r: any) => ({
              ingredientId: r.ingredientId,
              quantity: parseFloat(r.quantity)
            }))
          }
        },
        include: { recipes: { include: { ingredient: true } } }
      });
      io.to('public').emit('menu:update');
      res.status(201).json({ data: item });
    } catch (error) {
      res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Failed to create menu item' } });
    }
  });

  router.patch('/menu/items/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, imageUrl, basePrice, isActive, manualSoldOut, sortOrder, categoryId, recipes } = req.body;

      // If recipes are supplied, replace them
      if (recipes) {
        await prisma.recipeLine.deleteMany({ where: { menuItemId: id } });
      }

      const item = await prisma.menuItem.update({
        where: { id },
        data: {
          name,
          description,
          imageUrl,
          basePrice: basePrice !== undefined ? parseInt(basePrice) : undefined,
          isActive,
          manualSoldOut,
          sortOrder: sortOrder !== undefined ? parseInt(sortOrder) : undefined,
          categoryId,
          recipes: recipes ? {
            create: recipes.map((r: any) => ({
              ingredientId: r.ingredientId,
              quantity: parseFloat(r.quantity)
            }))
          } : undefined
        },
        include: { recipes: { include: { ingredient: true } } }
      });

      io.to('public').emit('menu:update');
      res.json({ data: item });
    } catch (error) {
      res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Failed to update menu item' } });
    }
  });

  router.patch('/menu/items/:id/sold-out', async (req, res) => {
    try {
      const { id } = req.params;
      const { manualSoldOut } = req.body;
      const item = await prisma.menuItem.update({
        where: { id },
        data: { manualSoldOut }
      });
      io.to('public').emit('menu:update');
      res.json({ data: item });
    } catch (error) {
      res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Failed to toggle sold-out' } });
    }
  });

  return router;
};
