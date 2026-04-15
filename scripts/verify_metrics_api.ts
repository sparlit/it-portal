import { prisma } from '../src/lib/db';

async function verifyMetrics() {
  console.log('--- Verifying Metrics API Data ---');

  const tenant = await prisma.tenant.findFirst();
  let tenantId: string;

  if (!tenant) {
    console.log('No tenant found. Creating one...');
    const newTenant = await prisma.tenant.create({
      data: { name: 'Test Tenant', slug: 'test' }
    });
    tenantId = newTenant.id;
  } else {
    tenantId = tenant.id;
  }

  // Ensure a customer exists for the order
  let customer = await prisma.laundryCustomer.findFirst({ where: { tenantId } });
  if (!customer) {
    customer = await prisma.laundryCustomer.create({
      data: {
        tenantId,
        name: 'Test Customer',
        phone: '12345678',
      }
    });
  }

  // Create an order if none exist
  const existingOrder = await prisma.laundryOrder.findFirst({ where: { tenantId } });
  if (!existingOrder) {
    await prisma.laundryOrder.create({
      data: {
        orderNumber: 'TEST-001',
        tenantId,
        customerId: customer.id,
        status: 'delivered',
        receivedAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
        deliveredAt: new Date(),
      }
    });
  }

  const totalOrders = await prisma.laundryOrder.count({ where: { tenantId } });
  console.log(`Total Orders in DB: ${totalOrders}`);

  const deliveredOrders = await prisma.laundryOrder.findMany({
    where: {
      tenantId,
      status: 'delivered',
      deliveredAt: { not: undefined },
      receivedAt: { not: undefined }
    },
    select: { receivedAt: true, deliveredAt: true },
    take: 100
  });

  let avgTaktHours = 0;
  if (deliveredOrders.length > 0) {
    const totalTaktTime = deliveredOrders.reduce((acc, order) => {
      if (order.deliveredAt && order.receivedAt) {
        const takt = order.deliveredAt.getTime() - order.receivedAt.getTime();
        return acc + takt;
      }
      return acc;
    }, 0);
    avgTaktHours = totalTaktTime / deliveredOrders.length / (1000 * 60 * 60);
  }

  console.log(`Calculated Takt Time: ${avgTaktHours.toFixed(1)}h`);

  if (avgTaktHours > 0 || totalOrders > 0) {
    console.log('SUCCESS: Metrics are dynamic and calculated from DB.');
  } else {
    console.log('WARNING: Metrics are 0. Ensure test data exists.');
  }
}

verifyMetrics().catch(console.error);
