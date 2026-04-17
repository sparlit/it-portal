import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withTenant } from '@/lib/api-middleware';

export async function GET(request: NextRequest) {
  return withTenant(request, async (tenantId: string) => {
    const licenses = await prisma.iT_License.findMany({
      where: { tenantId },
      orderBy: { updatedAt: 'desc' }
    });
    return NextResponse.json(licenses);
  });
}

export async function POST(request: NextRequest) {
  return withTenant(request, async (tenantId: string) => {
    const body = await request.json();

    if (!body.software) {
      return NextResponse.json({ error: 'Software name is required' }, { status: 400 });
    }

    const license = await prisma.iT_License.create({
      data: {
        tenantId,
        software: body.software,
        expiryDate: body.expiryDate
      }
    });

    return NextResponse.json(license, { status: 201 });
  });
}
