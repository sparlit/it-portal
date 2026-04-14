import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withTenant } from '@/lib/api-middleware';
import { getSession } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withTenant(request, async (tenantId: string) => {
    const user = await prisma.user.findFirst({
      where: {
        id: params.id,
        tenantId
      },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withTenant(request, async (tenantId: string) => {
    const body = await request.json();

    // Get the authenticated session
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Build update data with permission checks
    const updateData: any = {
      name: body.name,
      email: body.email
    };

    // Only allow role and status updates if the requester is an admin
    const isAdmin = session.role === 'admin';
    if (body.role !== undefined || body.status !== undefined) {
      if (!isAdmin) {
        return NextResponse.json(
          { error: 'Forbidden: Only admins can update role or status' },
          { status: 403 }
        );
      }
      if (body.role !== undefined) {
        updateData.role = body.role;
      }
      if (body.status !== undefined) {
        updateData.status = body.status;
      }
    }

    const user = await prisma.user.updateMany({
      where: {
        id: params.id,
        tenantId
      },
      data: updateData
    });

    if (user.count === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'User updated successfully' });
  });
}