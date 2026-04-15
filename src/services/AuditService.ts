import { prisma } from '@/lib/db';

export class AuditService {
  static async logAction(tenantId: string, user: string, action: string) {
    try {
      return await prisma.activityLog.create({
        data: {
          tenantId,
          user,
          action,
        },
      });
    } catch (error) {
      console.error('Failed to record activity log:', error);
      // We don't throw here to avoid blocking the main operation
    }
  }

  static async getLogs(tenantId: string, limit: number = 50) {
    return await prisma.activityLog.findMany({
      where: { tenantId },
      orderBy: { timestamp: 'desc' },
      take: limit,
    });
  }
}
