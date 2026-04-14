import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withTenant } from '@/lib/api-middleware';

/**
 * Create a ticket identifier string in the format `TKT-CS-YYYYMM-RRRR`.
 *
 * The value uses the current year and month and appends a zero-padded four-digit random number.
 *
 * @returns A string formatted as `TKT-CS-YYYYMM-RRRR` where `YYYY` is the four-digit year, `MM` is the two-digit month, and `RRRR` is a zero-padded random number from `0000` to `9999`.
 */
function generateTicketNumber(): string {
  const date = new Date();
  return `TKT-CS-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
}

/**
 * Fetches laundry tickets for the current tenant, optionally filtered by `status` and `customerId`.
 *
 * @param request - The incoming Next.js request; reads `status` and `customerId` from the query string
 * @returns A JSON response containing the list of matching tickets, each including the related customer's `name` and `phone`
 */
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

/**
 * Creates a new laundry ticket for the current tenant from the JSON request body.
 *
 * Expects the request body to be a JSON object with required fields `customerId`, `subject`, and `message`. Optional fields: `orderId`, `priority` (defaults to `"medium"`), and `type` (defaults to `"complaint"`). If required fields are missing, the handler responds with a 400 JSON error object.
 *
 * @param request - The incoming Next.js request whose JSON body contains the ticket data
 * @returns The created laundry ticket object (returned as the JSON response body)
 */
export async function POST(request: NextRequest) {
  return withTenant(request, async (tenantId: string) => {
    const body = await request.json();

    if (!body.customerId || !body.subject || !body.message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

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
  });
}
