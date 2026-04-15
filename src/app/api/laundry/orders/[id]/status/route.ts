import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withRBAC } from '@/lib/api-middleware';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return withRBAC(request, 'update', 'LaundryOrder', async (tenantId: string) => {
    const { status } = await request.json();
    if (!status) return NextResponse.json({ error: 'Status is required' }, { status: 400 });

    try {
      const order = await prisma.laundryOrder.update({
        where: { id, tenantId },
        data: {
          status,
          deliveredAt: status === 'delivered' ? new Date() : undefined
        }
      });
      return NextResponse.json(order);
    } catch (error) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
  });
}
