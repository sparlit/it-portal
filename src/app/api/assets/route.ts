import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withRBAC } from '@/lib/api-middleware';

export async function GET(request: NextRequest) {
  return withRBAC(request, 'read', 'Asset', async (tenantId: string) => {
    const assets = await prisma.asset.findMany({
      where: { tenantId },
      orderBy: { updatedAt: 'desc' }
    });
    return NextResponse.json(assets);
  });
}

export async function POST(request: NextRequest) {
  return withRBAC(request, 'create', 'Asset', async (tenantId: string) => {
    const body = await request.json();
    if (!body.name || !body.serialNumber || !body.type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const asset = await prisma.asset.create({
      data: { ...body, tenantId }
    });
    return NextResponse.json(asset, { status: 201 });
  });
}
