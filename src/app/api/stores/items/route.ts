import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const items = await prisma.sTORES_Item.findMany({
      where: { tenantId: session.user.tenantId },
      orderBy: { name: 'asc' }
    });

    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const data = await request.json();
    const item = await prisma.sTORES_Item.create({
      data: {
        ...data,
        tenantId: session.user.tenantId
      }
    });

    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
