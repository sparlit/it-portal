import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withTenant } from '@/lib/api-middleware';

/**
 * Retrieve a laundry ticket by ID for the current tenant, including its related customer.
 *
 * @returns The ticket object (including `customer`) if found; otherwise an error JSON `{ error: 'Ticket not found' }` with HTTP 404.
 */
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

/**
 * Update specified fields of a laundry ticket belonging to the current tenant.
 *
 * The request body may include any of: `subject`, `message`, `status`, `priority`, `type`, and `resolution`.
 *
 * @param params.id - The ID of the ticket to update
 * @returns The updated laundry ticket object if the update succeeded; otherwise an error object `{ error: 'Ticket not found' }` with HTTP 404 status when no matching ticket exists.
 */
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

/**
 * Delete the laundry ticket specified by the route `id` within the current tenant.
 *
 * @param params - Route parameters containing `id`, the ticket identifier to delete
 * @returns `NextResponse` with status 404 and `{ error: 'Ticket not found' }` if no matching ticket exists for the tenant, otherwise status 200 with `{ message: 'Ticket deleted successfully' }`
 */
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
