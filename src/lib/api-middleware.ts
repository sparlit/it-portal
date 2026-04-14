import { NextRequest, NextResponse } from 'next/server';
import { getSession } from './auth';

export async function withTenant(req: NextRequest, handler: Function) {
  // Get authenticated session
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Extract tenant ID from the authenticated session
  const tenantId = session.tenantId;

  if (!tenantId) {
    return NextResponse.json({ error: 'Missing tenant in session' }, { status: 403 });
  }

  // Optional: verify header matches session if header is provided
  const headerTenantId = req.headers.get('x-tenant-id');
  if (headerTenantId && headerTenantId !== tenantId) {
    return NextResponse.json(
      { error: 'Tenant mismatch: header does not match authenticated session' },
      { status: 403 }
    );
  }

  return handler(tenantId);
}