import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  const announcements = await prisma.announcement.findMany({ where: { isActive: true }, orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }] });
  return NextResponse.json({ announcements });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const announcement = await prisma.announcement.create({ data: { title: body.title, content: body.content, category: body.category || 'general', priority: body.priority || 'normal', authorName: body.authorName || 'System', isActive: body.isActive ?? true, isPinned: body.isPinned ?? false } });
  return NextResponse.json(announcement, { status: 201 });
}