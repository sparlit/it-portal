import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  const path = request.nextUrl.pathname;

  const isPublicPath = path === '/login' || path.startsWith('/api/core/auth/login');

  if (!session && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (session && path === '/login') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    '/api/:path*',
  ],
};
