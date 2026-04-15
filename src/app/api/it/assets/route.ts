import { NextRequest, NextResponse } from 'next/server';
import { withTenant } from '@/lib/api-middleware';
import { AssetService } from '@/services/AssetService';
import { z } from 'zod';

const AssetSchema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  serialNumber: z.string().min(1),
  model: z.string().optional(),
  location: z.string().optional(),
  ipAddress: z.string().optional(),
  status: z.string().optional(),
  assignedTo: z.string().optional(),
  purchaseDate: z.string().optional(),
  warrantyEnd: z.string().optional(),
  notes: z.string().optional()
});

export async function GET(request: NextRequest) {
  return withTenant(request, async (tenantId: string) => {
    const assets = await AssetService.listAssets(tenantId);
    return NextResponse.json(assets);
  });
}

export async function POST(request: NextRequest) {
  return withTenant(request, async (tenantId: string) => {
    try {
      const body = await request.json();
      const result = AssetSchema.safeParse(body);

      if (!result.success) {
        return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
      }

      const asset = await AssetService.createAsset(tenantId, result.data);
      return NextResponse.json(asset, { status: 201 });
    } catch (error) {
      return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
    }
  });
}
