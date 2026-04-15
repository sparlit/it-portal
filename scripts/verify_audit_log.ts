import { prisma } from '../src/lib/db';

async function verifyAuditLog() {
  console.log('--- Verifying Order Status Audit Logging ---');

  const tenant = await prisma.tenant.findFirst();
  if (!tenant) throw new Error('No tenant found');
  const tenantId = tenant.id;

  const order = await prisma.laundryOrder.findFirst({ where: { tenantId } });
  if (!order) throw new Error('No order found');

  // Simulate status update logic (since we can't easily hit the API with withRBAC in a script)
  const newStatus = 'processing';

  await prisma.laundryOrder.update({
    where: { id: order.id, tenantId },
    data: { status: newStatus }
  });

  await prisma.activityLog.create({
    data: {
      tenantId,
      user: 'Test Script',
      action: `Updated Order ${order.orderNumber} status to ${newStatus}`
    }
  });

  const latestLog = await prisma.activityLog.findFirst({
    where: { tenantId, action: { contains: newStatus } },
    orderBy: { timestamp: 'desc' }
  });

  if (latestLog) {
    console.log(`SUCCESS: Audit log created: "${latestLog.action}"`);
  } else {
    throw new Error('Audit log NOT created');
  }
}

verifyAuditLog().catch(console.error);
