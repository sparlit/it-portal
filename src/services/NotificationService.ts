import { prisma } from '@/lib/db';

export class NotificationService {
  static async create({
    tenantId,
    userId,
    title,
    message,
    type = 'info',
    link
  }: {
    tenantId: string;
    userId: string;
    title: string;
    message: string;
    type?: 'info' | 'success' | 'warning' | 'error';
    link?: string;
  }) {
    return await prisma.notification.create({
      data: {
        tenantId,
        userId,
        title,
        message,
        type,
        link
      }
    });
  }

  static async notifyGroup({
    tenantId,
    role,
    title,
    message,
    type = 'info',
    link
  }: {
    tenantId: string;
    role: string;
    title: string;
    message: string;
    type?: 'info' | 'success' | 'warning' | 'error';
    link?: string;
  }) {
    const users = await prisma.user.findMany({
      where: { tenantId, role }
    });

    return await Promise.all(
      users.map(user =>
        this.create({ tenantId, userId: user.id, title, message, type, link })
      )
    );
  }
}
