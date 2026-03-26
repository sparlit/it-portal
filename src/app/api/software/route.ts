import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  const software = await prisma.software.findMany({ where: { isActive: true }, orderBy: { name: 'asc' }, include: { _count: { select: { licenses: true } } } });
  return NextResponse.json({ software });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const software = await prisma.software.create({ data: { name: body.name, vendor: body.vendor, version: body.version, category: body.category, description: body.description } });
  return NextResponse.json(software, { status: 201 });
}