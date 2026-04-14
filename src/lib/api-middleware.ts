import { NextRequest, NextResponse } from 'next/server';

export async function withTenant(req: NextRequest, handler: Function) {
  const tenantId = req.headers.get('x-tenant-id');

  if (!tenantId) {
    return NextResponse.json({ error: 'Missing Tenant ID' }, { status: 400 });
  }

  return handler(tenantId);
}
