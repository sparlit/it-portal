import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const batches = await prisma.productionBatch.findMany({
      where: { tenantId: session.user.tenantId },
      include: { qcChecks: true },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(batches);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const data = await request.json();
    const batch = await prisma.productionBatch.create({
      data: {
        ...data,
        tenantId: session.user.tenantId
      }
    });

    return NextResponse.json(batch);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
