import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withRBAC } from '@/lib/api-middleware';
import { AuditService } from '@/services/AuditService';
import { z } from 'zod';

const VisitorSchema = z.object({
  name: z.string().min(1),
  company: z.string().optional().nullable(),
  purpose: z.string().optional().nullable(),
  status: z.string().default('checked-in'),
});

export async function GET(request: NextRequest) {
  return withRBAC(request, 'read', 'Report', async (tenantId) => {
    const visitors = await prisma.visitor.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(visitors);
  });
}

export async function POST(request: NextRequest) {
  return withRBAC(request, 'manage', 'Tenant', async (tenantId, user) => {
    try {
      const body = await request.json();
      const validatedData = VisitorSchema.parse(body);

      const visitor = await prisma.visitor.create({
        data: {
          tenantId,
          ...validatedData,
          checkInTime: new Date().toLocaleTimeString()
        }
      });

      await AuditService.logActivity(tenantId, user.id, user.username, `Checked in visitor: ${visitor.name}`);

      return NextResponse.json(visitor, { status: 201 });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json({ error: error.issues }, { status: 400 });
      }
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  });
}
