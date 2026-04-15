import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withRBAC } from '@/lib/api-middleware';
import { VaultService } from '@/services/VaultService';
import { AuditService } from '@/services/AuditService';

export async function GET(request: NextRequest) {
  return withRBAC(request, 'manage', 'Setting', async (tenantId: string) => {
    const credentials = await prisma.credential.findMany({
      where: { tenantId },
      orderBy: { system: 'asc' }
    });

    // In a real production scenario, we might only return the system names
    // and decrypt passwords only on explicit request with additional verification.
    return NextResponse.json(credentials);
  });
}

export async function POST(request: NextRequest) {
  return withRBAC(request, 'manage', 'Setting', async (tenantId: string, user: any) => {
    const { system, username, password } = await request.json();

    if (!system || !password) {
      return NextResponse.json({ error: 'Missing system or password' }, { status: 400 });
    }

    const encryptedPassword = VaultService.encrypt(password);

    const credential = await prisma.credential.create({
      data: {
        tenantId,
        system,
        username,
        password: encryptedPassword
      }
    });

    await AuditService.logAction(tenantId, user?.username || 'system', `Added encrypted credential for system: ${system}`);

    return NextResponse.json(credential, { status: 201 });
  });
}
