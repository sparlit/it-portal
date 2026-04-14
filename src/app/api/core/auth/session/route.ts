import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/lib/auth';

/**
 * Checks the request's `session` cookie and returns the authentication status and user when the session is valid.
 *
 * @returns A JSON response: `{ authenticated: true, user }` when a valid session cookie decrypts to a payload containing `user`; otherwise `{ authenticated: false }` and an HTTP 401 status.
 */
export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('session')?.value;

    if (!sessionToken) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const payload = await decrypt(sessionToken);

    if (!payload || !payload.user) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      user: payload.user
    });
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
