import { prisma } from '@/lib/db';

export class OEEEngine {
  static async calculateCurrentOEE(equipmentId: string) {
    const latestMetrics = await prisma.pROD_MachineMetric.findMany({
      where: { equipmentId },
      orderBy: { timestamp: 'desc' },
      take: 10
    });

    if (latestMetrics.length === 0) return 0;

    const avgOEE = latestMetrics.reduce((sum, m) => sum + m.oee, 0) / latestMetrics.length;
    return avgOEE;
  }

  static async logMetric(equipmentId: string, a: number, p: number, q: number) {
    return prisma.pROD_MachineMetric.create({
      data: {
        equipmentId,
        availability: a,
        performance: p,
        quality: q,
        oee: a * p * q,
        timestamp: new Date()
      }
    });
  }
}
