import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from './auth';

export async function withTenant(req: NextRequest, handler: Function) {
  // Try to get tenant from session first (Production Standard)
  const sessionToken = req.cookies.get('session')?.value;
  let tenantId = null;

  if (sessionToken) {
    try {
      const payload = await decrypt(sessionToken);
      tenantId = payload?.user?.tenantId;
    } catch (e) {
      // Invalid session, continue to check header (for API keys/dev)
    }
  }

  // Fallback to header for development or cross-tenant API support
  if (!tenantId) {
    tenantId = req.headers.get('x-tenant-id');
  }

  if (!tenantId) {
    return NextResponse.json({ error: 'Unauthorized: Missing Tenant Context' }, { status: 401 });
  }

  return handler(tenantId);
}
