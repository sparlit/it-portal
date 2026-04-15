import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withRBAC } from '@/lib/api-middleware';

export async function GET(request: NextRequest) {
  return withRBAC(request, 'read', 'Setting', async (tenantId: string) => {
    const settings = await prisma.setting.findMany({
      where: { tenantId }
    });
    return NextResponse.json(settings);
  });
}

export async function PUT(request: NextRequest) {
  return withRBAC(request, 'read', 'Setting', async (tenantId: string) => {
    const body = await request.json();
    const { key, value } = body;

    if (!key) {
      return NextResponse.json({ error: 'Key is required' }, { status: 400 });
    }

    const setting = await prisma.setting.upsert({
      where: {
        tenantId_key: {
          tenantId,
          key
        }
      },
      update: { value },
      create: {
        tenantId,
        key,
        value
      }
    });

    return NextResponse.json(setting);
  });
}
