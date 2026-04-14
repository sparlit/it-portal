import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withTenant } from '@/lib/api-middleware';

/**
 * Generate a new IT ticket identifier using the project's ticket naming scheme.
 *
 * The identifier is formatted as `TKT-IT-YYYYMM-XXXX` where `YYYY` is the four-digit year,
 * `MM` is the two-digit month, and `XXXX` is a zero-padded four-digit numeric suffix.
 *
 * @returns A ticket identifier string in the form `TKT-IT-YYYYMM-XXXX`
 */
function generateTicketNumber(): string {
  const date = new Date();
  return `TKT-IT-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
}

/**
 * Retrieve IT tickets for the current tenant, optionally filtered by `status` and `priority`.
 *
 * @param request - Next.js request whose query may include `status` and/or `priority` to filter results
 * @returns A NextResponse whose JSON body is the array of matching IT ticket records ordered by `createdAt` descending
 */
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

/**
 * Create a new IT ticket for the current tenant using the request JSON.
 *
 * Expects the request body to be a JSON object with at least `title` and `requester`.
 * Optional fields include `description`, `priority`, `category`, `assignedTo`, and `slaDeadline`.
 * When `priority` is omitted, it defaults to `"medium"`.
 *
 * @param request - The incoming Next.js request whose JSON body contains ticket fields.
 * @returns The created ticket object as JSON. If `title` or `requester` is missing, returns a JSON error object with HTTP status 400.
 */
export async function POST(request: NextRequest) {
  return withTenant(request, async (tenantId: string) => {
    const body = await request.json();

    if (!body.title || !body.requester) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

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
  });
}
