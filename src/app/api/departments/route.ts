import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  const departments = await prisma.department.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } });
  return NextResponse.json({ departments });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const department = await prisma.department.create({ data: { name: body.name, code: body.code, managerName: body.managerName, location: body.location, phone: body.phone, email: body.email } });
  return NextResponse.json(department, { status: 201 });
}