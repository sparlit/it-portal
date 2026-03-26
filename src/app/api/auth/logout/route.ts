import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  const token = request.cookies.get('it_portal_session')?.value;
  if (token) await prisma.session.deleteMany({ where: { token } });
  const response = NextResponse.json({ success: true });
  response.cookies.delete('it_portal_session');
  return response;
}