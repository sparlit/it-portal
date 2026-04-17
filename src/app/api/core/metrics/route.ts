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
      prisma.lND_Order.count({ where: { tenantId } }),
      prisma.iT_Ticket.count({ where: { tenantId, status: 'open' } }),
      prisma.iT_Asset.count({ where: { tenantId, status: 'active' } }),
      prisma.cORE_User.count({ where: { tenantId, status: 'active' } })
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
