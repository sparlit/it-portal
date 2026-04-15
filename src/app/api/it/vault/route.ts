import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withRBAC } from '@/lib/api-middleware';
import { VaultService } from '@/services/VaultService';
import { AuditService } from '@/services/AuditService';
import { z } from 'zod';

const CredentialSchema = z.object({
  system: z.string().min(1),
  username: z.string().optional(),
  password: z.string().min(1)
});

export async function GET(request: NextRequest) {
  return withRBAC(request, 'manage', 'Setting', async (tenantId, user) => {
    const credentials = await prisma.credential.findMany({
      where: { tenantId },
      orderBy: { system: 'asc' }
    });

    // Decrypt passwords for the authorized user
    const decrypted = credentials.map(c => ({
      ...c,
      password: c.password ? VaultService.decrypt(c.password) : null
    }));

    await AuditService.logActivity(tenantId, user.id, user.username, 'Accessed Secret Vault');

    return NextResponse.json(decrypted);
  });
}

export async function POST(request: NextRequest) {
  return withRBAC(request, 'manage', 'Setting', async (tenantId, user) => {
    try {
      const body = await request.json();
      const validatedData = CredentialSchema.parse(body);

      const credential = await prisma.credential.create({
        data: {
          tenantId,
          system: validatedData.system,
          username: validatedData.username,
          password: VaultService.encrypt(validatedData.password)
        }
      });

      await AuditService.logActivity(tenantId, user.id, user.username, `Created Credential: ${validatedData.system}`);

      return NextResponse.json(credential, { status: 201 });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json({ error: error.issues }, { status: 400 });
      }
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  });
}
