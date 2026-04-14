import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from './auth';
import { Role, Permission, hasPermission } from './rbac';

export async function withTenant(req: NextRequest, handler: (tenantId: string, user: any) => Promise<NextResponse>) {
  // Try to get tenant from session first (Production Standard)
  const sessionToken = req.cookies.get('session')?.value;
  let tenantId = null;
  let user = null;

  if (sessionToken) {
    try {
      const payload = await decrypt(sessionToken);
      tenantId = payload?.user?.tenantId;
      user = payload?.user;
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

  return handler(tenantId, user);
}

export async function withRBAC(
  req: NextRequest,
  action: Permission['action'],
  subject: Permission['subject'],
  handler: (tenantId: string, user: any) => Promise<NextResponse>
) {
  return withTenant(req, async (tenantId, user) => {
    if (!user) {
      if (process.env.NODE_ENV !== 'production' && req.headers.get('x-tenant-id')) {
        return handler(tenantId, { role: 'ADMIN' });
      }
      return NextResponse.json({ error: 'Unauthorized: Authentication required for RBAC' }, { status: 401 });
    }

    if (!hasPermission(user.role as Role, action, subject)) {
      return NextResponse.json({
        error: `Forbidden: Role ${user.role} does not have permission to ${action} ${subject}`
      }, { status: 403 });
    }

    return handler(tenantId, user);
  });
}
