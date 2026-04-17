import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withTenant } from '@/lib/api-middleware';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withTenant(request, async (tenantId: string) => {
    const ticket = await prisma.iT_Ticket.findFirst({
      where: {
        id: params.id,
        tenantId
      }
    });

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    return NextResponse.json(ticket);
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withTenant(request, async (tenantId: string) => {
    const body = await request.json();

    const ticket = await prisma.iT_Ticket.updateMany({
      where: {
        id: params.id,
        tenantId
      },
      data: {
        title: body.title,
        description: body.description,
        status: body.status,
        priority: body.priority,
        category: body.category,
        assignedTo: body.assignedTo,
        resolution: body.resolution,
        slaDeadline: body.slaDeadline
      }
    });

    if (ticket.count === 0) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    const updatedTicket = await prisma.iT_Ticket.findUnique({
      where: { id: params.id }
    });

    return NextResponse.json(updatedTicket);
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withTenant(request, async (tenantId: string) => {
    const result = await prisma.iT_Ticket.deleteMany({
      where: {
        id: params.id,
        tenantId
      }
    });

    if (result.count === 0) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Ticket deleted successfully' });
  });
}
