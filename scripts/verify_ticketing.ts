import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function verify() {
  console.log('--- START VERIFICATION ---')

  // 1. Get a tenant
  const tenant = await prisma.tenant.findFirst()
  if (!tenant) {
    console.error('No tenant found. Run seeds first.')
    return
  }
  const tenantId = tenant.id
  console.log('Using Tenant:', tenant.name, '(', tenantId, ')')

  // 2. Create an IT Ticket via Direct Prisma (to simulate API logic)
  console.log('Creating IT Ticket...')
  const ticket = await prisma.iTTicket.create({
    data: {
      tenantId,
      ticketId: 'TKT-VERIFY-002',
      title: 'Verification Ticket',
      requester: 'Verification Bot',
      status: 'open'
    }
  })
  console.log('Created Ticket:', ticket.ticketId)

  // 3. Create ActivityLog (Simulating API logic)
  console.log('Creating Activity Log...')
  const log = await prisma.activityLog.create({
    data: {
      tenantId,
      user: 'Verification Bot',
      action: `Created IT Ticket ${ticket.ticketId}: ${ticket.title}`
    }
  })
  console.log('Created Log entry:', log.id)

  // 4. Verification
  const verifyTicket = await prisma.iTTicket.findUnique({ where: { id: ticket.id } })
  const verifyLog = await prisma.activityLog.findFirst({
    where: {
      tenantId,
      action: { contains: ticket.ticketId }
    }
  })

  if (verifyTicket && verifyLog) {
    console.log('✅ SUCCESS: Ticket and Log verified.')
  } else {
    console.error('❌ FAILURE: Could not verify data.')
  }

  console.log('--- END VERIFICATION ---')
}

verify()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
