import { PrismaClient } from '@prisma/client';

export class AvailabilityService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Recompute availability for all menu items and broadcast if needed.
   */
  async checkAndUpdateAvailability() {
    const items = await this.prisma.menuItem.findMany({
      include: {
        recipes: {
          include: { ingredient: true }
        },
        optionGroups: {
          include: {
            choices: {
              include: {
                recipeDeltas: {
                  include: { ingredient: true }
                }
              }
            }
          }
        }
      }
    });

    const availabilityMap: Record<string, boolean> = {};

    for (const item of items) {
      if (!item.isActive || item.manualSoldOut) {
        availabilityMap[item.id] = false;
        continue;
      }

      // Check base recipe ingredients
      let isAvailable = true;
      for (const recipe of item.recipes) {
        if (recipe.ingredient.stockQty < recipe.quantity) {
          isAvailable = false;
          break;
        }
      }

      availabilityMap[item.id] = isAvailable;
    }

    return availabilityMap;
  }
}
