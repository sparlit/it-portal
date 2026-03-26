import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  const activities = await prisma.activity.findMany({ take: 50, orderBy: { createdAt: 'desc' }, include: { user: { select: { name: true } } } });
  return NextResponse.json({ activities });
}