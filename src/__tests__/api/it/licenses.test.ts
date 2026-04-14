import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('@/lib/db', () => ({
  prisma: {
    license: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
  },
}));

import { GET, POST } from '@/app/api/it/licenses/route';
import { prisma } from '@/lib/db';

const mockPrisma = prisma as any;

const TENANT_ID = 'tenant-licenses-test';

function makeRequest(method: string, body?: unknown, tenantId?: string): NextRequest {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (tenantId) headers['x-tenant-id'] = tenantId;
  return new NextRequest('http://localhost/api/it/licenses', {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
}

const mockLicense = {
  id: 'lic-001',
  tenantId: TENANT_ID,
  software: 'Microsoft Office 365',
  expiryDate: '2025-12-31',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('GET /api/it/licenses', () => {
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

  it('should return all licenses for the tenant', async () => {
    const mockLicenses = [mockLicense];
    mockPrisma.license.findMany.mockResolvedValue(mockLicenses);

    const req = makeRequest('GET', undefined, TENANT_ID);
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockLicenses);
  });

  it('should query with tenantId filter and orderBy updatedAt desc', async () => {
    mockPrisma.license.findMany.mockResolvedValue([]);

    const req = makeRequest('GET', undefined, TENANT_ID);
    await GET(req);

    expect(mockPrisma.license.findMany).toHaveBeenCalledWith({
      where: { tenantId: TENANT_ID },
      orderBy: { updatedAt: 'desc' },
    });
  });

  it('should return empty array when no licenses exist', async () => {
    mockPrisma.license.findMany.mockResolvedValue([]);

    const req = makeRequest('GET', undefined, TENANT_ID);
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual([]);
  });

  it('should return multiple licenses', async () => {
    const licenses = [
      { id: 'lic-1', tenantId: TENANT_ID, software: 'Office 365', expiryDate: '2025-12-31', createdAt: new Date(), updatedAt: new Date() },
      { id: 'lic-2', tenantId: TENANT_ID, software: 'Adobe CC', expiryDate: '2024-06-30', createdAt: new Date(), updatedAt: new Date() },
      { id: 'lic-3', tenantId: TENANT_ID, software: 'Slack', expiryDate: null, createdAt: new Date(), updatedAt: new Date() },
    ];
    mockPrisma.license.findMany.mockResolvedValue(licenses);

    const req = makeRequest('GET', undefined, TENANT_ID);
    const response = await GET(req);
    const data = await response.json();

    expect(data).toHaveLength(3);
  });
});

describe('POST /api/it/licenses', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 400 when tenant header is missing', async () => {
    const req = makeRequest('POST', { software: 'Office 365' });
    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Missing Tenant ID');
  });

  it('should return 400 when software name is missing', async () => {
    const req = makeRequest('POST', { expiryDate: '2025-12-31' }, TENANT_ID);
    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Software name is required');
  });

  it('should return 400 when body is empty', async () => {
    const req = makeRequest('POST', {}, TENANT_ID);
    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Software name is required');
  });

  it('should create a license and return 201', async () => {
    mockPrisma.license.create.mockResolvedValue(mockLicense);

    const req = makeRequest('POST', { software: 'Microsoft Office 365', expiryDate: '2025-12-31' }, TENANT_ID);
    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.id).toBe('lic-001');
    expect(data.software).toBe('Microsoft Office 365');
  });

  it('should create a license without expiry date', async () => {
    const licenseWithoutExpiry = { ...mockLicense, expiryDate: null };
    mockPrisma.license.create.mockResolvedValue(licenseWithoutExpiry);

    const req = makeRequest('POST', { software: 'Open Source Tool' }, TENANT_ID);
    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.expiryDate).toBeNull();
  });

  it('should include tenantId in the created license', async () => {
    mockPrisma.license.create.mockResolvedValue(mockLicense);

    const req = makeRequest('POST', { software: 'Slack', expiryDate: '2025-01-01' }, TENANT_ID);
    await POST(req);

    expect(mockPrisma.license.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ tenantId: TENANT_ID }),
      })
    );
  });

  it('should pass software and expiryDate to create', async () => {
    mockPrisma.license.create.mockResolvedValue(mockLicense);

    const req = makeRequest('POST', { software: 'Adobe CC', expiryDate: '2024-06-30' }, TENANT_ID);
    await POST(req);

    expect(mockPrisma.license.create).toHaveBeenCalledWith({
      data: {
        tenantId: TENANT_ID,
        software: 'Adobe CC',
        expiryDate: '2024-06-30',
      },
    });
  });

  it('should handle license creation with undefined expiryDate', async () => {
    const licenseNoExpiry = { ...mockLicense, expiryDate: undefined };
    mockPrisma.license.create.mockResolvedValue(licenseNoExpiry);

    const req = makeRequest('POST', { software: 'FreeApp' }, TENANT_ID);
    await POST(req);

    expect(mockPrisma.license.create).toHaveBeenCalledWith({
      data: {
        tenantId: TENANT_ID,
        software: 'FreeApp',
        expiryDate: undefined,
      },
    });
  });
});