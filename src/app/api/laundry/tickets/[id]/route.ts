import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withRBAC } from '@/lib/api-middleware';
import { LaundryTicketUpdateSchema } from '@/lib/validations/tickets';
import { AuditService } from '@/services/AuditService';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withRBAC(request, 'read', 'LaundryTicket', async (tenantId: string) => {
    const ticket = await prisma.laundryTicket.findFirst({
      where: {
        id: params.id,
        tenantId
      },
      include: {
        customer: {
          select: { name: true, phone: true }
        }
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
  return withRBAC(request, 'update', 'LaundryTicket', async (tenantId: string, user: any) => {
    try {
      const json = await request.json();
      const body = LaundryTicketUpdateSchema.parse(json);

      const existingTicket = await prisma.laundryTicket.findFirst({
        where: { id: params.id, tenantId }
      });

      if (!existingTicket) {
        return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
      }

      const updatedTicket = await prisma.laundryTicket.update({
        where: { id: params.id },
        data: {
          subject: body.subject,
          message: body.message,
          priority: body.priority,
          status: body.status,
          type: body.type,
          resolution: body.resolution
        }
      });

      await AuditService.logAction(tenantId, user?.username || 'system', `Updated Laundry CS Ticket ${updatedTicket.ticketId} status to ${updatedTicket.status}`);

      return NextResponse.json(updatedTicket);
    } catch (error: any) {
      if (error.issues) {
        return NextResponse.json({ error: 'Validation Failed', details: error.issues }, { status: 400 });
      }
      return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withRBAC(request, 'delete', 'LaundryTicket', async (tenantId: string, user: any) => {
    const existingTicket = await prisma.laundryTicket.findFirst({
      where: { id: params.id, tenantId }
    });

    if (!existingTicket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    await prisma.laundryTicket.delete({
      where: { id: params.id }
    });

    await AuditService.logAction(tenantId, user?.username || 'system', `Deleted Laundry CS Ticket ${existingTicket.ticketId}`);

    return NextResponse.json({ message: 'Ticket deleted successfully' });
  });
}
