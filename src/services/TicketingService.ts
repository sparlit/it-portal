import { prisma } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export class TicketingService {
  static async generateITId() {
    const date = new Date();
    const prefix = `TKT-IT-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}`;
    const random = uuidv4().split('-')[0].toUpperCase();
    return `${prefix}-${random}`;
  }

  static async generateLaundryId() {
    const date = new Date();
    const prefix = `TKT-CS-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}`;
    const random = uuidv4().split('-')[0].toUpperCase();
    return `${prefix}-${random}`;
  }

  static async createITTicket(tenantId: string, data: any, user: any) {
    const ticket = await prisma.iTTicket.create({
      data: {
        ...data,
        tenantId,
        ticketId: await this.generateITId()
      }
    });

    await prisma.activityLog.create({
      data: {
        tenantId,
        user: user?.name || 'System',
        action: `Created IT Ticket ${ticket.ticketId}: ${ticket.title}`
      }
    });

    return ticket;
  }

  static async createLaundryTicket(tenantId: string, data: any, user: any) {
    const ticket = await prisma.laundryTicket.create({
      data: {
        ...data,
        tenantId,
        ticketId: await this.generateLaundryId()
      }
    });

    await prisma.activityLog.create({
      data: {
        tenantId,
        user: user?.name || 'System',
        action: `Created Laundry Ticket ${ticket.ticketId}: ${ticket.subject}`
      }
    });

    return ticket;
  }
}
