import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withRBAC } from '@/lib/api-middleware';

export async function GET(request: NextRequest) {
  return withRBAC(request, 'read', 'LaundryCustomer', async (tenantId: string) => {
    const customers = await prisma.laundryCustomer.findMany({
      where: { tenantId },
      orderBy: { name: 'asc' }
    });
    return NextResponse.json(customers);
  });
}

export async function POST(request: NextRequest) {
  return withRBAC(request, 'create', 'LaundryCustomer', async (tenantId: string) => {
    const body = await request.json();
    const { name, phone, email, address, notes } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: 'Name and phone are required' }, { status: 400 });
    }

    const customer = await prisma.laundryCustomer.create({
      data: {
        tenantId,
        name,
        phone,
        email,
        address,
        notes
      }
    });

    return NextResponse.json(customer, { status: 201 });
  });
}
