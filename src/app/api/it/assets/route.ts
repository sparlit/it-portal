import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withRBAC } from '@/lib/api-middleware';
import { AuditService } from '@/services/AuditService';
import { z } from 'zod';

const AssetSchema = z.object({
  type: z.enum(['computer', 'server', 'printer', 'network', 'other']),
  name: z.string().min(1),
  model: z.string().min(1),
  serialNumber: z.string().min(1),
  location: z.string().min(1),
  ipAddress: z.string().optional().or(z.literal('')),
  status: z.string().default('active'),
  assignedTo: z.string().optional(),
  purchaseDate: z.string().optional(),
  warrantyEnd: z.string().optional(),
  notes: z.string().optional(),
});

export async function GET(request: NextRequest) {
  return withRBAC(request, 'read', 'Asset', async (tenantId) => {
    const assets = await prisma.asset.findMany({
      where: { tenantId },
      orderBy: { updatedAt: 'desc' }
    });
    return NextResponse.json(assets);
  });
}

export async function POST(request: NextRequest) {
  return withRBAC(request, 'manage', 'Asset', async (tenantId, user) => {
    try {
      const body = await request.json();
      const validatedData = AssetSchema.parse(body);

      const asset = await prisma.asset.create({
        data: {
          tenantId,
          ...validatedData,
          ipAddress: validatedData.ipAddress || null
        }
      });

      await AuditService.logActivity(tenantId, user.id, user.username, `Added Asset: ${asset.name} (${asset.serialNumber})`);

      return NextResponse.json(asset, { status: 201 });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json({ error: error.issues }, { status: 400 });
      }
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  });
}
