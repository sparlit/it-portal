import { prisma } from '@/lib/db';

export class LaundryService {
  static async updateOrderStatus(tenantId: string, orderId: string, status: string) {
    const validStatuses = [
      'received', 'sorting', 'processing', 'quality-check',
      'ready', 'out-for-delivery', 'delivered', 'cancelled'
    ];

    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status');
    }

    const order = await prisma.laundryOrder.update({
      where: { id: orderId, tenantId },
      data: {
        status,
        deliveredAt: status === 'delivered' ? new Date() : undefined
      }
    });

    // Centralized Audit Logging
    await prisma.activityLog.create({
      data: {
        tenantId,
        user: 'System/Laundry',
        action: `Updated Order ${order.orderNumber} status to ${status}`
      }
    });

    return order;
  }

  static async getOrders(tenantId: string) {
    return prisma.laundryOrder.findMany({
      where: { tenantId },
      include: {
        customer: true,
        items: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}
