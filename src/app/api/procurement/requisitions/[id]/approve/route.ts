import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { NotificationService } from '@/services/NotificationService';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { action, comments } = await request.json();
    const requisitionId = params.id;

    // Multi-level logic: pending -> dept_approved -> stores_approved -> purchase_approved -> finance_approved
    const requisition = await prisma.purchaseRequisition.findUnique({
      where: { id: requisitionId }
    });

    if (!requisition) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    let nextStatus = requisition.status;
    if (action === 'approve') {
       if (requisition.status === 'pending') nextStatus = 'dept_approved';
       else if (requisition.status === 'dept_approved') nextStatus = 'stores_approved';
       else if (requisition.status === 'stores_approved') nextStatus = 'purchase_approved';
       else if (requisition.status === 'purchase_approved') nextStatus = 'finance_approved';
    } else if (action === 'reject') {
       nextStatus = 'rejected';
    }

    const [updatedReq, approval] = await prisma.$transaction([
       prisma.purchaseRequisition.update({
         where: { id: requisitionId },
         data: { status: nextStatus }
       }),
       prisma.approvalAction.create({
         data: {
           requisitionId,
           userId: session.user.id,
           userName: session.user.name,
           roleAtTime: session.user.role,
           action: action === 'approve' ? 'approved' : 'rejected',
           comments
         }
       })
    ]);

    // Async notification logic
    await NotificationService.create({
        tenantId: session.user.tenantId,
        userId: updatedReq.requestedBy, // Note: In a real app we'd link requestedBy to a userId
        title: `Requisition Update: ${updatedReq.requisitionNo}`,
        message: `Your indent has been ${action === 'approve' ? 'approved' : 'rejected'}. Current status: ${nextStatus}`,
        type: action === 'approve' ? 'success' : 'error'
    }).catch(console.error);

    return NextResponse.json(updatedReq);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
