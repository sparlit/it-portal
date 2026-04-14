import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('@/lib/db', () => ({
  prisma: {
    asset: {
      findFirst: vi.fn(),
      updateMany: vi.fn(),
      deleteMany: vi.fn(),
    },
  },
}));

import { GET, PUT, DELETE } from '@/app/api/it/assets/[id]/route';
import { prisma } from '@/lib/db';

const mockPrisma = prisma as any;

const TENANT_ID = 'tenant-it-test';
const ASSET_ID = 'asset-id-001';

function makeRequest(method: string, id: string, body?: unknown, tenantId?: string): NextRequest {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (tenantId) headers['x-tenant-id'] = tenantId;
  return new NextRequest(`http://localhost/api/it/assets/${id}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
}

const mockAsset = {
  id: ASSET_ID,
  tenantId: TENANT_ID,
  name: 'Dell Laptop',
  type: 'computer',
  model: 'Dell XPS 15',
  serialNumber: 'DELL001',
  location: 'IT Room',
  ipAddress: null,
  status: 'active',
  assignedTo: null,
  purchaseDate: null,
  warrantyEnd: null,
  notes: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('GET /api/it/assets/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 400 when tenant header is missing', async () => {
    const req = makeRequest('GET', ASSET_ID);
    const response = await GET(req, { params: { id: ASSET_ID } });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Missing Tenant ID');
  });

  it('should return 404 when asset is not found', async () => {
    mockPrisma.asset.findFirst.mockResolvedValue(null);

    const req = makeRequest('GET', ASSET_ID, undefined, TENANT_ID);
    const response = await GET(req, { params: { id: ASSET_ID } });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('Asset not found');
  });

  it('should return the asset when found', async () => {
    mockPrisma.asset.findFirst.mockResolvedValue(mockAsset);

    const req = makeRequest('GET', ASSET_ID, undefined, TENANT_ID);
    const response = await GET(req, { params: { id: ASSET_ID } });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockAsset);
  });

  it('should query with id and tenantId', async () => {
    mockPrisma.asset.findFirst.mockResolvedValue(mockAsset);

    const req = makeRequest('GET', ASSET_ID, undefined, TENANT_ID);
    await GET(req, { params: { id: ASSET_ID } });

    expect(mockPrisma.asset.findFirst).toHaveBeenCalledWith({
      where: { id: ASSET_ID, tenantId: TENANT_ID },
    });
  });
});

describe('PUT /api/it/assets/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 400 when tenant header is missing', async () => {
    const req = makeRequest('PUT', ASSET_ID, { name: 'Updated' });
    const response = await PUT(req, { params: { id: ASSET_ID } });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Missing Tenant ID');
  });

  it('should return 404 when asset is not found (count === 0)', async () => {
    mockPrisma.asset.updateMany.mockResolvedValue({ count: 0 });

    const req = makeRequest('PUT', ASSET_ID, { name: 'Updated' }, TENANT_ID);
    const response = await PUT(req, { params: { id: ASSET_ID } });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('Asset not found');
  });

  it('should return 200 with success message when asset is updated', async () => {
    mockPrisma.asset.updateMany.mockResolvedValue({ count: 1 });

    const req = makeRequest('PUT', ASSET_ID, { name: 'Updated Asset' }, TENANT_ID);
    const response = await PUT(req, { params: { id: ASSET_ID } });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message).toBe('Asset updated successfully');
  });

  it('should call updateMany with correct where clause', async () => {
    mockPrisma.asset.updateMany.mockResolvedValue({ count: 1 });

    const req = makeRequest('PUT', ASSET_ID, { name: 'Updated' }, TENANT_ID);
    await PUT(req, { params: { id: ASSET_ID } });

    expect(mockPrisma.asset.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: ASSET_ID, tenantId: TENANT_ID },
      })
    );
  });

  it('should update all provided fields', async () => {
    mockPrisma.asset.updateMany.mockResolvedValue({ count: 1 });

    const updateBody = {
      name: 'New Name',
      type: 'server',
      model: 'Dell PowerEdge',
      serialNumber: 'NEW001',
      location: 'Server Room',
      ipAddress: '192.168.10.1',
      status: 'inactive',
      assignedTo: 'Bob',
      purchaseDate: '2024-06-01',
      warrantyEnd: '2027-06-01',
      notes: 'Updated notes',
    };
    const req = makeRequest('PUT', ASSET_ID, updateBody, TENANT_ID);
    await PUT(req, { params: { id: ASSET_ID } });

    expect(mockPrisma.asset.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining(updateBody),
      })
    );
  });
});

describe('DELETE /api/it/assets/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 400 when tenant header is missing', async () => {
    const req = makeRequest('DELETE', ASSET_ID);
    const response = await DELETE(req, { params: { id: ASSET_ID } });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Missing Tenant ID');
  });

  it('should return 404 when asset is not found (count === 0)', async () => {
    mockPrisma.asset.deleteMany.mockResolvedValue({ count: 0 });

    const req = makeRequest('DELETE', ASSET_ID, undefined, TENANT_ID);
    const response = await DELETE(req, { params: { id: ASSET_ID } });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('Asset not found');
  });

  it('should return 200 with success message when asset is deleted', async () => {
    mockPrisma.asset.deleteMany.mockResolvedValue({ count: 1 });

    const req = makeRequest('DELETE', ASSET_ID, undefined, TENANT_ID);
    const response = await DELETE(req, { params: { id: ASSET_ID } });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message).toBe('Asset deleted successfully');
  });

  it('should call deleteMany with correct where clause', async () => {
    mockPrisma.asset.deleteMany.mockResolvedValue({ count: 1 });

    const req = makeRequest('DELETE', ASSET_ID, undefined, TENANT_ID);
    await DELETE(req, { params: { id: ASSET_ID } });

    expect(mockPrisma.asset.deleteMany).toHaveBeenCalledWith({
      where: { id: ASSET_ID, tenantId: TENANT_ID },
    });
  });

  it('should not delete assets from a different tenant', async () => {
    mockPrisma.asset.deleteMany.mockResolvedValue({ count: 0 });

    const req = makeRequest('DELETE', ASSET_ID, undefined, 'other-tenant');
    const response = await DELETE(req, { params: { id: ASSET_ID } });

    expect(mockPrisma.asset.deleteMany).toHaveBeenCalledWith({
      where: { id: ASSET_ID, tenantId: 'other-tenant' },
    });
    // Returns 404 since different tenant gets count 0
    expect(response.status).toBe(404);
  });
});