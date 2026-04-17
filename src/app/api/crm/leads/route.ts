import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const leads = await prisma.cRM_Lead.findMany({
      where: { tenantId: session.user.tenantId },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(leads);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const data = await request.json();
    const lead = await prisma.cRM_Lead.create({
      data: {
        ...data,
        tenantId: session.user.tenantId
      }
    });

    return NextResponse.json(lead);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
