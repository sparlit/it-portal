import { NextRequest, NextResponse } from 'next/server';
import { withRBAC } from '@/lib/api-middleware';
import { TicketingService } from '@/services/TicketingService';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const TicketSchema = z.object({
  customerId: z.string().min(1),
  subject: z.string().min(1),
  message: z.string().min(1),
  orderId: z.string().optional(),
  priority: z.string().optional(),
  type: z.string().optional()
});

export async function GET(request: NextRequest) {
  return withRBAC(request, 'read', 'LaundryTicket', async (tenantId: string) => {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const customerId = searchParams.get('customerId');

    const where: any = { tenantId };
    if (status) where.status = status;
    if (customerId) where.customerId = customerId;

    const tickets = await prisma.laundryTicket.findMany({
      where,
      include: {
        customer: {
          select: { name: true, phone: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(tickets);
  });
}

export async function POST(request: NextRequest) {
  return withRBAC(request, 'create', 'LaundryTicket', async (tenantId: string, user: any) => {
    try {
      const body = await request.json();
      const result = TicketSchema.safeParse(body);

      if (!result.success) {
        return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
      }

      const ticket = await TicketingService.createLaundryTicket(tenantId, result.data, user);
      return NextResponse.json(ticket, { status: 201 });
    } catch (error) {
      return NextResponse.json({ error: 'Failed to create laundry ticket' }, { status: 500 });
    }
  });
}
