import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withRBAC } from '@/lib/api-middleware';

import { v4 as uuidv4 } from 'uuid';

function generateTicketNumber(): string {
  const date = new Date();
  const prefix = `TKT-IT-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}`;
  const random = uuidv4().split('-')[0].toUpperCase();
  return `${prefix}-${random}`;
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
    const body = await request.json();

    if (!body.title || !body.requester) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const ticket = await prisma.iTTicket.create({
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

    // Production-Standard: Audit Logging
    await prisma.activityLog.create({
      data: {
        tenantId,
        user: user?.name || 'System',
        action: `Created IT Ticket ${ticket.ticketId}: ${ticket.title}`
      }
    });

    return NextResponse.json(ticket, { status: 201 });
  });
}
