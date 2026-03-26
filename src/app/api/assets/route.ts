import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '50');
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category');
  const status = searchParams.get('status');

  const where: any = {};
  if (search) where.OR = [{ assetTag: { contains: search, mode: 'insensitive' } }, { name: { contains: search, mode: 'insensitive' } }];
  if (category) where.category = category;
  if (status) where.status = status;

  const [assets, total] = await Promise.all([
    prisma.asset.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { createdAt: 'desc' } }),
    prisma.asset.count({ where })
  ]);

  return NextResponse.json({ assets, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const count = await prisma.asset.count();
  const assetTag = body.assetTag || `AST-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

  const asset = await prisma.asset.create({
    data: { assetTag, name: body.name, category: body.category, brand: body.brand, model: body.model, serialNumber: body.serialNumber, location: body.location, status: body.status || 'active', condition: body.condition || 'good', notes: body.notes }
  });

  return NextResponse.json(asset, { status: 201 });
}