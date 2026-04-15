import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting Ticketing Lifecycle Verification...');

  // 1. Setup Tenant
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'test-tenant' },
    update: {},
    create: {
      name: 'Test Tenant',
      slug: 'test-tenant',
    },
  });

  // 2. Setup Customer for Laundry
  const customer = await prisma.laundryCustomer.create({
    data: {
      tenantId: tenant.id,
      name: 'Verification Customer',
      phone: '12345678',
    },
  });

  console.log('✅ Environment Setup Complete.');

  // 3. Test IT Ticket Creation
  console.log('\n--- Testing IT Ticketing ---');
  const itTicket = await prisma.iTTicket.create({
    data: {
      tenantId: tenant.id,
      ticketId: `TKT-IT-VERIFY-${Date.now()}`,
      title: 'Verification Ticket',
      requester: 'Jules Agent',
      category: 'Infrastructure',
    },
  });
  console.log('✅ IT Ticket Created:', itTicket.ticketId);

  await prisma.activityLog.create({
    data: {
      tenantId: tenant.id,
      user: 'jules',
      action: `Created IT Ticket ${itTicket.ticketId} via script`,
    },
  });

  // 4. Test Laundry Ticket Creation
  console.log('\n--- Testing Laundry Ticketing ---');
  const csTicket = await prisma.laundryTicket.create({
    data: {
      tenantId: tenant.id,
      ticketId: `TKT-CS-VERIFY-${Date.now()}`,
      customerId: customer.id,
      subject: 'Garment Issue',
      message: 'Testing the verification pipeline.',
    },
  });
  console.log('✅ Laundry Ticket Created:', csTicket.ticketId);

  await prisma.activityLog.create({
    data: {
      tenantId: tenant.id,
      user: 'jules',
      action: `Created Laundry CS Ticket ${csTicket.ticketId} via script`,
    },
  });

  // 5. Verify Audit Logs
  console.log('\n--- Verifying Audit Logs ---');
  const logs = await prisma.activityLog.findMany({
    where: { tenantId: tenant.id },
    orderBy: { timestamp: 'desc' },
    take: 2,
  });

  if (logs.length === 2) {
    console.log('✅ Audit Logs Persistent.');
    logs.forEach(log => console.log(` - [${log.timestamp.toISOString()}] ${log.user}: ${log.action}`));
  } else {
    throw new Error(`Audit log mismatch. Expected 2, found ${logs.length}`);
  }

  // 6. Cleanup
  console.log('\n--- Cleaning Up ---');
  await prisma.activityLog.deleteMany({ where: { tenantId: tenant.id } });
  await prisma.iTTicket.deleteMany({ where: { tenantId: tenant.id } });
  await prisma.laundryTicket.deleteMany({ where: { tenantId: tenant.id } });
  await prisma.laundryCustomer.deleteMany({ where: { tenantId: tenant.id } });
  // Keep the tenant for future runs if needed

  console.log('✅ Cleanup Successful.');
  console.log('\n🏁 Ticketing Lifecycle Verified Successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Verification Failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
