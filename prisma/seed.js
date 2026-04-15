const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database (Industrial v3)...');

  // 1. Create Default Tenant
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'default-tenant' },
    update: {},
    create: {
      id: 'default-tenant',
      name: 'TSysLab Industrial Hub',
      slug: 'default-tenant'
    }
  });

  // 2. Create Admin User
  const adminPass = await bcrypt.hash('Admin@123', 10);
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: { password: adminPass, tenantId: tenant.id },
    create: {
      username: 'admin',
      password: adminPass,
      name: 'System Administrator',
      role: 'admin',
      tenantId: tenant.id
    }
  });

  // 3. Create Demo Customer & Service
  const customer = await prisma.laundryCustomer.create({
    data: {
      tenantId: tenant.id,
      name: 'Ahmad Al-Mansour',
      phone: '+974 5555 1234',
      email: 'ahmad@example.qa',
      totalOrders: 12
    }
  });

  const service = await prisma.laundryService.create({
    data: {
      tenantId: tenant.id,
      name: 'Premium Dry Clean',
      category: 'Garment',
      price: 45.0,
      unit: 'piece'
    }
  });

  // 4. Create Demo Order
  await prisma.laundryOrder.create({
    data: {
      tenantId: tenant.id,
      orderNumber: 'LND-1001',
      customerId: customer.id,
      status: 'processing',
      totalAmount: 90.0,
      receivedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      items: {
        create: {
          serviceId: service.id,
          quantity: 2,
          unitPrice: 45.0,
          subtotal: 90.0,
          garmentType: 'Thobe'
        }
      }
    }
  });

  // 5. Create Infrastructure Monitors
  await prisma.serverMonitor.createMany({
    data: [
      { tenantId: tenant.id, name: 'Core Gateway', ip: '127.0.0.1', status: 'online' },
      { tenantId: tenant.id, name: 'DB Cluster A', ip: '10.0.0.5', status: 'online' },
      { tenantId: tenant.id, name: 'Offline Backup', ip: '192.0.2.1', status: 'offline' }
    ]
  });

  console.log('✅ Industrial Database Seeded!');
  console.log('Admin Access: admin / Admin@123');
}

main().catch(console.error).finally(() => prisma.$disconnect());
