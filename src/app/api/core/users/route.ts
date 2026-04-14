import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withTenant } from '@/lib/api-middleware';
import bcrypt from 'bcryptjs';

/**
 * Fetches all users belonging to the current tenant.
 *
 * Returns each user with the fields: `id`, `username`, `name`, `email`, `role`, `status`, and `createdAt`.
 *
 * @returns An array of user objects containing `id`, `username`, `name`, `email`, `role`, `status`, and `createdAt`
 */
export async function GET(request: NextRequest) {
  return withTenant(request, async (tenantId: string) => {
    const users = await prisma.user.findMany({
      where: { tenantId },
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
    return NextResponse.json(users);
  });
}

/**
 * Create a new user for the current tenant and return the created user without the `password` field.
 *
 * @returns A NextResponse containing the created user object without the `password` field and status 201, or a JSON error `{ error: 'Missing required fields' }` with status 400 when `username`, `password`, or `name` are missing.
 */
export async function POST(request: NextRequest) {
  return withTenant(request, async (tenantId: string) => {
    const body = await request.json();
    const { username, password, name, email, role } = body;

    if (!username || !password || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        tenantId,
        username: username.toLowerCase(),
        password: hashedPassword,
        name,
        email,
        role: role || 'user'
      }
    });

    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword, { status: 201 });
  });
}
