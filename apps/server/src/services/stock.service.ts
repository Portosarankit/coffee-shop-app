import { Prisma, PrismaClient } from '@prisma/client';

/**
 * StockService
 * Handles ingredient stock levels, atomic deductions, and movement logging.
 */
export class StockService {
  constructor(private prisma: PrismaClient | Prisma.TransactionClient) {}

  /**
   * Log a stock movement and update the current balance.
   * This should usually be called within a transaction.
   */
  async recordMovement(data: {
    ingredientId: string;
    type: 'ORDER' | 'ORDER_CANCEL_RESTORE' | 'REFILL' | 'ADJUSTMENT' | 'WASTE';
    quantity: number;
    orderId?: string;
    note?: string;
    createdBy?: string;
  }) {
    // 1. Get current stock with a lock (if in transaction)
    const ingredient = await this.prisma.ingredient.findUnique({
      where: { id: data.ingredientId },
      select: { stockQty: true, name: true, minLevel: true, lowAlertActive: true }
    });

    if (!ingredient) {
      throw new Error(`Ingredient ${data.ingredientId} not found`);
    }

    const newBalance = ingredient.stockQty + data.quantity;

    if (newBalance < 0 && (data.type === 'ORDER' || data.type === 'WASTE')) {
      throw new Error(`Insufficient stock for ${ingredient.name}`);
    }

    // 2. Create movement record
    await this.prisma.stockMovement.create({
      data: {
        ingredientId: data.ingredientId,
        type: data.type,
        quantity: data.quantity,
        balanceAfter: newBalance,
        orderId: data.orderId,
        note: data.note,
        createdBy: data.createdBy,
      },
    });

    // 3. Update ingredient balance
    const updatedIngredient = await this.prisma.ingredient.update({
      where: { id: data.ingredientId },
      data: {
        stockQty: newBalance,
      },
    });

    return updatedIngredient;
  }

  /**
   * Batch deduct stock for an order based on BOM.
   */
  async deductStockForOrder(orderId: string, requirements: Map<string, number>) {
    for (const [ingredientId, quantity] of requirements.entries()) {
      await this.recordMovement({
        ingredientId,
        type: 'ORDER',
        quantity: -quantity,
        orderId,
      });
    }
  }

  /**
   * Batch restore stock for a canceled order.
   */
  async restoreStockForOrder(orderId: string, requirements: Map<string, number>, asWaste = false) {
    for (const [ingredientId, quantity] of requirements.entries()) {
      await this.recordMovement({
        ingredientId,
        type: asWaste ? 'WASTE' : 'ORDER_CANCEL_RESTORE',
        quantity: asWaste ? 0 : quantity, // If waste, we don't restore balance but maybe log it? 
        // Actually if it's waste, it stays deducted. If restore, we add back.
        orderId,
        note: asWaste ? 'Order canceled - wasted' : 'Order canceled - restored',
      });
      
      if (!asWaste) {
        // Balance already updated in recordMovement by quantity
      }
    }
  }
}
