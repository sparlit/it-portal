import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withTenant } from '@/lib/api-middleware';
import { randomBytes } from 'crypto';

function generateTicketNumber(): string {
  const date = new Date();
  // Use high-entropy suffix with crypto-random 8-character hex string
  const randomSuffix = randomBytes(4).toString('hex').toUpperCase();
  return `TKT-IT-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}-${randomSuffix}`;
}

export async function GET(request: NextRequest) {
  return withTenant(request, async (tenantId: string) => {
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
  return withTenant(request, async (tenantId: string) => {
    const body = await request.json();

    if (!body.title || !body.requester) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Retry logic for unique constraint violations
    const maxRetries = 5;
    let lastError: any = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const ticket = await prisma.iTTicket.create({
          data: {
            tenantId,
            ticketId: generateTicketNumber(),
            title: body.title,
            description: body.description,
            priority: body.priority || 'medium',
            category: body.category,
            requester: body.requester,
            assignedTo: body.assignedTo,
            slaDeadline: body.slaDeadline
          }
        });

        return NextResponse.json(ticket, { status: 201 });
      } catch (error: any) {
        // Check for unique constraint violation on tenantId+ticketId
        if (error.code === 'P2002' && error.meta?.target?.includes('ticketId')) {
          lastError = error;
          // Retry with a new ticketId
          continue;
        }
        // Different error, throw immediately
        throw error;
      }
    }

    // All retries exhausted
    return NextResponse.json(
      { error: 'Failed to generate unique ticket ID after multiple attempts' },
      { status: 500 }
    );
  });
}