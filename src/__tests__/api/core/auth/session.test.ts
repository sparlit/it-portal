import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// Mock @/lib/auth before importing route
vi.mock('@/lib/auth', () => ({
  decrypt: vi.fn(),
}));

import { GET } from '@/app/api/core/auth/session/route';
import { decrypt } from '@/lib/auth';

const mockDecrypt = decrypt as ReturnType<typeof vi.fn>;

function makeSessionRequest(sessionCookie?: string): NextRequest {
  const headers: Record<string, string> = {};
  if (sessionCookie) {
    headers['Cookie'] = `session=${sessionCookie}`;
  }
  return new NextRequest('http://localhost/api/core/auth/session', {
    method: 'GET',
    headers,
  });
}

describe('GET /api/core/auth/session', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 when no session cookie is present', async () => {
    const req = makeSessionRequest();
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.authenticated).toBe(false);
  });

  it('should return 401 when session token is invalid', async () => {
    mockDecrypt.mockRejectedValue(new Error('Invalid token'));

    const req = makeSessionRequest('invalid-token');
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.authenticated).toBe(false);
  });

  it('should return 401 when decrypt returns null', async () => {
    mockDecrypt.mockResolvedValue(null);

    const req = makeSessionRequest('some-token');
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.authenticated).toBe(false);
  });

  it('should return 401 when payload has no user field', async () => {
    mockDecrypt.mockResolvedValue({ expires: new Date().toISOString() });

    const req = makeSessionRequest('some-token');
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.authenticated).toBe(false);
  });

  it('should return authenticated=true with user data on valid session', async () => {
    const mockUser = {
      id: 'user-123',
      username: 'testuser',
      name: 'Test User',
      role: 'admin',
      tenantId: 'tenant-abc',
    };
    mockDecrypt.mockResolvedValue({ user: mockUser, expires: new Date().toISOString() });

    const req = makeSessionRequest('valid-jwt-token');
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.authenticated).toBe(true);
    expect(data.user).toEqual(mockUser);
  });

  it('should return user with all expected fields', async () => {
    const mockUser = {
      id: 'user-456',
      username: 'manager',
      name: 'Manager User',
      role: 'it_manager',
      tenantId: 'tenant-xyz',
    };
    mockDecrypt.mockResolvedValue({ user: mockUser });

    const req = makeSessionRequest('valid-token');
    const response = await GET(req);
    const data = await response.json();

    expect(data.user.id).toBe('user-456');
    expect(data.user.username).toBe('manager');
    expect(data.user.role).toBe('it_manager');
    expect(data.user.tenantId).toBe('tenant-xyz');
  });

  it('should call decrypt with the session token value', async () => {
    const tokenValue = 'my-jwt-session-token';
    mockDecrypt.mockResolvedValue({
      user: { id: '1', username: 'u', role: 'user', tenantId: 't' }
    });

    const req = makeSessionRequest(tokenValue);
    await GET(req);

    expect(mockDecrypt).toHaveBeenCalledOnce();
    expect(mockDecrypt).toHaveBeenCalledWith(tokenValue);
  });

  it('should return 401 when decrypt throws an unexpected error', async () => {
    mockDecrypt.mockRejectedValue(new Error('Unexpected failure'));

    const req = makeSessionRequest('some-token');
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.authenticated).toBe(false);
  });
});