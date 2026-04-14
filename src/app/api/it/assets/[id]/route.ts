import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withTenant } from '@/lib/api-middleware';

/**
 * Retrieve a tenant-scoped asset by ID.
 *
 * @param params - Route parameters containing the asset `id`
 * @param params.id - The ID of the asset to fetch
 * @returns A `NextResponse` with the asset as JSON, or `{ error: 'Asset not found' }` and HTTP 404 if no matching asset exists.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withTenant(request, async (tenantId: string) => {
    const asset = await prisma.asset.findFirst({
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

/**
 * Update an existing asset (scoped to the current tenant) identified by `params.id`.
 *
 * @param params - Route parameters containing the `id` of the asset to update
 * @returns A NextResponse with `{ error: 'Asset not found' }` and HTTP 404 if no matching asset exists, otherwise `{ message: 'Asset updated successfully' }`
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withTenant(request, async (tenantId: string) => {
    const body = await request.json();

    const asset = await prisma.asset.updateMany({
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

/**
 * Deletes the asset with the given `params.id` for the current tenant.
 *
 * @param params - Route parameters; `params.id` is the ID of the asset to delete.
 * @returns `NextResponse` containing `{ error: 'Asset not found' }` with HTTP 404 when no matching asset exists, or `{ message: 'Asset deleted successfully' }` on success.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withTenant(request, async (tenantId: string) => {
    const result = await prisma.asset.deleteMany({
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
