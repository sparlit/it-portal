import { describe, it, expect, vi } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';
import { withTenant } from '@/lib/api-middleware';

function makeRequest(headers: Record<string, string> = {}): NextRequest {
  const req = new NextRequest('http://localhost/api/test', {
    method: 'GET',
    headers,
  });
  return req;
}

describe('lib/api-middleware - withTenant', () => {
  it('should return 400 if x-tenant-id header is missing', async () => {
    const req = makeRequest({});
    const handler = vi.fn().mockResolvedValue(NextResponse.json({ ok: true }));

    const response = await withTenant(req, handler);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Missing Tenant ID');
    expect(handler).not.toHaveBeenCalled();
  });

  it('should call handler with tenantId when header is present', async () => {
    const tenantId = 'tenant-abc-123';
    const req = makeRequest({ 'x-tenant-id': tenantId });
    const handler = vi.fn().mockResolvedValue(NextResponse.json({ data: 'result' }));

    const response = await withTenant(req, handler);
    const data = await response.json();

    expect(handler).toHaveBeenCalledOnce();
    expect(handler).toHaveBeenCalledWith(tenantId);
    expect(data.data).toBe('result');
  });

  it('should pass the exact tenantId string from the header', async () => {
    const tenantId = 'my-special-tenant-id-42';
    const req = makeRequest({ 'x-tenant-id': tenantId });
    let capturedTenantId: string | null = null;
    const handler = vi.fn().mockImplementation((id: string) => {
      capturedTenantId = id;
      return NextResponse.json({});
    });

    await withTenant(req, handler);
    expect(capturedTenantId).toBe(tenantId);
  });

  it('should return whatever the handler returns', async () => {
    const req = makeRequest({ 'x-tenant-id': 'tenant-1' });
    const mockResponse = NextResponse.json({ custom: 'data' }, { status: 201 });
    const handler = vi.fn().mockResolvedValue(mockResponse);

    const response = await withTenant(req, handler);
    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.custom).toBe('data');
  });

  it('should propagate handler errors', async () => {
    const req = makeRequest({ 'x-tenant-id': 'tenant-1' });
    const handler = vi.fn().mockRejectedValue(new Error('Handler error'));

    await expect(withTenant(req, handler)).rejects.toThrow('Handler error');
  });

  it('should return 400 when x-tenant-id header is empty string', async () => {
    // Empty string header is falsy so should also trigger missing tenant check
    // Note: In HTTP, headers can be sent as empty but get() returns null for missing,
    // empty string for present-but-empty. The implementation checks for falsy values.
    const req = makeRequest({ 'x-tenant-id': '' });
    const handler = vi.fn().mockResolvedValue(NextResponse.json({}));

    const response = await withTenant(req, handler);
    // Empty string is falsy, so it should return 400
    expect(response.status).toBe(400);
    expect(handler).not.toHaveBeenCalled();
  });
});