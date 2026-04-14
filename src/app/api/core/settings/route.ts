import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withTenant } from '@/lib/api-middleware';

/**
 * Fetches all settings for the tenant associated with the incoming request.
 *
 * @returns A NextResponse containing an array of the tenant's setting records serialized as JSON
 */
export async function GET(request: NextRequest) {
  return withTenant(request, async (tenantId: string) => {
    const settings = await prisma.setting.findMany({
      where: { tenantId }
    });
    return NextResponse.json(settings);
  });
}

/**
 * Upserts a tenant-scoped setting by `key` and returns the saved record.
 *
 * Validates that `key` is present in the request body; if missing, responds with a JSON error and HTTP 400.
 *
 * @returns The upserted setting object as JSON, or a JSON error object with status 400 when `key` is missing.
 */
export async function PUT(request: NextRequest) {
  return withTenant(request, async (tenantId: string) => {
    const body = await request.json();
    const { key, value } = body;

    if (!key) {
      return NextResponse.json({ error: 'Key is required' }, { status: 400 });
    }

    const setting = await prisma.setting.upsert({
      where: {
        tenantId_key: {
          tenantId,
          key
        }
      },
      update: { value },
      create: {
        tenantId,
        key,
        value
      }
    });

    return NextResponse.json(setting);
  });
}
