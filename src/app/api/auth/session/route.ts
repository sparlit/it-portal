import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('it_portal_session')?.value;
  if (!token) return NextResponse.json({ user: null, authenticated: false });

  const session = await prisma.session.findFirst({
    where: { token, expiresAt: { gt: new Date() } },
    include: { user: { select: { id: true, username: true, name: true, email: true, role: true, department: true, phone: true } } }
  });

  if (!session) return NextResponse.json({ user: null, authenticated: false });
  return NextResponse.json({ user: session.user, authenticated: true });
}