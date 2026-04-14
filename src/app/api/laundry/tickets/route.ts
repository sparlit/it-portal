import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withTenant } from '@/lib/api-middleware';
import { randomBytes } from 'crypto';

function generateTicketNumber(): string {
  const date = new Date();
  // Use high-entropy suffix with crypto-random 8-character hex string
  const randomSuffix = randomBytes(4).toString('hex').toUpperCase();
  return `TKT-CS-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}-${randomSuffix}`;
}

export async function GET(request: NextRequest) {
  return withTenant(request, async (tenantId: string) => {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const customerId = searchParams.get('customerId');

    const where: any = { tenantId };
    if (status) where.status = status;
    if (customerId) where.customerId = customerId;

    const tickets = await prisma.laundryTicket.findMany({
      where,
      include: {
        customer: {
          select: { name: true, phone: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(tickets);
  });
}

export async function POST(request: NextRequest) {
  return withTenant(request, async (tenantId: string) => {
    const body = await request.json();

    if (!body.customerId || !body.subject || !body.message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Retry logic for unique constraint violations
    const maxRetries = 5;
    let lastError: any = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const ticket = await prisma.laundryTicket.create({
          data: {
            tenantId,
            ticketId: generateTicketNumber(),
            customerId: body.customerId,
            orderId: body.orderId,
            subject: body.subject,
            message: body.message,
            priority: body.priority || 'medium',
            type: body.type || 'complaint',
            status: 'open'
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