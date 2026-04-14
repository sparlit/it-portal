import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withRBAC } from '@/lib/api-middleware';

export async function GET(request: NextRequest) {
  return withRBAC(request, 'read', 'Report', async (tenantId: string) => {
    const logs = await prisma.activityLog.findMany({
      where: { tenantId },
      orderBy: { timestamp: 'desc' },
      take: 50
    });
    return NextResponse.json(logs);
  });
}
