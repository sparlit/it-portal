import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withRBAC } from '@/lib/api-middleware';

export async function GET(request: NextRequest) {
  return withRBAC(request, 'read', 'LaundryOrder', async (tenantId: string) => {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const where: any = { tenantId };
    if (status) where.status = status;

    const orders = await prisma.laundryOrder.findMany({
      where,
      include: { customer: true, items: true, logistics: true },
      orderBy: { receivedAt: 'desc' }
    });
    return NextResponse.json(orders);
  });
}

export async function POST(request: NextRequest) {
  return withRBAC(request, 'create', 'LaundryOrder', async (tenantId: string) => {
    const body = await request.json();
    // In-depth deep dive: Server-side pricing verification (Artemis Standard)
    const serviceIds = body.items.map((i: any) => i.serviceId);
    const services = await prisma.laundryService.findMany({ where: { id: { in: serviceIds }, tenantId } });
    const priceMap = new Map(services.map(s => [s.id, s.price]));

    let total = 0;
    const items = body.items.map((i: any) => {
      const price = priceMap.get(i.serviceId) || 0;
      const subtotal = i.quantity * price;
      total += subtotal;
      return { ...i, unitPrice: price, subtotal };
    });

    const order = await prisma.laundryOrder.create({
      data: {
        ...body,
        tenantId,
        totalAmount: total,
        items: { create: items },
        logistics: body.address ? { create: { address: body.address } } : undefined
      }
    });
    return NextResponse.json(order, { status: 201 });
  });
}
