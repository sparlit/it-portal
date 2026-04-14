import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withRBAC } from '@/lib/api-middleware';

export async function GET(request: NextRequest) {
  return withRBAC(request, 'manage', 'Setting', async (tenantId: string) => {
    const credentials = await prisma.credential.findMany({
      where: { tenantId },
      orderBy: { system: 'asc' }
    });
    return NextResponse.json(credentials);
  });
}
