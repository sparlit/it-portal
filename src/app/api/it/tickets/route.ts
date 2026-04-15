import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withRBAC } from '@/lib/api-middleware';
import { AuditService } from '@/services/AuditService';
import { z } from 'zod';

const TicketSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  category: z.string().optional(),
  requester: z.string().min(1),
  assignedTo: z.string().optional(),
  slaDeadline: z.string().optional(),
});

function generateTicketNumber(): string {
  const date = new Date();
  return `TKT-IT-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
}

export async function GET(request: NextRequest) {
  return withRBAC(request, 'read', 'ITTicket', async (tenantId) => {
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
  return withRBAC(request, 'manage', 'ITTicket', async (tenantId, user) => {
    try {
      const body = await request.json();
      const validatedData = TicketSchema.parse(body);

      const ticket = await prisma.iTTicket.create({
        data: {
          tenantId,
          ticketId: generateTicketNumber(),
          ...validatedData
        }
      });

      await AuditService.logActivity(tenantId, user.id, user.username, `Created IT Ticket: ${ticket.ticketId}`);

      return NextResponse.json(ticket, { status: 201 });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json({ error: error.issues }, { status: 400 });
      }
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  });
}
