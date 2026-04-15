import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withRBAC } from '@/lib/api-middleware';
import { LaundryTicketCreateSchema } from '@/lib/validations/tickets';
import { v4 as uuidv4 } from 'uuid';
import { AuditService } from '@/services/AuditService';

function generateTicketNumber(): string {
  const date = new Date();
  const yearMonth = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}`;
  const shortUuid = uuidv4().split('-')[0].toUpperCase();
  return `TKT-CS-${yearMonth}-${shortUuid}`;
}

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
      const json = await request.json();
      const body = LaundryTicketCreateSchema.parse(json);

      const ticket = await prisma.laundryTicket.create({
        data: {
          tenantId,
          ticketId: generateTicketNumber(),
          customerId: body.customerId,
          orderId: body.orderId,
          subject: body.subject,
          message: body.message,
          priority: body.priority,
          type: body.type,
          status: 'open'
        }
      });

      await AuditService.logAction(tenantId, user?.username || 'system', `Created Laundry CS Ticket ${ticket.ticketId} for customer ${ticket.customerId}`);

      return NextResponse.json(ticket, { status: 201 });
    } catch (error: any) {
      if (error.issues) {
        return NextResponse.json({ error: 'Validation Failed', details: error.issues }, { status: 400 });
      }
      return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
  });
}
