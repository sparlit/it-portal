import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  const licenses = await prisma.softwareLicense.findMany({ orderBy: { expiryDate: 'asc' }, include: { software: true, _count: { select: { assetLicenses: true } } } });
  return NextResponse.json({ licenses });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const license = await prisma.softwareLicense.create({ data: { softwareId: body.softwareId, licenseKey: body.licenseKey, licenseType: body.licenseType || 'perpetual', seatsTotal: body.seatsTotal || 1, purchaseDate: body.purchaseDate ? new Date(body.purchaseDate) : null, purchasePrice: body.purchasePrice ? parseFloat(body.purchasePrice) : null, expiryDate: body.expiryDate ? new Date(body.expiryDate) : null } });
  return NextResponse.json(license, { status: 201 });
}