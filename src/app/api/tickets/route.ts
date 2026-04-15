import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withRBAC } from '@/lib/api-middleware';

/**
 * Artemis Advanced Unified Ticketing API
 * Supports IT & Laundry modules with SLA tracking.
 */

export async function GET(request: NextRequest) {
  return withRBAC(request, 'read', 'Ticket', async (tenantId: string) => {
    const { searchParams } = new URL(request.url);
    const module = searchParams.get('module');
    const status = searchParams.get('status');

    const where: any = { tenantId };
    if (module) where.module = module;
    if (status) where.status = status;

    const tickets = await prisma.ticket.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(tickets);
  });
}

export async function POST(request: NextRequest) {
  return withRBAC(request, 'create', 'Ticket', async (tenantId: string) => {
    const body = await request.json();

    // Auto-generate human readable Ticket ID
    const count = await prisma.ticket.count({ where: { tenantId } });
    const ticketId = `TKT-${1000 + count + 1}`;

    // SLA Logic: Critical = 4h, High = 8h, Medium = 24h, Low = 72h
    const slaHours = body.priority === 'critical' ? 4 : body.priority === 'high' ? 8 : body.priority === 'medium' ? 24 : 72;
    const slaDeadline = new Date();
    slaDeadline.setHours(slaDeadline.getHours() + slaHours);

    const ticket = await prisma.ticket.create({
      data: {
        ...body,
        tenantId,
        ticketId,
        slaDeadline,
        status: 'open',
        escalationLevel: 0
      }
    });

    // Log Activity (Industrial Audit Requirement)
    await prisma.activityLog.create({
      data: {
        tenantId,
        user: 'system', // Should be replaced with actual user from auth
        action: 'CREATE',
        module: 'TICKETING',
        entityId: ticket.id,
        details: `Created ${body.module} ticket: ${ticketId}`
      }
    });

    return NextResponse.json(ticket, { status: 201 });
  });
}
