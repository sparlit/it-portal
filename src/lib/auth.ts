import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// Validate JWT_SECRET - fail fast in production, warn in development
const getSecretKey = (): string => {
  const jwtSecret = process.env.JWT_SECRET;
  const nodeEnv = process.env.NODE_ENV;

  if (!jwtSecret) {
    if (nodeEnv === 'production') {
      console.error('FATAL: JWT_SECRET is not set in production environment');
      throw new Error('JWT_SECRET must be set in production');
    } else {
      console.warn(
        'WARNING: JWT_SECRET is not set. Using fallback for development only. ' +
        'This is INSECURE and must not be used in production!'
      );
      return 'fallback-secret-key-for-dev-only';
    }
  }

  return jwtSecret;
};

let cachedSecretKey: string | null = null;
let cachedKey: Uint8Array | null = null;

const getKey = (): Uint8Array => {
  if (!cachedKey) {
    cachedSecretKey = getSecretKey();
    cachedKey = new TextEncoder().encode(cachedSecretKey);
  }
  return cachedKey;
};

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(getKey());
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, getKey(), {
    algorithms: ['HS256'],
  });
  return payload;
}

export async function getSession() {
  const session = cookies().get('session')?.value;
  if (!session) return null;
  return await decrypt(session);
}

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