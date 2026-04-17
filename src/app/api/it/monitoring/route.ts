import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withRBAC } from '@/lib/api-middleware';

export async function GET(request: NextRequest) {
  return withRBAC(request, 'read', 'Asset', async (tenantId: string) => {
    const servers = await prisma.iT_ServerMonitor.findMany({
      where: { tenantId },
      orderBy: { name: 'asc' }
    });
    return NextResponse.json(servers);
  });
}
