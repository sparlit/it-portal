import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { encrypt } from '@/lib/auth';
import { PortalType, hasPortalAccess } from '@/lib/rbac';

export async function POST(request: NextRequest) {
  try {
    const { username, password, portal } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    const user = await prisma.cORE_User.findFirst({
      where: {
        OR: [
          { username: username.toLowerCase() },
          { email: username.toLowerCase() }
        ],
        status: 'active'
      }
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Portal-specific access check
    if (portal && portal !== 'admin') {
      if (!hasPortalAccess(user, portal as PortalType)) {
        return NextResponse.json({ error: `You do not have permission to access the ${portal} portal.` }, { status: 403 });
      }
    }

    // SuperAdmin only for admin portal
    if (portal === 'admin' && user.role !== 'SUPERADMIN') {
        return NextResponse.json({ error: 'Access restricted to System Administrators.' }, { status: 403 });
    }

    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    const session = await encrypt({
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
        tenantId: user.tenantId,
        portalPermissions: user.portalPermissions
      },
      expires
    });

    const response = NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
        tenantId: user.tenantId
      }
    });

    response.cookies.set('session', session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
