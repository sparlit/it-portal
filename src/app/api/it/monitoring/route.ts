import { NextRequest, NextResponse } from 'next/server';
import { withRBAC } from '@/lib/api-middleware';
import { InfrastructureService } from '@/services/InfrastructureService';

export async function GET(request: NextRequest) {
  return withRBAC(request, 'read', 'Asset', async (tenantId: string) => {
    // Optionally trigger a health check refresh
    const searchParams = request.nextUrl.searchParams;
    const refresh = searchParams.get('refresh') === 'true';

    if (refresh) {
      await InfrastructureService.performHealthChecks(tenantId);
    }

    const servers = await InfrastructureService.getServers(tenantId);
    return NextResponse.json(servers);
  });
}

export async function POST(request: NextRequest) {
  return withRBAC(request, 'update', 'Asset', async (tenantId: string) => {
    const results = await InfrastructureService.performHealthChecks(tenantId);
    return NextResponse.json({ message: 'Health checks completed', results });
  });
}
