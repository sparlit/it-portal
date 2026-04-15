import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withRBAC } from '@/lib/api-middleware';

export async function GET(request: NextRequest) {
  return withRBAC(request, 'read', 'Report', async (tenantId: string) => {
    // 1. Fetch basic counts
    const [
      totalOrders,
      pendingTickets,
      activeAssets,
      activeUsers
    ] = await Promise.all([
      prisma.laundryOrder.count({ where: { tenantId } }),
      prisma.iTTicket.count({ where: { tenantId, status: 'open' } }),
      prisma.asset.count({ where: { tenantId, status: 'active' } }),
      prisma.user.count({ where: { tenantId, status: 'active' } })
    ]);

    // 2. Calculate Laundry Takt Time (Average time from received to delivered)
    // In Prisma with SQLite, we use undefined to avoid null assignment issues in some types
    const deliveredOrders = await prisma.laundryOrder.findMany({
      where: {
        tenantId,
        status: 'delivered',
        deliveredAt: { not: undefined },
        receivedAt: { not: undefined }
      },
      select: { receivedAt: true, deliveredAt: true },
      take: 100 // Last 100 for a rolling average
    });

    let avgTaktHours = 0;
    if (deliveredOrders.length > 0) {
      const totalTaktTime = deliveredOrders.reduce((acc, order) => {
        if (order.deliveredAt && order.receivedAt) {
          const takt = order.deliveredAt.getTime() - order.receivedAt.getTime();
          return acc + takt;
        }
        return acc;
      }, 0);
      avgTaktHours = totalTaktTime / deliveredOrders.length / (1000 * 60 * 60);
    }

    // 3. Calculate SLA Compliance (Example: IT tickets closed within 24h)
    const itTickets = await prisma.iTTicket.findMany({
      where: { tenantId, status: 'closed' },
      select: { createdAt: true, updatedAt: true }
    });

    let slaCompliance = 100;
    if (itTickets.length > 0) {
      const withinSLA = itTickets.filter(t => {
        const duration = t.updatedAt.getTime() - t.createdAt.getTime();
        return duration <= 24 * 60 * 60 * 1000;
      }).length;
      slaCompliance = Math.round((withinSLA / itTickets.length) * 100);
    }

    // 4. Calculate IT Asset Health (% of assets that are 'active')
    const totalAssets = await prisma.asset.count({ where: { tenantId } });
    const itAssetHealth = totalAssets > 0
      ? Math.round((activeAssets / totalAssets) * 100)
      : 100;

    return NextResponse.json({
      summary: {
        totalOrders,
        pendingTickets,
        activeAssets,
        activeUsers
      },
      kpis: {
        laundryTaktTime: `${avgTaktHours.toFixed(1)}h`,
        itAssetHealth: `${itAssetHealth}%`,
        slaCompliance: `${slaCompliance}%`
      }
    });
  });
}
