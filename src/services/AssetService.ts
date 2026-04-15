import { prisma } from '@/lib/db';

export class AssetService {
  static async listAssets(tenantId: string) {
    return prisma.asset.findMany({
      where: { tenantId },
      orderBy: { updatedAt: 'desc' }
    });
  }

  static async createAsset(tenantId: string, data: any) {
    return prisma.asset.create({
      data: {
        ...data,
        tenantId
      }
    });
  }
}
