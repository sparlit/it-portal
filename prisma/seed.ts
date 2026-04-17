import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const tenant = await prisma.cORE_Tenant.upsert({
    where: { slug: 'default-tenant' },
    update: {},
    create: {
      id: 'default-tenant',
      name: 'Artemis Industrial Corp',
      slug: 'default-tenant'
    }
  })

  await prisma.cORE_User.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: 'password123',
      name: 'System Admin',
      role: 'SUPERADMIN',
      tenantId: tenant.id
    }
  })

  await prisma.sTORES_Item.createMany({
    data: [
      {
        tenantId: tenant.id,
        sku: 'CHEM-001',
        name: 'Industrial Detergent',
        category: 'Chemicals',
        currentStock: 5,
        minStockLevel: 20,
        unit: 'KG'
      },
      {
        tenantId: tenant.id,
        sku: 'SP-009',
        name: 'Bearing 6204',
        category: 'Spare Parts',
        currentStock: 2,
        minStockLevel: 10,
        unit: 'PCS'
      }
    ]
  })

  console.log('Industrial Seed Completed.')
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect())
