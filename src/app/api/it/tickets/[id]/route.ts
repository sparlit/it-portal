import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withTenant } from '@/lib/api-middleware';

/**
 * Fetches an IT ticket by ID for the current tenant and returns it as JSON.
 *
 * @param params.id - The ID of the ticket to retrieve
 * @returns A JSON response containing the ticket object when found; otherwise a JSON error object `{ error: 'Ticket not found' }` with a 404 status
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withTenant(request, async (tenantId: string) => {
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

/**
 * Update an IT ticket by ID for the current tenant.
 *
 * @param params - Route parameters
 * @param params.id - The ID of the ticket to update
 * @returns The updated ticket object as JSON if the ticket was found and updated; a JSON error `{ error: 'Ticket not found' }` with HTTP 404 otherwise
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withTenant(request, async (tenantId: string) => {
    const body = await request.json();

    const ticket = await prisma.iTTicket.updateMany({
      where: {
        id: params.id,
        tenantId
      },
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

    if (ticket.count === 0) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    const updatedTicket = await prisma.iTTicket.findUnique({
      where: { id: params.id }
    });

    return NextResponse.json(updatedTicket);
  });
}

/**
 * Deletes the IT ticket with the specified `id` scoped to the current tenant.
 *
 * If no ticket matches the given `id` and tenant, responds with a 404 JSON error.
 *
 * @param params - Route parameters
 * @param params.id - The ID of the ticket to delete
 * @returns A NextResponse containing `{ error: 'Ticket not found' }` with status 404 if no matching ticket was deleted, otherwise `{ message: 'Ticket deleted successfully' }`.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withTenant(request, async (tenantId: string) => {
    const result = await prisma.iTTicket.deleteMany({
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
