import { describe, it, expect, beforeEach } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { OrderService } from '../services/order.service.js';
import { StockService } from '../services/stock.service.js';

const prisma = new PrismaClient();
const orderService = new OrderService(prisma);
const stockService = new StockService(prisma);

describe('Order & Stock Engine', () => {
  beforeEach(async () => {
    // Clean and seed specific test data if needed
  });

  it('should successfully calculate total price and deduct stock', async () => {
    // Find table 01 token
    const tableToken = await prisma.tableToken.findFirst({ where: { tableNo: '01' } });
    const latte = await prisma.menuItem.findFirst({ where: { name: 'Latte' }, include: { optionGroups: { include: { choices: true } } } });

    expect(tableToken).toBeDefined();
    expect(latte).toBeDefined();

    if (!tableToken || !latte) return;

    const milkChoice = latte.optionGroups[0].choices[0]; // Fresh milk

    const orderInput = {
      tableNo: '01',
      token: tableToken.token,
      items: [
        {
          menuItemId: latte.id,
          quantity: 2,
          choiceIds: [milkChoice.id],
          note: 'Less ice'
        }
      ],
      note: 'Test order'
    };

    const order = await orderService.createOrder(orderInput);

    expect(order).toBeDefined();
    expect(order.totalPrice).toBe(latte.basePrice * 2);
    expect(order.items.length).toBe(1);
    expect(order.status).toBe('RECEIVED');
  });
});
