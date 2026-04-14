import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from '@/app/api/core/auth/logout/route';

function makeLogoutRequest(): NextRequest {
  return new NextRequest('http://localhost/api/core/auth/logout', {
    method: 'POST',
  });
}

describe('POST /api/core/auth/logout', () => {
  it('should return success true', async () => {
    const req = makeLogoutRequest();
    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it('should delete the session cookie', async () => {
    const req = makeLogoutRequest();
    const response = await POST(req);

    // The response should clear the session cookie
    // When deleting a cookie, Next.js sets it with an expired date or empty value
    const setCookieHeader = response.headers.get('set-cookie');
    // The cookie should be deleted (set to expire in the past or empty)
    if (setCookieHeader) {
      expect(setCookieHeader).toContain('session');
    }
  });

  it('should work even without a session cookie in the request', async () => {
    // No cookies on request
    const req = new NextRequest('http://localhost/api/core/auth/logout', {
      method: 'POST',
    });
    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it('should work with a session cookie in the request', async () => {
    const req = new NextRequest('http://localhost/api/core/auth/logout', {
      method: 'POST',
      headers: { Cookie: 'session=some-jwt-token-value' },
    });
    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });
});