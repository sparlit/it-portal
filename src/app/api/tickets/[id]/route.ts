import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withRBAC } from '@/lib/api-middleware';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return withRBAC(request, 'read', 'Ticket', async (tenantId: string) => {
    const ticket = await prisma.ticket.findFirst({
      where: { id, tenantId }
    });

    if (!ticket) return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    return NextResponse.json(ticket);
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return withRBAC(request, 'update', 'Ticket', async (tenantId: string) => {
    const body = await request.json();

    // Industrial check: Ensure ticket exists in tenant
    const existing = await prisma.ticket.findFirst({ where: { id, tenantId } });
    if (!existing) return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });

    const ticket = await prisma.ticket.update({
      where: { id },
      data: { ...body }
    });

    // Escalation Log
    if (body.escalationLevel && body.escalationLevel > existing.escalationLevel) {
       await prisma.activityLog.create({
        data: {
          tenantId,
          user: 'system',
          action: 'UPDATE',
          module: 'TICKETING',
          entityId: id,
          details: `Ticket ${ticket.ticketId} escalated to level ${body.escalationLevel}`
        }
      });
    }

    return NextResponse.json(ticket);
  });
}
