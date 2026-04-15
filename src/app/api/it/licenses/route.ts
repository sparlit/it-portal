import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withRBAC } from '@/lib/api-middleware';
import { AuditService } from '@/services/AuditService';
import { z } from 'zod';

const LicenseSchema = z.object({
  software: z.string().min(1),
  expiryDate: z.string().optional().nullable(),
});

export async function GET(request: NextRequest) {
  return withRBAC(request, 'read', 'Asset', async (tenantId) => {
    const licenses = await prisma.license.findMany({
      where: { tenantId },
      orderBy: { expiryDate: 'asc' }
    });
    return NextResponse.json(licenses);
  });
}

export async function POST(request: NextRequest) {
  return withRBAC(request, 'manage', 'Asset', async (tenantId, user) => {
    try {
      const body = await request.json();
      const validatedData = LicenseSchema.parse(body);

      const license = await prisma.license.create({
        data: {
          tenantId,
          ...validatedData
        }
      });

      await AuditService.logActivity(tenantId, user.id, user.username, `Added License: ${license.software}`);

      return NextResponse.json(license, { status: 201 });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json({ error: error.issues }, { status: 400 });
      }
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  });
}
