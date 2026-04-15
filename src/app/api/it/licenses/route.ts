import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withRBAC } from '@/lib/api-middleware';

export async function GET(request: NextRequest) {
  return withRBAC(request, 'read', 'Asset', async (tenantId: string) => {
    const licenses = await prisma.license.findMany({
      where: { tenantId },
      orderBy: { updatedAt: 'desc' }
    });
    return NextResponse.json(licenses);
  });
}

export async function POST(request: NextRequest) {
  return withRBAC(request, 'read', 'Asset', async (tenantId: string) => {
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
