import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withRBAC } from '@/lib/api-middleware';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return withRBAC(request, 'read', 'Asset', async (tenantId: string) => {
    const asset = await prisma.asset.findFirst({
      where: { id, tenantId }
    });

    if (!asset) return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
    return NextResponse.json(asset);
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return withRBAC(request, 'update', 'Asset', async (tenantId: string) => {
    const body = await request.json();
    const asset = await prisma.asset.updateMany({
      where: { id, tenantId },
      data: body
    });

    if (asset.count === 0) return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
    return NextResponse.json({ message: 'Asset updated successfully' });
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return withRBAC(request, 'delete', 'Asset', async (tenantId: string) => {
    const result = await prisma.asset.deleteMany({
      where: { id, tenantId }
    });

    if (result.count === 0) return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
    return NextResponse.json({ message: 'Asset deleted successfully' });
  });
}
