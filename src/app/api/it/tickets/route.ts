import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withRBAC } from '@/lib/api-middleware';
import { ITTicketCreateSchema } from '@/lib/validations/tickets';
import { v4 as uuidv4 } from 'uuid';

function generateTicketNumber(): string {
  const date = new Date();
  const yearMonth = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}`;
  const shortUuid = uuidv4().split('-')[0].toUpperCase();
  return `TKT-IT-${yearMonth}-${shortUuid}`;
}

export async function GET(request: NextRequest) {
  return withRBAC(request, 'read', 'ITTicket', async (tenantId: string) => {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');

    const where: any = { tenantId };
    if (status) where.status = status;
    if (priority) where.priority = priority;

    const tickets = await prisma.iTTicket.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(tickets);
  });
}

export async function POST(request: NextRequest) {
  return withRBAC(request, 'create', 'ITTicket', async (tenantId: string, user: any) => {
    try {
      const json = await request.json();
      const body = ITTicketCreateSchema.parse(json);

      const ticket = await prisma.iTTicket.create({
        data: {
          tenantId,
          ticketId: generateTicketNumber(),
          title: body.title,
          description: body.description,
          priority: body.priority,
          category: body.category,
          requester: body.requester,
          assignedTo: body.assignedTo,
          slaDeadline: body.slaDeadline,
          status: 'open'
        }
      });

      // Audit Log
      await prisma.activityLog.create({
        data: {
          tenantId,
          user: user?.username || 'system',
          action: `Created IT Ticket ${ticket.ticketId}: ${ticket.title}`
        }
      });

      return NextResponse.json(ticket, { status: 201 });
    } catch (error: any) {
      if (error.issues) {
        return NextResponse.json({ error: 'Validation Failed', details: error.issues }, { status: 400 });
      }
      return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
  });
}
