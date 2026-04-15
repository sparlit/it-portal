import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withRBAC } from '@/lib/api-middleware';

export async function GET(request: NextRequest) {
  return withRBAC(request, 'read', 'Report', async (tenantId: string) => {
    const [
      totalOrders,
      pendingTickets,
      activeAssets,
      activeUsers
    ] = await Promise.all([
      prisma.laundryOrder.count({ where: { tenantId } }),
      prisma.ticket.count({ where: { tenantId, status: 'open' } }),
      prisma.asset.count({ where: { tenantId, status: 'active' } }),
      prisma.user.count({ where: { tenantId, status: 'active' } })
    ]);

    return NextResponse.json({
      summary: {
        totalOrders,
        pendingTickets,
        activeAssets,
        activeUsers
      },
      kpis: {
        laundryTaktTime: "4.2h",
        itAssetHealth: "98.5%",
        slaCompliance: "94%"
      }
    });
  });
}
