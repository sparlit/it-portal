import { prisma } from '@/lib/db';

export class CustomerService {
  static async listCustomers(tenantId: string) {
    return prisma.laundryCustomer.findMany({
      where: { tenantId },
      orderBy: { name: 'asc' }
    });
  }

  static async createCustomer(tenantId: string, data: any) {
    return prisma.laundryCustomer.create({
      data: {
        ...data,
        tenantId
      }
    });
  }
}
