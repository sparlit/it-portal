import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withRBAC } from '@/lib/api-middleware';
import { AuditService } from '@/services/AuditService';
import { z } from 'zod';

const AssetUpdateSchema = z.object({
  type: z.enum(['computer', 'server', 'printer', 'network', 'other']).optional(),
  name: z.string().min(1).optional(),
  model: z.string().min(1).optional(),
  serialNumber: z.string().min(1).optional(),
  location: z.string().min(1).optional(),
  ipAddress: z.string().optional().nullable(),
  status: z.string().optional(),
  assignedTo: z.string().optional().nullable(),
  purchaseDate: z.string().optional().nullable(),
  warrantyEnd: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withRBAC(request, 'read', 'Asset', async (tenantId) => {
    const asset = await prisma.asset.findFirst({
      where: {
        id: params.id,
        tenantId
      }
    });

    if (!asset) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
    }

    return NextResponse.json(asset);
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withRBAC(request, 'manage', 'Asset', async (tenantId, user) => {
    try {
      const body = await request.json();
      const validatedData = AssetUpdateSchema.parse(body);

      const asset = await prisma.asset.update({
        where: {
          id: params.id,
          tenantId
        },
        data: validatedData
      });

      await AuditService.logActivity(tenantId, user.id, user.username, `Updated Asset: ${asset.name}`);

      return NextResponse.json(asset);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json({ error: error.issues }, { status: 400 });
      }
      return NextResponse.json({ error: 'Asset not found or Internal Error' }, { status: 404 });
    }
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withRBAC(request, 'manage', 'Asset', async (tenantId, user) => {
    try {
      const asset = await prisma.asset.delete({
        where: {
          id: params.id,
          tenantId
        }
      });

      await AuditService.logActivity(tenantId, user.id, user.username, `Deleted Asset: ${asset.name}`);

      return NextResponse.json({ message: 'Asset deleted successfully' });
    } catch (error) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
    }
  });
}
