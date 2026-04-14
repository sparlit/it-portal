import { NextRequest, NextResponse } from 'next/server';

/**
 * Validates and extracts the tenant identifier from the request and delegates processing to the provided handler.
 *
 * If the `x-tenant-id` header is missing, returns a JSON response with `{ error: 'Missing Tenant ID' }` and HTTP status 400.
 *
 * @param req - Incoming Next.js request whose headers are inspected for `x-tenant-id`
 * @param handler - Function invoked with the resolved tenant id; its return value is forwarded
 * @returns The value returned by `handler(tenantId)`, or a `NextResponse` JSON error when the tenant id is missing
 */
export async function withTenant(req: NextRequest, handler: Function) {
  const tenantId = req.headers.get('x-tenant-id');

  if (!tenantId) {
    return NextResponse.json({ error: 'Missing Tenant ID' }, { status: 400 });
  }

  return handler(tenantId);
}
