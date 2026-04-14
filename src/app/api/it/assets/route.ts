import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withTenant } from '@/lib/api-middleware';

/**
 * Retrieve all asset records for the resolved tenant, ordered by most recently updated.
 *
 * @returns A NextResponse containing a JSON array of the tenant's asset records ordered by `updatedAt` descending.
 */
export async function GET(request: NextRequest) {
  return withTenant(request, async (tenantId: string) => {
    const assets = await prisma.asset.findMany({
      where: { tenantId },
      orderBy: { updatedAt: 'desc' }
    });
    return NextResponse.json(assets);
  });
}

/**
 * Create a new asset scoped to the resolved tenant using data from the request body.
 *
 * Validates that `name`, `serialNumber`, and `type` are present; applies defaults
 * for optional fields (`model` -> "Unknown", `location` -> "Default", `status` -> "active").
 *
 * @returns A `NextResponse` containing the created asset with HTTP status 201, or a JSON error with status 400 when required fields are missing.
 */
export async function POST(request: NextRequest) {
  return withTenant(request, async (tenantId: string) => {
    const body = await request.json();

    if (!body.name || !body.serialNumber || !body.type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const asset = await prisma.asset.create({
      data: {
        tenantId,
        name: body.name,
        type: body.type,
        model: body.model || 'Unknown',
        serialNumber: body.serialNumber,
        location: body.location || 'Default',
        ipAddress: body.ipAddress,
        status: body.status || 'active',
        assignedTo: body.assignedTo,
        purchaseDate: body.purchaseDate,
        warrantyEnd: body.warrantyEnd,
        notes: body.notes
      }
    });

    return NextResponse.json(asset, { status: 201 });
  });
}
