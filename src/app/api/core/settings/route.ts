import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withRBAC } from '@/lib/api-middleware';
import { AuditService } from '@/services/AuditService';
import { z } from 'zod';

const SettingSchema = z.object({
  key: z.string().min(1),
  value: z.string().optional().nullable(),
});

export async function GET(request: NextRequest) {
  return withRBAC(request, 'read', 'Setting', async (tenantId) => {
    const settings = await prisma.setting.findMany({
      where: { tenantId }
    });
    return NextResponse.json(settings);
  });
}

export async function PUT(request: NextRequest) {
  return withRBAC(request, 'manage', 'Setting', async (tenantId, user) => {
    try {
      const body = await request.json();
      const validatedData = SettingSchema.parse(body);

      const setting = await prisma.setting.upsert({
        where: {
          tenantId_key: {
            tenantId,
            key: validatedData.key
          }
        },
        update: { value: validatedData.value },
        create: {
          tenantId,
          key: validatedData.key,
          value: validatedData.value
        }
      });

      await AuditService.logActivity(tenantId, user.id, user.username, `Updated System Setting: ${setting.key}`);

      return NextResponse.json(setting);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json({ error: error.issues }, { status: 400 });
      }
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  });
}
