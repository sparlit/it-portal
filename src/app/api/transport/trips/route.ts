import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const trips = await prisma.tRANS_Trip.findMany({
      where: { tenantId: session.user.tenantId },
      include: { vehicle: true, driver: { include: { user: true } } },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(trips);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
