import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withTenant } from '@/lib/api-middleware';

export async function GET(request: NextRequest) {
  return withTenant(request, async (tenantId: string) => {
    const services = await prisma.laundryService.findMany({
      where: { tenantId },
      orderBy: { category: 'asc' }
    });
    return NextResponse.json(services);
  });
}

export async function POST(request: NextRequest) {
  return withTenant(request, async (tenantId: string) => {
    const body = await request.json();
    const { name, category, price, unit, estimatedTime } = body;

    if (!name || !price || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const service = await prisma.laundryService.create({
      data: {
        tenantId,
        name,
        category,
        price,
        unit: unit || 'piece',
        estimatedTime: estimatedTime || 24
      }
    });

    return NextResponse.json(service, { status: 201 });
  });
}
