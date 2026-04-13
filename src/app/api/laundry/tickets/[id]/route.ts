import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withTenant } from '@/lib/api-middleware';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withTenant(request, async (tenantId: string) => {
    const ticket = await prisma.laundryTicket.findFirst({
      where: {
        id: params.id,
        tenantId
      },
      include: {
        customer: true
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

    const ticket = await prisma.laundryTicket.updateMany({
      where: {
        id: params.id,
        tenantId
      },
      data: {
        subject: body.subject,
        message: body.message,
        status: body.status,
        priority: body.priority,
        type: body.type,
        resolution: body.resolution
      }
    });

    if (ticket.count === 0) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    const updatedTicket = await prisma.laundryTicket.findUnique({
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
    const result = await prisma.laundryTicket.deleteMany({
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
