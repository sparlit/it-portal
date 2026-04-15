import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { themeConfig, isThemePermanent } = await request.json();

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        themeConfig: themeConfig || undefined,
        isThemePermanent: isThemePermanent ?? false,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Theme update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
