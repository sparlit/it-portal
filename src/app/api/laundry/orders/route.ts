import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withTenant } from '@/lib/api-middleware';

export async function GET(request: NextRequest) {
  return withTenant(request, async (tenantId: string) => {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const customerId = searchParams.get('customerId');

    const where: any = { tenantId };
    if (status) where.status = status;
    if (customerId) where.customerId = customerId;

    const orders = await prisma.laundryOrder.findMany({
      where,
      include: {
        customer: { select: { name: true, phone: true } },
        items: { include: { service: true } },
        logistics: true
      },
      orderBy: { receivedAt: 'desc' }
    });

    return NextResponse.json(orders);
  });
}

export async function POST(request: NextRequest) {
  return withTenant(request, async (tenantId: string) => {
    const body = await request.json();
    const { customerId, items, expectedDate, notes, address } = body;

    if (!customerId || !items || items.length === 0) {
      return NextResponse.json({ error: 'Customer and items are required' }, { status: 400 });
    }

    // Calculate total amount
    const totalAmount = items.reduce((sum: number, item: any) => sum + (item.quantity * item.unitPrice), 0);

    const orderNumber = `LND-${Date.now().toString().slice(-6)}`;

    const order = await prisma.laundryOrder.create({
      data: {
        tenantId,
        orderNumber,
        customerId,
        totalAmount,
        notes,
        expectedDate: expectedDate ? new Date(expectedDate) : null,
        status: 'received',
        items: {
          create: items.map((item: any) => ({
            serviceId: item.serviceId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            subtotal: item.quantity * item.unitPrice,
            garmentType: item.garmentType,
            color: item.color,
            specialInstructions: item.specialInstructions
          }))
        },
        logistics: address ? {
          create: {
            address,
            pickupScheduledAt: new Date()
          }
        } : undefined
      },
      include: {
        items: true,
        logistics: true
      }
    });

    return NextResponse.json(order, { status: 201 });
  });
}
