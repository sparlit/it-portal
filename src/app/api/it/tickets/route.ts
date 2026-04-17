import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withTenant } from '@/lib/api-middleware';

function generateTicketNumber(): string {
  const date = new Date();
  return `TKT-IT-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
}

export async function GET(request: NextRequest) {
  return withTenant(request, async (tenantId: string) => {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');

    const where: any = { tenantId };
    if (status) where.status = status;
    if (priority) where.priority = priority;

    const tickets = await prisma.iT_Ticket.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(tickets);
  });
}

export async function POST(request: NextRequest) {
  return withTenant(request, async (tenantId: string) => {
    const body = await request.json();

    if (!body.title || !body.requester) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const ticket = await prisma.iT_Ticket.create({
      data: {
        tenantId,
        ticketId: generateTicketNumber(),
        title: body.title,
        description: body.description,
        priority: body.priority || 'medium',
        category: body.category,
        requester: body.requester,
        assignedTo: body.assignedTo,
        slaDeadline: body.slaDeadline
      }
    });

    return NextResponse.json(ticket, { status: 201 });
  });
}
