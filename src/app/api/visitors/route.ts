import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

function generatePass(): string {
  return `VIS-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '50');
  const status = searchParams.get('status');

  const where: any = status ? { status } : {};
  const [visitors, total] = await Promise.all([
    prisma.visitor.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { checkIn: 'desc' } }),
    prisma.visitor.count({ where })
  ]);

  return NextResponse.json({ visitors, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const visitor = await prisma.visitor.create({
    data: { visitorPass: generatePass(), name: body.name, company: body.company, purpose: body.purpose, category: body.category || 'general', personToVisit: body.personToVisit, department: body.department, phone: body.phone }
  });
  return NextResponse.json(visitor, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const { id, action } = await request.json();
  if (action === 'checkout') {
    const visitor = await prisma.visitor.update({ where: { id }, data: { checkOut: new Date(), status: 'checked_out' } });
    return NextResponse.json(visitor);
  }
  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}