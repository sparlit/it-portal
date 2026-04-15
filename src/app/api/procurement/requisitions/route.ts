import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const requisitions = await prisma.purchaseRequisition.findMany({
      where: { tenantId: session.user.tenantId },
      include: { items: true, approvals: true },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(requisitions);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { department, items, priority } = await request.json();

    const requisition = await prisma.purchaseRequisition.create({
      data: {
        tenantId: session.user.tenantId,
        requisitionNo: `PR-${Date.now()}`,
        department,
        requestedBy: session.user.name,
        priority: priority || 'normal',
        items: {
          create: items.map((item: any) => ({
            description: item.description,
            quantity: item.quantity
          }))
        }
      }
    });

    return NextResponse.json(requisition);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
