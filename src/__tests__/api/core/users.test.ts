import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('@/lib/db', () => ({
  prisma: {
    user: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
  },
}));

vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn().mockResolvedValue('$2a$10$hashed_password'),
    compare: vi.fn(),
  },
  hash: vi.fn().mockResolvedValue('$2a$10$hashed_password'),
}));

import { GET, POST } from '@/app/api/core/users/route';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

const mockPrisma = prisma as any;
const mockBcrypt = bcrypt as any;

const TENANT_ID = 'tenant-test-456';

function makeRequest(method: string, body?: unknown, extraHeaders?: Record<string, string>): NextRequest {
  return new NextRequest('http://localhost/api/core/users', {
    method,
    headers: {
      'Content-Type': 'application/json',
      'x-tenant-id': TENANT_ID,
      ...extraHeaders,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
}

describe('GET /api/core/users', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 400 when tenant header is missing', async () => {
    const req = new NextRequest('http://localhost/api/core/users', { method: 'GET' });
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Missing Tenant ID');
  });

  it('should return list of users for the tenant', async () => {
    const mockUsers = [
      { id: 'u1', username: 'user1', name: 'User 1', email: 'u1@test.com', role: 'admin', status: 'active', createdAt: new Date().toISOString() },
      { id: 'u2', username: 'user2', name: 'User 2', email: 'u2@test.com', role: 'user', status: 'active', createdAt: new Date().toISOString() },
    ];
    mockPrisma.user.findMany.mockResolvedValue(mockUsers);

    const req = makeRequest('GET');
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockUsers);
    expect(mockPrisma.user.findMany).toHaveBeenCalledWith({
      where: { tenantId: TENANT_ID },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });
  });

  it('should return empty array if no users exist', async () => {
    mockPrisma.user.findMany.mockResolvedValue([]);

    const req = makeRequest('GET');
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual([]);
  });

  it('should not return password field', async () => {
    const mockUsers = [
      { id: 'u1', username: 'user1', name: 'User 1', role: 'admin', status: 'active', createdAt: new Date().toISOString() },
    ];
    mockPrisma.user.findMany.mockResolvedValue(mockUsers);

    const req = makeRequest('GET');
    const response = await GET(req);
    const data = await response.json();

    // The select in findMany excludes password; verify the select contains no password
    expect(mockPrisma.user.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        select: expect.not.objectContaining({ password: true }),
      })
    );
  });
});

describe('POST /api/core/users', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockBcrypt.hash.mockResolvedValue('$2a$10$hashed_password');
  });

  it('should return 400 when tenant header is missing', async () => {
    const req = new NextRequest('http://localhost/api/core/users', {
      method: 'POST',
      body: JSON.stringify({ username: 'newuser', password: 'pass', name: 'New User' }),
      headers: { 'Content-Type': 'application/json' },
    });
    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Missing Tenant ID');
  });

  it('should return 400 when username is missing', async () => {
    const req = makeRequest('POST', { password: 'pass', name: 'New User' });
    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Missing required fields');
  });

  it('should return 400 when password is missing', async () => {
    const req = makeRequest('POST', { username: 'newuser', name: 'New User' });
    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Missing required fields');
  });

  it('should return 400 when name is missing', async () => {
    const req = makeRequest('POST', { username: 'newuser', password: 'pass' });
    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Missing required fields');
  });

  it('should create a new user and return 201', async () => {
    const createdUser = {
      id: 'new-user-id',
      tenantId: TENANT_ID,
      username: 'newuser',
      password: '$2a$10$hashed_password',
      name: 'New User',
      email: 'new@test.com',
      role: 'user',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockPrisma.user.create.mockResolvedValue(createdUser);

    const req = makeRequest('POST', { username: 'NewUser', password: 'pass123', name: 'New User', email: 'new@test.com' });
    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.id).toBe('new-user-id');
    expect(data.username).toBe('newuser');
  });

  it('should not return password in the response', async () => {
    const createdUser = {
      id: 'new-user-id',
      tenantId: TENANT_ID,
      username: 'newuser',
      password: '$2a$10$hashed_password',
      name: 'New User',
      email: null,
      role: 'user',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockPrisma.user.create.mockResolvedValue(createdUser);

    const req = makeRequest('POST', { username: 'newuser', password: 'pass123', name: 'New User' });
    const response = await POST(req);
    const data = await response.json();

    expect(data.password).toBeUndefined();
  });

  it('should hash the password before saving', async () => {
    const createdUser = {
      id: 'u1', tenantId: TENANT_ID, username: 'newuser', password: '$2a$10$hashed', name: 'New', email: null, role: 'user', status: 'active', createdAt: new Date(), updatedAt: new Date(),
    };
    mockPrisma.user.create.mockResolvedValue(createdUser);

    const req = makeRequest('POST', { username: 'newuser', password: 'plainpass', name: 'New' });
    await POST(req);

    expect(mockBcrypt.hash).toHaveBeenCalledWith('plainpass', 10);
  });

  it('should store username in lowercase', async () => {
    const createdUser = {
      id: 'u1', tenantId: TENANT_ID, username: 'myusername', password: '$2a$10$hashed', name: 'My Name', email: null, role: 'user', status: 'active', createdAt: new Date(), updatedAt: new Date(),
    };
    mockPrisma.user.create.mockResolvedValue(createdUser);

    const req = makeRequest('POST', { username: 'MyUsername', password: 'pass', name: 'My Name' });
    await POST(req);

    expect(mockPrisma.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ username: 'myusername' }),
      })
    );
  });

  it('should use default role of "user" when role is not provided', async () => {
    const createdUser = {
      id: 'u1', tenantId: TENANT_ID, username: 'newuser', password: '$2a$10$hashed', name: 'New', email: null, role: 'user', status: 'active', createdAt: new Date(), updatedAt: new Date(),
    };
    mockPrisma.user.create.mockResolvedValue(createdUser);

    const req = makeRequest('POST', { username: 'newuser', password: 'pass', name: 'New' });
    await POST(req);

    expect(mockPrisma.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ role: 'user' }),
      })
    );
  });

  it('should use provided role when specified', async () => {
    const createdUser = {
      id: 'u1', tenantId: TENANT_ID, username: 'adminuser', password: '$2a$10$hashed', name: 'Admin', email: null, role: 'admin', status: 'active', createdAt: new Date(), updatedAt: new Date(),
    };
    mockPrisma.user.create.mockResolvedValue(createdUser);

    const req = makeRequest('POST', { username: 'adminuser', password: 'pass', name: 'Admin', role: 'admin' });
    await POST(req);

    expect(mockPrisma.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ role: 'admin' }),
      })
    );
  });
});