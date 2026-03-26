import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  const events = await prisma.event.findMany({ orderBy: { startDate: 'asc' } });
  return NextResponse.json({ events });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const event = await prisma.event.create({ data: { title: body.title, description: body.description, category: body.category || 'general', location: body.location, startDate: new Date(body.startDate), endDate: new Date(body.endDate), organizerName: body.organizerName } });
  return NextResponse.json(event, { status: 201 });
}