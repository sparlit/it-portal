import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withTenant } from '@/lib/api-middleware';

/**
 * Fetches a user by route `id` within the current tenant and returns the user's public fields.
 *
 * @param params - Route parameters containing the `id` of the user to retrieve
 * @returns The selected user object (`id`, `username`, `name`, `email`, `role`, `status`, `createdAt`) if found; otherwise a JSON error payload `{ error: 'User not found' }` with HTTP status 404
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withTenant(request, async (tenantId: string) => {
    const user = await prisma.user.findFirst({
      where: {
        id: params.id,
        tenantId
      },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  });
}

/**
 * Update the user identified by the route `id` within the current tenant.
 *
 * The request body should include `name`, `email`, `role`, and `status` to apply to the user record.
 *
 * @param params - Route parameters containing `id`, the user identifier to update
 * @returns A JSON response: `{"error":"User not found"}` with HTTP 404 if no matching user exists; otherwise `{"message":"User updated successfully"}`.
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withTenant(request, async (tenantId: string) => {
    const body = await request.json();

    const user = await prisma.user.updateMany({
      where: {
        id: params.id,
        tenantId
      },
      data: {
        name: body.name,
        email: body.email,
        role: body.role,
        status: body.status
      }
    });

    if (user.count === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'User updated successfully' });
  });
}
