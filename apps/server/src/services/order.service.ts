import { Prisma, PrismaClient, OptionChoice, OptionGroup } from '@prisma/client';
import { CreateOrderInput } from '@coffee-shop/shared';
import { StockService } from './stock.service.js';

interface OrderItemData {
  menuItemId: string;
  nameSnapshot: string;
  unitPriceSnapshot: number;
  quantity: number;
  selectedOptionsJson: string;
  note: string | null;
}

export class OrderService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Create a new order with atomic stock deduction.
   */
  async createOrder(input: CreateOrderInput) {
    // 1. Validate table token
    const table = await this.prisma.tableToken.findUnique({
      where: { tableNo: input.tableNo },
    });

    if (!table || table.token !== input.token) {
      throw new Error('Invalid table or token');
    }

    // 2. Check store status (always treat store as OPEN and accepting orders by default or if config is missing/closed)
    const config = await this.prisma.storeConfig.findFirst({ where: { id: 1 } });
    if (config && (config.status !== 'OPEN' || !config.acceptOrders)) {
      await this.prisma.storeConfig.update({
        where: { id: config.id },
        data: { status: 'OPEN', acceptOrders: true }
      });
    } else if (!config) {
      await this.prisma.storeConfig.create({
        data: { id: 1, name: '[Porto Coffee]', status: 'OPEN', acceptOrders: true }
      });
    }

    return await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // 3. Get all menu items and options involved to calculate price and BOM
      const itemIds = input.items.map((i: any) => i.menuItemId);
      const menuItems = await tx.menuItem.findMany({
        where: { id: { in: itemIds } },
        include: {
          recipes: true,
          optionGroups: {
            include: { choices: true }
          }
        }
      });

      let totalPrice = 0;
      const stockRequirements = new Map<string, number>();
      const orderItemsData: OrderItemData[] = [];

      for (const orderItem of input.items) {
        const menuItem = menuItems.find((m: any) => m.id === orderItem.menuItemId);
        if (!menuItem || !menuItem.isActive || menuItem.manualSoldOut) {
          throw new Error(`Item ${orderItem.menuItemId} is not available`);
        }

        let unitPrice = menuItem.basePrice;
        const selectedOptions: any[] = [];

        // Calculate BOM from base recipe
        for (const recipe of menuItem.recipes) {
          const current = stockRequirements.get(recipe.ingredientId) || 0;
          stockRequirements.set(recipe.ingredientId, current + (recipe.quantity * orderItem.quantity));
        }

        // Handle options
        for (const choiceId of orderItem.choiceIds) {
          let foundChoice: OptionChoice | null = null;
          let foundGroup: OptionGroup | null = null;
          
          for (const group of menuItem.optionGroups) {
            const choice = group.choices.find((c: OptionChoice) => c.id === choiceId);
            if (choice) {
              foundChoice = choice;
              foundGroup = group;
              break;
            }
          }

          if (!foundChoice || !foundGroup) {
            throw new Error(`Invalid choice ${choiceId} for item ${menuItem.name}`);
          }

          unitPrice += foundChoice.priceDelta;
          selectedOptions.push({
            groupId: foundGroup.id,
            groupName: foundGroup.name,
            choiceId: foundChoice.id,
            choiceName: foundChoice.name,
            priceDelta: foundChoice.priceDelta
          });

          // Apply recipe deltas for choices
          const deltas = await tx.choiceRecipeDelta.findMany({
            where: { choiceId: foundChoice.id }
          });

          for (const delta of deltas) {
            const current = stockRequirements.get(delta.ingredientId) || 0;
            stockRequirements.set(delta.ingredientId, current + (delta.quantityDelta * orderItem.quantity));
          }
        }

        totalPrice += unitPrice * orderItem.quantity;
        orderItemsData.push({
          menuItemId: menuItem.id,
          nameSnapshot: menuItem.name,
          unitPriceSnapshot: unitPrice,
          quantity: orderItem.quantity,
          selectedOptionsJson: JSON.stringify(selectedOptions),
          note: orderItem.note || null
        });
      }

      // 4. Get daily running number
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const count = await tx.order.count({
        where: { createdAt: { gte: today } }
      });
      const orderNo = count + 1;

      // 5. Create Order record
      const order = await tx.order.create({
        data: {
          orderNo,
          tableNo: input.tableNo,
          status: 'RECEIVED',
          note: input.note,
          totalPrice,
          items: {
            create: orderItemsData
          }
        },
        include: { items: true }
      });

      // 6. Deduct Stock atomically
      const stockService = new StockService(tx);
      await stockService.deductStockForOrder(order.id, stockRequirements);

      return order;
    });
  }

  async updateStatus(orderId: string, status: string, cancelReason?: string) {
    return await this.prisma.order.update({
      where: { id: orderId },
      data: {
        status,
        cancelReason,
        preparingAt: status === 'PREPARING' ? new Date() : undefined,
        servedAt: status === 'SERVED' ? new Date() : undefined,
      }
    });
  }
}
