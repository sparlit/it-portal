import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '50');
  const search = searchParams.get('search') || '';

  const where: any = search ? { OR: [{ username: { contains: search, mode: 'insensitive' } }, { name: { contains: search, mode: 'insensitive' } }] } : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { createdAt: 'desc' }, select: { id: true, username: true, name: true, email: true, role: true, department: true, phone: true, isActive: true, lastLogin: true, createdAt: true } }),
    prisma.user.count({ where })
  ]);

  return NextResponse.json({ users, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const hashedPassword = await bcrypt.hash(body.password, 10);
  const user = await prisma.user.create({
    data: { username: body.username.toLowerCase(), password: hashedPassword, name: body.name, email: body.email.toLowerCase(), role: body.role || 'user', department: body.department, phone: body.phone, isActive: body.isActive ?? true },
    select: { id: true, username: true, name: true, email: true, role: true, department: true, phone: true, isActive: true }
  });
  return NextResponse.json(user, { status: 201 });
}