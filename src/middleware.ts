import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  const path = request.nextUrl.pathname;

  // Public paths
  const isPublicPath = path === '/login' ||
                       path.endsWith('/login') ||
                       path.startsWith('/api/core/auth/login');

  if (!session && !isPublicPath) {
    // Determine where to redirect based on the portal path
    if (path.startsWith('/portal/')) {
        const portalMatch = path.match(/\/portal\/([^\/]+)/);
        if (portalMatch && portalMatch[1]) {
            return NextResponse.redirect(new URL(`/portal/${portalMatch[1]}/login`, request.url));
        }
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (session) {
    try {
        const payload = await decrypt(session);
        const user = payload.user;

        // Redirect from login to portal root if already logged in
        if (path.endsWith('/login') || path === '/login') {
            return NextResponse.redirect(new URL('/', request.url));
        }

        // Check portal access in middleware for extra security
        if (path.startsWith('/portal/')) {
            const portalMatch = path.match(/\/portal\/([^\/]+)/);
            const portal = portalMatch ? portalMatch[1] : null;

            if (portal && portal !== 'admin' && user.role !== 'SUPERADMIN') {
                const permissions = user.portalPermissions || {};
                if (!permissions[portal] || permissions[portal].length === 0) {
                    return NextResponse.redirect(new URL('/', request.url));
                }
            }

            if (portal === 'admin' && user.role !== 'SUPERADMIN') {
                return NextResponse.redirect(new URL('/', request.url));
            }
        }
    } catch (e) {
        // Invalid session
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('session');
        return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    '/api/:path*',
  ],
};
