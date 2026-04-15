import { NextRequest, NextResponse } from 'next/server';
import { withRBAC } from '@/lib/api-middleware';
import { VaultService } from '@/services/VaultService';
import { z } from 'zod';

const CredentialSchema = z.object({
  system: z.string().min(1),
  username: z.string().optional(),
  password: z.string().optional(),
});

export async function GET(request: NextRequest) {
  return withRBAC(request, 'manage', 'Setting', async (tenantId: string) => {
    const credentials = await VaultService.getCredentials(tenantId);
    return NextResponse.json(credentials);
  });
}

export async function POST(request: NextRequest) {
  return withRBAC(request, 'manage', 'Setting', async (tenantId: string) => {
    try {
      const body = await request.json();
      const validated = CredentialSchema.parse(body);
      const credential = await VaultService.addCredential(tenantId, validated);
      return NextResponse.json(credential, { status: 201 });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json({ error: error.issues }, { status: 400 });
      }
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  });
}
