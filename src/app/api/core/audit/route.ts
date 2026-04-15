import { NextRequest, NextResponse } from 'next/server';
import { withRBAC } from '@/lib/api-middleware';
import { AuditService } from '@/services/AuditService';

export async function GET(request: NextRequest) {
  return withRBAC(request, 'read', 'Report', async (tenantId: string) => {
    const logs = await AuditService.getLogs(tenantId);
    return NextResponse.json(logs);
  });
}
