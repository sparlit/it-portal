import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('@/lib/db', () => ({
  prisma: {
    user: {
      findFirst: vi.fn(),
      updateMany: vi.fn(),
    },
  },
}));

import { GET, PUT } from '@/app/api/core/users/[id]/route';
import { prisma } from '@/lib/db';

const mockPrisma = prisma as any;

const TENANT_ID = 'tenant-test-456';
const USER_ID = 'user-id-789';

function makeGetRequest(id: string, tenantId?: string): NextRequest {
  return new NextRequest(`http://localhost/api/core/users/${id}`, {
    method: 'GET',
    headers: tenantId ? { 'x-tenant-id': tenantId } : {},
  });
}

function makePutRequest(id: string, body: unknown, tenantId?: string): NextRequest {
  return new NextRequest(`http://localhost/api/core/users/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(tenantId ? { 'x-tenant-id': tenantId } : {}),
    },
    body: JSON.stringify(body),
  });
}

describe('GET /api/core/users/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 400 when tenant header is missing', async () => {
    const req = makeGetRequest(USER_ID);
    const response = await GET(req, { params: { id: USER_ID } });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Missing Tenant ID');
  });

  it('should return 404 when user is not found', async () => {
    mockPrisma.user.findFirst.mockResolvedValue(null);

    const req = makeGetRequest(USER_ID, TENANT_ID);
    const response = await GET(req, { params: { id: USER_ID } });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('User not found');
  });

  it('should return user data when found', async () => {
    const mockUser = {
      id: USER_ID,
      username: 'testuser',
      name: 'Test User',
      email: 'test@example.com',
      role: 'admin',
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    mockPrisma.user.findFirst.mockResolvedValue(mockUser);

    const req = makeGetRequest(USER_ID, TENANT_ID);
    const response = await GET(req, { params: { id: USER_ID } });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockUser);
  });

  it('should query with correct id and tenantId', async () => {
    mockPrisma.user.findFirst.mockResolvedValue({
      id: USER_ID, username: 'u', name: 'U', email: null, role: 'user', status: 'active', createdAt: new Date(),
    });

    const req = makeGetRequest(USER_ID, TENANT_ID);
    await GET(req, { params: { id: USER_ID } });

    expect(mockPrisma.user.findFirst).toHaveBeenCalledWith({
      where: { id: USER_ID, tenantId: TENANT_ID },
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

  it('should not return password field via select', async () => {
    mockPrisma.user.findFirst.mockResolvedValue({
      id: USER_ID, username: 'u', name: 'U', email: null, role: 'user', status: 'active', createdAt: new Date(),
    });

    const req = makeGetRequest(USER_ID, TENANT_ID);
    await GET(req, { params: { id: USER_ID } });

    expect(mockPrisma.user.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        select: expect.not.objectContaining({ password: true }),
      })
    );
  });
});

describe('PUT /api/core/users/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 400 when tenant header is missing', async () => {
    const req = makePutRequest(USER_ID, { name: 'Updated Name' });
    const response = await PUT(req, { params: { id: USER_ID } });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Missing Tenant ID');
  });

  it('should return 404 when user is not found (count === 0)', async () => {
    mockPrisma.user.updateMany.mockResolvedValue({ count: 0 });

    const req = makePutRequest(USER_ID, { name: 'Updated Name' }, TENANT_ID);
    const response = await PUT(req, { params: { id: USER_ID } });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('User not found');
  });

  it('should return 200 with success message when user is updated', async () => {
    mockPrisma.user.updateMany.mockResolvedValue({ count: 1 });

    const req = makePutRequest(USER_ID, { name: 'Updated Name', role: 'admin' }, TENANT_ID);
    const response = await PUT(req, { params: { id: USER_ID } });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message).toBe('User updated successfully');
  });

  it('should call updateMany with correct where clause', async () => {
    mockPrisma.user.updateMany.mockResolvedValue({ count: 1 });

    const req = makePutRequest(USER_ID, { name: 'Updated', role: 'staff' }, TENANT_ID);
    await PUT(req, { params: { id: USER_ID } });

    expect(mockPrisma.user.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: USER_ID, tenantId: TENANT_ID },
      })
    );
  });

  it('should update the correct fields', async () => {
    mockPrisma.user.updateMany.mockResolvedValue({ count: 1 });

    const updateBody = { name: 'New Name', email: 'new@test.com', role: 'it_manager', status: 'inactive' };
    const req = makePutRequest(USER_ID, updateBody, TENANT_ID);
    await PUT(req, { params: { id: USER_ID } });

    expect(mockPrisma.user.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          name: 'New Name',
          email: 'new@test.com',
          role: 'it_manager',
          status: 'inactive',
        },
      })
    );
  });
});