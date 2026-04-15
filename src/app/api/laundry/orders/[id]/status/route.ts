import { NextRequest, NextResponse } from 'next/server';
import { withRBAC } from '@/lib/api-middleware';
import { LaundryService } from '@/services/LaundryService';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withRBAC(request, 'update', 'LaundryOrder', async (tenantId: string) => {
    try {
      const { status } = await request.json();
      const orderId = params.id;

      if (!status) {
        return NextResponse.json({ error: 'Status is required' }, { status: 400 });
      }

      const order = await LaundryService.updateOrderStatus(tenantId, orderId, status);
      return NextResponse.json(order);
    } catch (error: any) {
      if (error.message === 'Invalid status') {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
  });
}
