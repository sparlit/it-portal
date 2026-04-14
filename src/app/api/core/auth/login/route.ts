import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { encrypt } from '@/lib/auth';

/**
 * Handle a login request: authenticate credentials, create an encrypted session cookie, and return the authenticated user's public fields.
 *
 * @param request - NextRequest whose JSON body must include `username` and `password`
 * @returns A NextResponse:
 *  - 200 with `{ user: { id, username, name, role, tenantId } }` and an HTTP-only `session` cookie on successful authentication
 *  - 400 with `{ error: 'Username and password are required' }` when `username` or `password` is missing
 *  - 401 with `{ error: 'Invalid credentials' }` when authentication fails
 *  - 500 with `{ error: 'Internal server error' }` on unexpected errors
 */
export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: username.toLowerCase() },
          { email: username.toLowerCase() }
        ],
        status: 'active'
      }
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    const session = await encrypt({
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
        tenantId: user.tenantId
      },
      expires
    });

    const response = NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
        tenantId: user.tenantId
      }
    });

    response.cookies.set('session', session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
