import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  const settings = await prisma.setting.findMany({ orderBy: { key: 'asc' } });
  const settingsMap = settings.reduce((acc: any, s) => { acc[s.key] = s.value; return acc; }, {});
  return NextResponse.json({ settings: settingsMap });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const setting = await prisma.setting.upsert({ where: { key: body.key }, update: { value: body.value }, create: { key: body.key, value: body.value } });
  return NextResponse.json(setting);
}