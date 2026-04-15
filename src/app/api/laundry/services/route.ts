import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withRBAC } from '@/lib/api-middleware';
import { AuditService } from '@/services/AuditService';
import { z } from 'zod';

const ServiceSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  price: z.number().positive(),
  unit: z.string().default('piece'),
  estimatedTime: z.number().int().positive().default(24),
});

export async function GET(request: NextRequest) {
  return withRBAC(request, 'read', 'LaundryOrder', async (tenantId) => {
    const services = await prisma.laundryService.findMany({
      where: { tenantId },
      orderBy: { category: 'asc' }
    });
    return NextResponse.json(services);
  });
}

export async function POST(request: NextRequest) {
  return withRBAC(request, 'manage', 'Setting', async (tenantId, user) => {
    try {
      const body = await request.json();
      const validatedData = ServiceSchema.parse(body);

      const service = await prisma.laundryService.create({
        data: {
          tenantId,
          ...validatedData
        }
      });

      await AuditService.logActivity(tenantId, user.id, user.username, `Created Laundry Service: ${service.name}`);

      return NextResponse.json(service, { status: 201 });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json({ error: error.issues }, { status: 400 });
      }
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  });
}
