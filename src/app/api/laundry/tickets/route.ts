import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withRBAC } from '@/lib/api-middleware';

import { v4 as uuidv4 } from 'uuid';

function generateTicketNumber(): string {
  const date = new Date();
  const prefix = `TKT-CS-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}`;
  const random = uuidv4().split('-')[0].toUpperCase();
  return `${prefix}-${random}`;
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
    const body = await request.json();

    if (!body.customerId || !body.subject || !body.message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const ticket = await prisma.laundryTicket.create({
      data: {
        tenantId,
        ticketId: generateTicketNumber(),
        customerId: body.customerId,
        orderId: body.orderId,
        subject: body.subject,
        message: body.message,
        priority: body.priority || 'medium',
        type: body.type || 'complaint',
        status: 'open'
      }
    });

    // Production-Standard: Audit Logging
    await prisma.activityLog.create({
      data: {
        tenantId,
        user: user?.name || 'System',
        action: `Created Laundry Ticket ${ticket.ticketId}: ${ticket.subject}`
      }
    });

    return NextResponse.json(ticket, { status: 201 });
  });
}
