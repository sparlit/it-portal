import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withRBAC } from '@/lib/api-middleware';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withRBAC(request, 'update', 'LaundryOrder', async (tenantId: string) => {
    const { status } = await request.json();
    const orderId = params.id;

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    const validStatuses = [
      'received', 'sorting', 'processing', 'quality-check',
      'ready', 'out-for-delivery', 'delivered', 'cancelled'
    ];

    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    try {
      const order = await prisma.lND_Order.update({
        where: { id: orderId, tenantId },
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
