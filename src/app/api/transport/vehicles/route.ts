import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const vehicles = await prisma.vehicle.findMany({
      where: { tenantId: session.user.tenantId },
      orderBy: { plateNumber: 'asc' }
    });

    return NextResponse.json(vehicles);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const data = await request.json();
    const vehicle = await prisma.vehicle.create({
      data: {
        ...data,
        tenantId: session.user.tenantId
      }
    });

    return NextResponse.json(vehicle);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
