import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// Mock dependencies before importing the route
vi.mock('@/lib/db', () => ({
  prisma: {
    user: {
      findFirst: vi.fn(),
    },
  },
}));

vi.mock('@/lib/auth', () => ({
  encrypt: vi.fn().mockResolvedValue('mock-jwt-token'),
}));

vi.mock('bcryptjs', () => ({
  default: {
    compare: vi.fn(),
  },
  compare: vi.fn(),
}));

import { POST } from '@/app/api/core/auth/login/route';
import { prisma } from '@/lib/db';
import { encrypt } from '@/lib/auth';
import bcrypt from 'bcryptjs';

const mockPrisma = prisma as any;
const mockBcrypt = bcrypt as any;
const mockEncrypt = encrypt as any;

function makeLoginRequest(body: Record<string, unknown>): NextRequest {
  return new NextRequest('http://localhost/api/core/auth/login', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
}

const mockUser = {
  id: 'user-123',
  username: 'testuser',
  name: 'Test User',
  email: 'test@example.com',
  role: 'admin',
  tenantId: 'tenant-abc',
  password: '$2a$10$hashedpassword',
  status: 'active',
};

describe('POST /api/core/auth/login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockEncrypt.mockResolvedValue('mock-jwt-token');
  });

  it('should return 400 when username is missing', async () => {
    const req = makeLoginRequest({ password: 'secret123' });
    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Username and password are required');
  });

  it('should return 400 when password is missing', async () => {
    const req = makeLoginRequest({ username: 'testuser' });
    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Username and password are required');
  });

  it('should return 400 when both username and password are missing', async () => {
    const req = makeLoginRequest({});
    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Username and password are required');
  });

  it('should return 401 when user is not found', async () => {
    mockPrisma.user.findFirst.mockResolvedValue(null);
    mockBcrypt.compare.mockResolvedValue(false);

    const req = makeLoginRequest({ username: 'unknownuser', password: 'wrongpass' });
    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Invalid credentials');
  });

  it('should return 401 when password is incorrect', async () => {
    mockPrisma.user.findFirst.mockResolvedValue(mockUser);
    mockBcrypt.compare.mockResolvedValue(false);

    const req = makeLoginRequest({ username: 'testuser', password: 'wrongpass' });
    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Invalid credentials');
  });

  it('should return 200 with user data on successful login', async () => {
    mockPrisma.user.findFirst.mockResolvedValue(mockUser);
    mockBcrypt.compare.mockResolvedValue(true);

    const req = makeLoginRequest({ username: 'testuser', password: 'correctpass' });
    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.user).toBeDefined();
    expect(data.user.id).toBe(mockUser.id);
    expect(data.user.username).toBe(mockUser.username);
    expect(data.user.role).toBe(mockUser.role);
    expect(data.user.tenantId).toBe(mockUser.tenantId);
  });

  it('should not include password in the response', async () => {
    mockPrisma.user.findFirst.mockResolvedValue(mockUser);
    mockBcrypt.compare.mockResolvedValue(true);

    const req = makeLoginRequest({ username: 'testuser', password: 'correctpass' });
    const response = await POST(req);
    const data = await response.json();

    expect(data.user.password).toBeUndefined();
  });

  it('should set a session cookie on successful login', async () => {
    mockPrisma.user.findFirst.mockResolvedValue(mockUser);
    mockBcrypt.compare.mockResolvedValue(true);

    const req = makeLoginRequest({ username: 'testuser', password: 'correctpass' });
    const response = await POST(req);

    const setCookieHeader = response.headers.get('set-cookie');
    expect(setCookieHeader).not.toBeNull();
    expect(setCookieHeader).toContain('session=');
  });

  it('should search user by email when @ is present', async () => {
    mockPrisma.user.findFirst.mockResolvedValue(mockUser);
    mockBcrypt.compare.mockResolvedValue(true);

    const req = makeLoginRequest({ username: 'test@example.com', password: 'correctpass' });
    await POST(req);

    expect(mockPrisma.user.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          OR: expect.arrayContaining([
            expect.objectContaining({ email: 'test@example.com' })
          ])
        })
      })
    );
  });

  it('should search with lowercase username', async () => {
    mockPrisma.user.findFirst.mockResolvedValue(mockUser);
    mockBcrypt.compare.mockResolvedValue(true);

    const req = makeLoginRequest({ username: 'TestUser', password: 'correctpass' });
    await POST(req);

    expect(mockPrisma.user.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          OR: expect.arrayContaining([
            expect.objectContaining({ username: 'testuser' })
          ])
        })
      })
    );
  });

  it('should only find active users', async () => {
    mockPrisma.user.findFirst.mockResolvedValue(null);
    mockBcrypt.compare.mockResolvedValue(false);

    const req = makeLoginRequest({ username: 'testuser', password: 'correctpass' });
    await POST(req);

    expect(mockPrisma.user.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ status: 'active' })
      })
    );
  });

  it('should return 500 on internal error', async () => {
    mockPrisma.user.findFirst.mockRejectedValue(new Error('DB connection failed'));

    const req = makeLoginRequest({ username: 'testuser', password: 'pass' });
    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Internal server error');
  });

  it('should call encrypt to create session token', async () => {
    mockPrisma.user.findFirst.mockResolvedValue(mockUser);
    mockBcrypt.compare.mockResolvedValue(true);

    const req = makeLoginRequest({ username: 'testuser', password: 'correctpass' });
    await POST(req);

    expect(mockEncrypt).toHaveBeenCalledOnce();
    expect(mockEncrypt).toHaveBeenCalledWith(
      expect.objectContaining({
        user: expect.objectContaining({
          id: mockUser.id,
          username: mockUser.username,
        })
      })
    );
  });
});