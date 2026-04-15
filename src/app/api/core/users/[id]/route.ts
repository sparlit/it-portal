import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withRBAC } from '@/lib/api-middleware';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return withRBAC(request, 'read', 'User', async (tenantId: string) => {
    const user = await prisma.user.findFirst({
      where: { id, tenantId },
      select: { id: true, username: true, name: true, email: true, role: true, status: true, createdAt: true }
    });

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    return NextResponse.json(user);
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return withRBAC(request, 'manage', 'User', async (tenantId: string) => {
    const body = await request.json();
    const user = await prisma.user.updateMany({
      where: { id, tenantId },
      data: body
    });

    if (user.count === 0) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    return NextResponse.json({ message: 'User updated successfully' });
  });
}
