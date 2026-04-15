import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'al-rayes' },
    update: {},
    create: {
      name: 'Al Rayes Laundry',
      slug: 'al-rayes',
      plan: 'enterprise',
      status: 'active',
    },
  })

  const hashedPassword = await bcrypt.hash('admin123', 10)

  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
      name: 'Admin User',
      role: 'SUPERADMIN',
      tenantId: tenant.id,
    },
  })

  // Add sample nodes for monitoring
  const nodes = [
    { name: 'Main Database', ip: '127.0.0.1' },
    { name: 'Web Server Alpha', ip: '127.0.0.1' },
    { name: 'Laundry IoT Hub', ip: '192.168.1.100' },
  ]

  for (const node of nodes) {
    await prisma.serverMonitor.upsert({
      where: { id: `node-${node.name.toLowerCase().replace(/\s+/g, '-')}` },
      update: {},
      create: {
        id: `node-${node.name.toLowerCase().replace(/\s+/g, '-')}`,
        tenantId: tenant.id,
        name: node.name,
        ip: node.ip,
        status: 'online',
      }
    })
  }

  console.log('Seed completed')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
