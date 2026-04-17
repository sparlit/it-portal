import { prisma } from '@/lib/db';

export class ReorderEngine {
  static async checkInventoryLevels(tenantId: string) {
    const lowStockItems = await prisma.sTORES_Item.findMany({
      where: {
        tenantId,
        currentStock: { lte: prisma.sTORES_Item.fields.minStockLevel }
      }
    });

    for (const item of lowStockItems) {
      // Check if there's already a pending requisition for this item
      const existingPR = await prisma.sTORES_Requisition.findFirst({
        where: {
          tenantId,
          status: 'pending',
          items: {
            some: { itemId: item.id }
          }
        }
      });

      if (!existingPR) {
        await this.createAutoRequisition(tenantId, item);
      }
    }
  }

  private static async createAutoRequisition(tenantId: string, item: any) {
    const requisitionNo = `AUTO-PR-${Date.now()}`;

    return prisma.sTORES_Requisition.create({
      data: {
        tenantId,
        requisitionNo,
        department: 'SYSTEM',
        requestedBy: 'System Auto-Reorder',
        priority: 'high',
        status: 'pending',
        items: {
          create: {
            itemId: item.id,
            description: `Auto-reorder for ${item.name}`,
            quantity: item.reorderPoint - item.currentStock
          }
        }
      }
    });
  }
}
