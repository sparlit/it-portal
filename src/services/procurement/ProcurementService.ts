import { prisma } from '@/lib/db';
import { NotificationService } from '@/services/NotificationService';

export type ApprovalStatus = 'pending' | 'dept_approved' | 'stores_approved' | 'purchase_approved' | 'finance_approved' | 'rejected';

export class ProcurementService {
  private static statusFlow: ApprovalStatus[] = [
    'pending',
    'dept_approved',
    'stores_approved',
    'purchase_approved',
    'finance_approved'
  ];

  static async approve(requisitionId: string, userId: string, userName: string, role: string, comments?: string) {
    const requisition = await prisma.sTORES_Requisition.findUnique({
      where: { id: requisitionId }
    });

    if (!requisition) throw new Error('Requisition not found');

    const currentIndex = this.statusFlow.indexOf(requisition.status as ApprovalStatus);
    if (currentIndex === -1 || currentIndex === this.statusFlow.length - 1) {
      throw new Error('Requisition is already fully approved or in an invalid state');
    }

    const nextStatus = this.statusFlow[currentIndex + 1];

    return prisma.$transaction(async (tx) => {
      // 1. Update requisition status
      const updated = await tx.purchaseRequisition.update({
        where: { id: requisitionId },
        data: { status: nextStatus }
      });

      // 2. Log approval action
      await tx.approvalAction.create({
        data: {
          requisitionId,
          userId,
          userName,
          roleAtTime: role,
          action: 'approved',
          comments
        }
      });

      // 3. Notify requester
      await NotificationService.create({
        tenantId: requisition.tenantId,
        userId: requisition.requestedBy, // Note: In a production app, link requestedBy to userId
        title: 'Requisition Updated',
        message: `Your PR ${requisition.requisitionNo} is now ${nextStatus.replace('_', ' ')}.`,
        type: 'success'
      }).catch(console.error);

      return updated;
    });
  }

  static async reject(requisitionId: string, userId: string, userName: string, role: string, comments: string) {
    return prisma.$transaction(async (tx) => {
      const updated = await tx.purchaseRequisition.update({
        where: { id: requisitionId },
        data: { status: 'rejected' }
      });

      await tx.approvalAction.create({
        data: {
          requisitionId,
          userId,
          userName,
          roleAtTime: role,
          action: 'rejected',
          comments
        }
      });

      return updated;
    });
  }
}
