import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const user = await prisma.user.findUnique({ where: { id }, select: { id: true, username: true, name: true, email: true, role: true, department: true, phone: true, isActive: true, lastLogin: true } });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  return NextResponse.json(user);
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const body = await request.json();
  const updateData: any = { ...body };
  if (body.password) updateData.password = await bcrypt.hash(body.password, 10);
  delete updateData.password;
  const user = await prisma.user.update({ where: { id }, data: updateData, select: { id: true, username: true, name: true, email: true, role: true, department: true, phone: true, isActive: true } });
  return NextResponse.json(user);
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  await prisma.session.deleteMany({ where: { userId: id } });
  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ success: true });
}