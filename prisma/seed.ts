import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Use a fixed ID for the default tenant to match the dev header
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'default-tenant' },
    update: {},
    create: {
      id: 'default-tenant',
      name: 'Default Laundry & IT',
      slug: 'default-tenant'
    }
  })

  const customer = await prisma.laundryCustomer.create({
    data: {
      tenantId: tenant.id,
      name: 'John Doe',
      phone: '12345678',
      email: 'john@example.com',
      totalOrders: 5
    }
  })

  const service = await prisma.laundryService.create({
    data: {
      tenantId: tenant.id,
      name: 'Full Wash',
      category: 'Garment',
      price: 25.0,
      unit: 'piece'
    }
  })

  await prisma.laundryOrder.create({
    data: {
      tenantId: tenant.id,
      orderNumber: 'LND-1001',
      customerId: customer.id,
      status: 'received',
      totalAmount: 50.0,
      items: {
        create: {
          serviceId: service.id,
          quantity: 2,
          unitPrice: 25.0,
          subtotal: 50.0
        }
      }
    }
  })

  await prisma.ticket.create({
    data: {
      tenantId: tenant.id,
      ticketId: 'TKT-IT-001',
      module: 'IT',
      title: 'Server Migration',
      requester: 'Admin',
      priority: 'high',
      status: 'open'
    }
  })

  await prisma.ticket.create({
    data: {
      tenantId: tenant.id,
      ticketId: 'TKT-CS-001',
      module: 'LAUNDRY',
      title: 'Delayed Delivery',
      description: 'My order is 2 days late.',
      requester: customer.name,
      priority: 'medium',
      status: 'open'
    }
  })

  console.log('Seeding finished with fixed tenant ID.')
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect())
