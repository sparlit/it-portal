import { NextRequest, NextResponse } from 'next/server';
import { withRBAC } from '@/lib/api-middleware';
import { TicketingService } from '@/services/TicketingService';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const TicketSchema = z.object({
  title: z.string().min(1),
  requester: z.string().min(1),
  description: z.string().optional(),
  priority: z.string().optional(),
  category: z.string().optional(),
  assignedTo: z.string().optional(),
  slaDeadline: z.string().optional()
});

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
    try {
      const body = await request.json();
      const result = TicketSchema.safeParse(body);

      if (!result.success) {
        return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
      }

      const ticket = await TicketingService.createITTicket(tenantId, result.data, user);
      return NextResponse.json(ticket, { status: 201 });
    } catch (error) {
      return NextResponse.json({ error: 'Failed to create ticket' }, { status: 500 });
    }
  });
}
