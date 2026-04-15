import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withRBAC } from '@/lib/api-middleware';
import { AuditService } from '@/services/AuditService';
import { z } from 'zod';

const TicketUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  status: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  category: z.string().optional().nullable(),
  assignedTo: z.string().optional().nullable(),
  resolution: z.string().optional().nullable(),
  slaDeadline: z.string().optional().nullable(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withRBAC(request, 'read', 'ITTicket', async (tenantId) => {
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
  return withRBAC(request, 'manage', 'ITTicket', async (tenantId, user) => {
    try {
      const body = await request.json();
      const validatedData = TicketUpdateSchema.parse(body);

      const ticket = await prisma.iTTicket.update({
        where: {
          id: params.id,
          tenantId
        },
        data: validatedData
      });

      await AuditService.logActivity(tenantId, user.id, user.username, `Updated IT Ticket: ${ticket.ticketId}`);

      return NextResponse.json(ticket);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json({ error: error.issues }, { status: 400 });
      }
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withRBAC(request, 'manage', 'ITTicket', async (tenantId, user) => {
    try {
      const ticket = await prisma.iTTicket.delete({
        where: {
          id: params.id,
          tenantId
        }
      });

      await AuditService.logActivity(tenantId, user.id, user.username, `Deleted IT Ticket: ${ticket.ticketId}`);

      return NextResponse.json({ message: 'Ticket deleted successfully' });
    } catch (error) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }
  });
}
