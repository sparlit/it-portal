import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const secretKey = process.env.JWT_SECRET || 'fallback-secret-key-for-dev-only';
const key = new TextEncoder().encode(secretKey);

/**
 * Signs the provided payload into a JWT using HS256 and a 24-hour expiration.
 *
 * The token includes an issued-at timestamp and the given payload as its claims.
 *
 * @param payload - The object to embed in the token's payload/claims
 * @returns The signed JWT string
 */
export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(key);
}

/**
 * Verifies a JWT signed with the module's HS256 key and returns its decoded payload.
 *
 * @param input - The JWT string to verify
 * @returns The decoded JWT payload
 */
export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ['HS256'],
  });
  return payload;
}

/**
 * Retrieve the current session payload from the `session` cookie or `null` if absent.
 *
 * @returns The decrypted session payload when a `session` cookie exists, `null` otherwise.
 */
export async function getSession() {
  const session = cookies().get('session')?.value;
  if (!session) return null;
  return await decrypt(session);
}

/**
 * Refreshes the session cookie found on the provided request and returns a response with the updated cookie.
 *
 * @param request - The incoming NextRequest from which to read the `session` cookie
 * @returns A `NextResponse` whose `session` cookie has been refreshed to expire 24 hours from now, or `undefined` if no `session` cookie was present
 */
export async function updateSession(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  if (!session) return;

  // Refresh the session so it doesn't expire
  const parsed = await decrypt(session);
  parsed.expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const res = NextResponse.next();
  res.cookies.set({
    name: 'session',
    value: await encrypt(parsed),
    httpOnly: true,
    expires: parsed.expires,
  });
  return res;
}
