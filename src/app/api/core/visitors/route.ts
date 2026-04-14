import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withRBAC } from '@/lib/api-middleware';

export async function GET(request: NextRequest) {
  return withRBAC(request, 'read', 'Report', async (tenantId: string) => {
    const visitors = await prisma.visitor.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(visitors);
  });
}

export async function POST(request: NextRequest) {
  return withRBAC(request, 'manage', 'Tenant', async (tenantId: string) => {
    const body = await request.json();
    const visitor = await prisma.visitor.create({
      data: {
        tenantId,
        name: body.name,
        company: body.company,
        purpose: body.purpose,
        status: 'checked-in',
        checkInTime: new Date().toLocaleTimeString()
      }
    });
    return NextResponse.json(visitor, { status: 201 });
  });
}
