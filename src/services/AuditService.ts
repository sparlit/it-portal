import { prisma } from '@/lib/db';

export class AuditService {
  static async logActivity(
    tenantId: string,
    userId: string,
    username: string,
    action: string
  ) {
    try {
      await prisma.activityLog.create({
        data: {
          tenantId,
          user: `${username} (${userId})`,
          action,
          timestamp: new Date(),
        }
      });
    } catch (error) {
      console.error('Failed to log activity:', error);
    }
  }

  static async getLogs(tenantId: string, limit: number = 50) {
    return prisma.activityLog.findMany({
      where: { tenantId },
      orderBy: { timestamp: 'desc' },
      take: limit
    });
  }
}
