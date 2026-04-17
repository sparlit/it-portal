import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withTenant } from '@/lib/api-middleware';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withTenant(request, async (tenantId: string) => {
    const asset = await prisma.iT_Asset.findFirst({
      where: {
        id: params.id,
        tenantId
      }
    });

    if (!asset) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
    }

    return NextResponse.json(asset);
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withTenant(request, async (tenantId: string) => {
    const body = await request.json();

    const asset = await prisma.iT_Asset.updateMany({
      where: {
        id: params.id,
        tenantId
      },
      data: {
        name: body.name,
        type: body.type,
        model: body.model,
        serialNumber: body.serialNumber,
        location: body.location,
        ipAddress: body.ipAddress,
        status: body.status,
        assignedTo: body.assignedTo,
        purchaseDate: body.purchaseDate,
        warrantyEnd: body.warrantyEnd,
        notes: body.notes
      }
    });

    if (asset.count === 0) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Asset updated successfully' });
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withTenant(request, async (tenantId: string) => {
    const result = await prisma.iT_Asset.deleteMany({
      where: {
        id: params.id,
        tenantId
      }
    });

    if (result.count === 0) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Asset deleted successfully' });
  });
}
