import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withRBAC } from '@/lib/api-middleware';
import { InfrastructureService } from '@/services/InfrastructureService';
import { AuditService } from '@/services/AuditService';

export async function GET(request: NextRequest) {
  return withRBAC(request, 'read', 'Asset', async (tenantId, user) => {
    const nodes = await prisma.serverMonitor.findMany({
      where: { tenantId },
      orderBy: { name: 'asc' }
    });

    // Perform real health checks
    const statusResults = await InfrastructureService.getDashboardMetrics(
      tenantId,
      nodes.map(n => ({ id: n.id, name: n.name, ip: n.ip }))
    );

    // Update status in DB for persistence
    await Promise.all(
      statusResults.map(node =>
        prisma.serverMonitor.update({
          where: { id: node.id },
          data: { status: node.status }
        })
      )
    );

    await AuditService.logActivity(tenantId, user.id, user.username, 'Performed Infrastructure Health Check');

    return NextResponse.json(statusResults);
  });
}
