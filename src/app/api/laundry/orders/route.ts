import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withRBAC } from '@/lib/api-middleware';
import { AuditService } from '@/services/AuditService';
import { z } from 'zod';

const OrderItemSchema = z.object({
  serviceId: z.string().min(1),
  quantity: z.number().int().positive(),
  garmentType: z.string().optional(),
  color: z.string().optional(),
  specialInstructions: z.string().optional(),
});

const CreateOrderSchema = z.object({
  customerId: z.string().min(1),
  items: z.array(OrderItemSchema).min(1),
  expectedDate: z.string().optional(),
  notes: z.string().optional(),
  address: z.string().optional(),
});

export async function GET(request: NextRequest) {
  return withRBAC(request, 'read', 'LaundryOrder', async (tenantId) => {
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
  return withRBAC(request, 'manage', 'LaundryOrder', async (tenantId, user) => {
    try {
      const body = await request.json();
      const validatedData = CreateOrderSchema.parse(body);

      // Fetch services to verify pricing (Industrial standard: server-side price verification)
      const serviceIds = validatedData.items.map(i => i.serviceId);
      const services = await prisma.laundryService.findMany({
        where: {
          id: { in: serviceIds },
          tenantId
        }
      });

      if (services.length !== new Set(serviceIds).size) {
        return NextResponse.json({ error: 'One or more service IDs are invalid or belong to another tenant' }, { status: 400 });
      }

      const serviceMap = new Map(services.map(s => [s.id, s]));

      let totalAmount = 0;
      const orderItems = validatedData.items.map(item => {
        const service = serviceMap.get(item.serviceId)!;
        const subtotal = item.quantity * service.price;
        totalAmount += subtotal;

        return {
          serviceId: item.serviceId,
          quantity: item.quantity,
          unitPrice: service.price,
          subtotal,
          garmentType: item.garmentType,
          color: item.color,
          specialInstructions: item.specialInstructions
        };
      });

      const orderNumber = `LND-${Date.now().toString().slice(-6)}`;

      const order = await prisma.laundryOrder.create({
        data: {
          tenantId,
          orderNumber,
          customerId: validatedData.customerId,
          totalAmount,
          notes: validatedData.notes,
          expectedDate: validatedData.expectedDate ? new Date(validatedData.expectedDate) : null,
          status: 'received',
          items: {
            create: orderItems
          },
          logistics: validatedData.address ? {
            create: {
              address: validatedData.address,
              pickupScheduledAt: new Date()
            }
          } : undefined
        },
        include: {
          items: true,
          logistics: true
        }
      });

      await AuditService.logActivity(tenantId, user.id, user.username, `Created Laundry Order: ${order.orderNumber}`);

      return NextResponse.json(order, { status: 201 });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json({ error: error.issues }, { status: 400 });
      }
      console.error('Order creation error:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  });
}
