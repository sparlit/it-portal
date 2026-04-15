import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withRBAC } from '@/lib/api-middleware';
import { AuditService } from '@/services/AuditService';
import { z } from 'zod';

const TicketSchema = z.object({
  customerId: z.string().min(1),
  orderId: z.string().optional().nullable(),
  subject: z.string().min(1),
  message: z.string().min(1),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  type: z.enum(['complaint', 'feedback', 'inquiry']).default('complaint'),
});

function generateTicketNumber(): string {
  const date = new Date();
  return `TKT-CS-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
}

export async function GET(request: NextRequest) {
  return withRBAC(request, 'read', 'LaundryTicket', async (tenantId) => {
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
  return withRBAC(request, 'manage', 'LaundryTicket', async (tenantId, user) => {
    try {
      const body = await request.json();
      const validatedData = TicketSchema.parse(body);

      const ticket = await prisma.laundryTicket.create({
        data: {
          tenantId,
          ticketId: generateTicketNumber(),
          ...validatedData,
          status: 'open'
        }
      });

      await AuditService.logActivity(tenantId, user.id, user.username, `Created Laundry Ticket: ${ticket.ticketId}`);

      return NextResponse.json(ticket, { status: 201 });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json({ error: error.issues }, { status: 400 });
      }
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  });
}
