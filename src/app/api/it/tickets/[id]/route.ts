import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withRBAC } from '@/lib/api-middleware';
import { ITTicketUpdateSchema } from '@/lib/validations/tickets';
import { AuditService } from '@/services/AuditService';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withRBAC(request, 'read', 'ITTicket', async (tenantId: string) => {
    const ticket = await prisma.iTTicket.findFirst({
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
  return withRBAC(request, 'update', 'ITTicket', async (tenantId: string, user: any) => {
    try {
      const json = await request.json();
      const body = ITTicketUpdateSchema.parse(json);

      const existingTicket = await prisma.iTTicket.findFirst({
        where: { id: params.id, tenantId }
      });

      if (!existingTicket) {
        return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
      }

      const updatedTicket = await prisma.iTTicket.update({
        where: { id: params.id },
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

      await AuditService.logAction(tenantId, user?.username || 'system', `Updated IT Ticket ${updatedTicket.ticketId} status to ${updatedTicket.status}`);

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
  return withRBAC(request, 'delete', 'ITTicket', async (tenantId: string, user: any) => {
    const existingTicket = await prisma.iTTicket.findFirst({
      where: { id: params.id, tenantId }
    });

    if (!existingTicket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    await prisma.iTTicket.delete({
      where: { id: params.id }
    });

    await AuditService.logAction(tenantId, user?.username || 'system', `Deleted IT Ticket ${existingTicket.ticketId}`);

    return NextResponse.json({ message: 'Ticket deleted successfully' });
  });
}
