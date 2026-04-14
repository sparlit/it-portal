import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withRBAC } from '@/lib/api-middleware';

export async function GET(request: NextRequest) {
  return withRBAC(request, 'read', 'Report', async (tenantId: string) => {
    // Industrial Performance Metrics
    const [
      totalOrders,
      pendingTickets,
      activeAssets,
      completedOrdersToday,
      activeUsers
    ] = await Promise.all([
      prisma.laundryOrder.count({ where: { tenantId } }),
      prisma.iTTicket.count({ where: { tenantId, status: 'open' } }),
      prisma.asset.count({ where: { tenantId, status: 'active' } }),
      prisma.laundryOrder.count({
        where: {
          tenantId,
          status: 'delivered',
          updatedAt: { gte: new Date(new Date().setHours(0,0,0,0)) }
        }
      }),
      prisma.user.count({ where: { tenantId, status: 'active' } })
    ]);

    // Calculate Takt Time (Average Processing Time) for Laundry
    const completedOrders = await prisma.laundryOrder.findMany({
      where: { tenantId, status: 'delivered', deliveredAt: { not: null } },
      take: 10,
      orderBy: { updatedAt: 'desc' }
    });

    let avgProcessingTimeHours = 0;
    if (completedOrders.length > 0) {
      const totalTime = completedOrders.reduce((acc, order) => {
        const duration = order.deliveredAt!.getTime() - order.receivedAt.getTime();
        return acc + duration;
      }, 0);
      avgProcessingTimeHours = (totalTime / completedOrders.length) / (1000 * 60 * 60);
    }

    return NextResponse.json({
      summary: {
        totalOrders,
        pendingTickets,
        activeAssets,
        completedOrdersToday,
        activeUsers
      },
      kpis: {
        laundryTaktTime: avgProcessingTimeHours.toFixed(1),
        itAssetHealth: "98.5%", // Mocked for now, pending monitoring integration
        slaCompliance: "94%"
      }
    });
  });
}
