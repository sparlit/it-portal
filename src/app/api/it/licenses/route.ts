import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withTenant } from '@/lib/api-middleware';

/**
 * Fetches license records for the current tenant ordered by most recently updated.
 *
 * The tenant is derived from the incoming request; results are filtered to that tenant and ordered by `updatedAt` descending.
 *
 * @returns A NextResponse containing an array of license records filtered by tenant and ordered by `updatedAt` descending.
 */
export async function GET(request: NextRequest) {
  return withTenant(request, async (tenantId: string) => {
    const licenses = await prisma.license.findMany({
      where: { tenantId },
      orderBy: { updatedAt: 'desc' }
    });
    return NextResponse.json(licenses);
  });
}

/**
 * Create a new license record for the current tenant using data from the request body.
 *
 * @param request - Incoming request whose JSON body must include `software` and may include `expiryDate`.
 * @returns The created license object as JSON with HTTP status 201. If `software` is missing, returns a JSON error `{ error: 'Software name is required' }` with status 400.
 */
export async function POST(request: NextRequest) {
  return withTenant(request, async (tenantId: string) => {
    const body = await request.json();

    if (!body.software) {
      return NextResponse.json({ error: 'Software name is required' }, { status: 400 });
    }

    const license = await prisma.license.create({
      data: {
        tenantId,
        software: body.software,
        expiryDate: body.expiryDate
      }
    });

    return NextResponse.json(license, { status: 201 });
  });
}
