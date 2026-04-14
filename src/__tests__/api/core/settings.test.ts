import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('@/lib/db', () => ({
  prisma: {
    setting: {
      findMany: vi.fn(),
      upsert: vi.fn(),
    },
  },
}));

import { GET, PUT } from '@/app/api/core/settings/route';
import { prisma } from '@/lib/db';

const mockPrisma = prisma as any;

function makeRequest(method: string, headers: Record<string, string> = {}, body?: unknown): NextRequest {
  return new NextRequest('http://localhost/api/core/settings', {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
    body: body ? JSON.stringify(body) : undefined,
  });
}

const TENANT_ID = 'tenant-abc-123';

describe('GET /api/core/settings', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 400 when x-tenant-id header is missing', async () => {
    const req = makeRequest('GET');
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Missing Tenant ID');
  });

  it('should return all settings for the tenant', async () => {
    const mockSettings = [
      { id: '1', tenantId: TENANT_ID, key: 'theme', value: 'dark' },
      { id: '2', tenantId: TENANT_ID, key: 'language', value: 'en' },
    ];
    mockPrisma.setting.findMany.mockResolvedValue(mockSettings);

    const req = makeRequest('GET', { 'x-tenant-id': TENANT_ID });
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockSettings);
    expect(mockPrisma.setting.findMany).toHaveBeenCalledWith({
      where: { tenantId: TENANT_ID },
    });
  });

  it('should return empty array when no settings exist', async () => {
    mockPrisma.setting.findMany.mockResolvedValue([]);

    const req = makeRequest('GET', { 'x-tenant-id': TENANT_ID });
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual([]);
  });
});

describe('PUT /api/core/settings', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 400 when x-tenant-id header is missing', async () => {
    const req = makeRequest('PUT', {}, { key: 'theme', value: 'dark' });
    const response = await PUT(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Missing Tenant ID');
  });

  it('should return 400 when key is missing', async () => {
    const req = makeRequest('PUT', { 'x-tenant-id': TENANT_ID }, { value: 'dark' });
    const response = await PUT(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Key is required');
  });

  it('should upsert a setting and return it', async () => {
    const updatedSetting = { id: '1', tenantId: TENANT_ID, key: 'theme', value: 'light' };
    mockPrisma.setting.upsert.mockResolvedValue(updatedSetting);

    const req = makeRequest('PUT', { 'x-tenant-id': TENANT_ID }, { key: 'theme', value: 'light' });
    const response = await PUT(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(updatedSetting);
  });

  it('should call upsert with correct parameters', async () => {
    const mockSetting = { id: '5', tenantId: TENANT_ID, key: 'notifications', value: 'enabled' };
    mockPrisma.setting.upsert.mockResolvedValue(mockSetting);

    const req = makeRequest('PUT', { 'x-tenant-id': TENANT_ID }, { key: 'notifications', value: 'enabled' });
    await PUT(req);

    expect(mockPrisma.setting.upsert).toHaveBeenCalledWith({
      where: {
        tenantId_key: {
          tenantId: TENANT_ID,
          key: 'notifications',
        },
      },
      update: { value: 'enabled' },
      create: {
        tenantId: TENANT_ID,
        key: 'notifications',
        value: 'enabled',
      },
    });
  });

  it('should create a new setting if it does not exist', async () => {
    const newSetting = { id: '10', tenantId: TENANT_ID, key: 'new_setting', value: 'value' };
    mockPrisma.setting.upsert.mockResolvedValue(newSetting);

    const req = makeRequest('PUT', { 'x-tenant-id': TENANT_ID }, { key: 'new_setting', value: 'value' });
    const response = await PUT(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.key).toBe('new_setting');
  });

  it('should handle null value in setting', async () => {
    const setting = { id: '1', tenantId: TENANT_ID, key: 'opt_setting', value: null };
    mockPrisma.setting.upsert.mockResolvedValue(setting);

    const req = makeRequest('PUT', { 'x-tenant-id': TENANT_ID }, { key: 'opt_setting', value: null });
    const response = await PUT(req);

    expect(response.status).toBe(200);
  });
});