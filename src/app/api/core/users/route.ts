import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withRBAC } from '@/lib/api-middleware';
import bcrypt from 'bcryptjs';

export async function GET(request: NextRequest) {
  return withRBAC(request, 'read', 'User', async (tenantId: string) => {
    const users = await prisma.user.findMany({
      where: { tenantId },
      select: { id: true, username: true, name: true, role: true, status: true }
    });
    return NextResponse.json(users);
  });
}

export async function POST(request: NextRequest) {
  return withRBAC(request, 'manage', 'User', async (tenantId: string) => {
    const body = await request.json();
    const hashedPassword = await bcrypt.hash(body.password, 10);
    const user = await prisma.user.create({
      data: { ...body, password: hashedPassword, tenantId }
    });
    const { password: _, ...safeUser } = user;
    return NextResponse.json(safeUser, { status: 201 });
  });
}
