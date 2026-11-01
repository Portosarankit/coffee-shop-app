import { PrismaClient } from '@prisma/client';

export class AlertService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Check all ingredients and flag low-stock status.
   * Fires only when stock crosses from above minLevel to at or below it.
   */
  async checkLowStock(io?: any) {
    const ingredients = await this.prisma.ingredient.findMany();
    const lowStockItems: any[] = [];

    for (const ing of ingredients) {
      const isLow = ing.stockQty <= ing.minLevel;
      if (isLow && !ing.lowAlertActive) {
        // Crossed threshold downwards!
        await this.prisma.ingredient.update({
          where: { id: ing.id },
          data: { lowAlertActive: true },
        });
        lowStockItems.push(ing);
      } else if (!isLow && ing.lowAlertActive) {
        // Refilled above minLevel, reset alert flag
        await this.prisma.ingredient.update({
          where: { id: ing.id },
          data: { lowAlertActive: false },
        });
      }
    }

    if (lowStockItems.length > 0 && io) {
      io.to('admin').emit('stock:low', lowStockItems);
    }

    return lowStockItems;
  }
}
