import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('@/lib/db', () => ({
  prisma: {
    asset: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
  },
}));

import { GET, POST } from '@/app/api/it/assets/route';
import { prisma } from '@/lib/db';

const mockPrisma = prisma as any;

const TENANT_ID = 'tenant-it-test';

function makeRequest(method: string, body?: unknown, tenantId?: string): NextRequest {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (tenantId) headers['x-tenant-id'] = tenantId;
  return new NextRequest('http://localhost/api/it/assets', {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
}

const mockAsset = {
  id: 'asset-001',
  tenantId: TENANT_ID,
  name: 'MacBook Pro',
  type: 'computer',
  model: 'MacBook Pro 14',
  serialNumber: 'SN123456',
  location: 'Office A',
  ipAddress: '192.168.1.100',
  status: 'active',
  assignedTo: 'John Doe',
  purchaseDate: '2023-01-01',
  warrantyEnd: '2026-01-01',
  notes: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('GET /api/it/assets', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 400 when tenant header is missing', async () => {
    const req = makeRequest('GET');
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Missing Tenant ID');
  });

  it('should return all assets for the tenant', async () => {
    const mockAssets = [mockAsset];
    mockPrisma.asset.findMany.mockResolvedValue(mockAssets);

    const req = makeRequest('GET', undefined, TENANT_ID);
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockAssets);
  });

  it('should query with tenantId filter and orderBy updatedAt desc', async () => {
    mockPrisma.asset.findMany.mockResolvedValue([]);

    const req = makeRequest('GET', undefined, TENANT_ID);
    await GET(req);

    expect(mockPrisma.asset.findMany).toHaveBeenCalledWith({
      where: { tenantId: TENANT_ID },
      orderBy: { updatedAt: 'desc' },
    });
  });

  it('should return empty array when no assets exist', async () => {
    mockPrisma.asset.findMany.mockResolvedValue([]);

    const req = makeRequest('GET', undefined, TENANT_ID);
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual([]);
  });
});

describe('POST /api/it/assets', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 400 when tenant header is missing', async () => {
    const req = makeRequest('POST', { name: 'Test', type: 'computer', serialNumber: 'SN001' });
    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Missing Tenant ID');
  });

  it('should return 400 when name is missing', async () => {
    const req = makeRequest('POST', { type: 'computer', serialNumber: 'SN001' }, TENANT_ID);
    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Missing required fields');
  });

  it('should return 400 when serialNumber is missing', async () => {
    const req = makeRequest('POST', { name: 'Test', type: 'computer' }, TENANT_ID);
    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Missing required fields');
  });

  it('should return 400 when type is missing', async () => {
    const req = makeRequest('POST', { name: 'Test', serialNumber: 'SN001' }, TENANT_ID);
    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Missing required fields');
  });

  it('should create an asset and return 201', async () => {
    mockPrisma.asset.create.mockResolvedValue(mockAsset);

    const req = makeRequest('POST', {
      name: 'MacBook Pro',
      type: 'computer',
      serialNumber: 'SN123456',
      model: 'MacBook Pro 14',
      location: 'Office A',
    }, TENANT_ID);
    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.id).toBe('asset-001');
    expect(data.name).toBe('MacBook Pro');
  });

  it('should use default values for optional fields', async () => {
    mockPrisma.asset.create.mockResolvedValue({
      ...mockAsset,
      model: 'Unknown',
      location: 'Default',
    });

    const req = makeRequest('POST', {
      name: 'Printer',
      type: 'printer',
      serialNumber: 'PRSN001',
    }, TENANT_ID);
    await POST(req);

    expect(mockPrisma.asset.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          model: 'Unknown',
          location: 'Default',
          status: 'active',
        }),
      })
    );
  });

  it('should use provided status when given', async () => {
    mockPrisma.asset.create.mockResolvedValue({ ...mockAsset, status: 'maintenance' });

    const req = makeRequest('POST', {
      name: 'Server',
      type: 'server',
      serialNumber: 'SVR001',
      status: 'maintenance',
    }, TENANT_ID);
    await POST(req);

    expect(mockPrisma.asset.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: 'maintenance' }),
      })
    );
  });

  it('should include optional fields when provided', async () => {
    mockPrisma.asset.create.mockResolvedValue(mockAsset);

    const req = makeRequest('POST', {
      name: 'PC',
      type: 'computer',
      serialNumber: 'PC001',
      ipAddress: '10.0.0.1',
      assignedTo: 'Alice',
      purchaseDate: '2024-01-01',
      warrantyEnd: '2027-01-01',
      notes: 'Test notes',
    }, TENANT_ID);
    await POST(req);

    expect(mockPrisma.asset.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          ipAddress: '10.0.0.1',
          assignedTo: 'Alice',
          purchaseDate: '2024-01-01',
          warrantyEnd: '2027-01-01',
          notes: 'Test notes',
        }),
      })
    );
  });

  it('should include tenantId in the created asset', async () => {
    mockPrisma.asset.create.mockResolvedValue(mockAsset);

    const req = makeRequest('POST', { name: 'Test', type: 'other', serialNumber: 'TST001' }, TENANT_ID);
    await POST(req);

    expect(mockPrisma.asset.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ tenantId: TENANT_ID }),
      })
    );
  });
});