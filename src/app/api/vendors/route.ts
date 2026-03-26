import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  const vendors = await prisma.vendor.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } });
  return NextResponse.json({ vendors });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const vendor = await prisma.vendor.create({ data: { name: body.name, category: body.category, contactPerson: body.contactPerson, email: body.email, phone: body.phone, address: body.address, website: body.website } });
  return NextResponse.json(vendor, { status: 201 });
}