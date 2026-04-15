cat > /var/www/it-portal/prisma/seed.js << 'EOF'
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  const adminPass = await bcrypt.hash('Admin@123', 10);
  const demoPass = await bcrypt.hash('Demo@123', 10);
  const simonPass = await bcrypt.hash('Simon@123', 10);
  const managerPass = await bcrypt.hash('Manager@123', 10);

  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: { username: 'admin', password: adminPass, name: 'Administrator', email: 'admin@industrial.com', role: 'admin', department: 'IT' },
  });

  await prisma.user.upsert({
    where: { username: 'simon' },
    update: {},
    create: { username: 'simon', password: simonPass, name: 'Simon Peter', email: 'simon@industrial.com', role: 'admin', department: 'IT' },
  });

  await prisma.user.upsert({
    where: { username: 'demo' },
    update: {},
    create: { username: 'demo', password: demoPass, name: 'Demo User', email: 'demo@industrial.com', role: 'user', department: 'Operations' },
  });

  await prisma.user.upsert({
    where: { username: 'manager' },
    update: {},
    create: { username: 'manager', password: managerPass, name: 'Department Manager', email: 'manager@industrial.com', role: 'manager', department: 'Administration' },
  });

  const departments = [
    { name: 'Information Technology', code: 'IT', managerName: 'Simon Peter', location: 'Main Building - Floor 2' },
    { name: 'Operations', code: 'OPS', managerName: 'Ahmed Hassan', location: 'Main Building - Floor 1' },
    { name: 'Human Resources', code: 'HR', managerName: 'Fatima Ali', location: 'Main Building - Floor 2' },
    { name: 'Finance', code: 'FIN', managerName: 'Mohammed Khan', location: 'Main Building - Floor 3' },
    { name: 'Administration', code: 'ADMIN', managerName: 'Sara Ahmed', location: 'Main Building - Floor 1' },
  ];

  for (const dept of departments) {
    await prisma.department.upsert({
      where: { name: dept.name },
      update: {},
      create: dept,
    });
  }

  const assets = [
    { assetTag: 'AST-2024-0001', name: 'Dell OptiPlex 7090', category: 'computer', subCategory: 'desktop', brand: 'Dell', model: 'OptiPlex 7090', serialNumber: 'DELL-SN-001', location: 'IT Department', status: 'active', condition: 'excellent' },
    { assetTag: 'AST-2024-0002', name: 'HP LaserJet Pro M404n', category: 'printer', subCategory: 'laser', brand: 'HP', model: 'LaserJet Pro M404n', serialNumber: 'HP-SN-001', location: 'Operations', status: 'active', condition: 'good' },
    { assetTag: 'AST-2024-0003', name: 'Cisco Switch 2960', category: 'network', subCategory: 'switch', brand: 'Cisco', model: 'Catalyst 2960', serialNumber: 'CISCO-SN-001', location: 'Server Room', status: 'active', condition: 'excellent' },
  ];

  for (const asset of assets) {
    await prisma.asset.upsert({
      where: { assetTag: asset.assetTag },
      update: {},
      create: asset,
    });
  }

  // Create software without upsert (using createMany with skipDuplicates)
  const softwareList = [
    { name: 'Microsoft Office 365', vendor: 'Microsoft', version: '365', category: 'productivity' },
    { name: 'Windows 11 Pro', vendor: 'Microsoft', version: '11 Pro', category: 'operating_system' },
  ];

  for (const sw of softwareList) {
    const existing = await prisma.software.findFirst({ where: { name: sw.name } });
    if (!existing) {
      await prisma.software.create({ data: sw });
    }
  }

  // Create announcement
  const existingAnn = await prisma.announcement.findFirst({ where: { title: 'Welcome to IT Portal' } });
  if (!existingAnn) {
    await prisma.announcement.create({
      data: { title: 'Welcome to IT Portal', content: 'Welcome to the Artemis Laundry IT Management Portal.', category: 'general', priority: 'normal', isActive: true, authorName: 'IT Department' },
    });
  }

  // Create settings
  const settings = [
    { key: 'company_name', value: 'Artemis Laundry' },
    { key: 'company_address', value: 'Doha, Qatar' },
    { key: 'ticket_prefix', value: 'TKT' },
    { key: 'asset_prefix', value: 'AST' },
    { key: 'visitor_prefix', value: 'VIS' },
    { key: 'sla_low_hours', value: '72' },
    { key: 'sla_medium_hours', value: '48' },
    { key: 'sla_high_hours', value: '24' },
    { key: 'sla_critical_hours', value: '4' },
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }

  console.log('✅ Database seeded!');
  console.log('Login: admin/Admin@123, simon/Simon@123, demo/Demo@123, manager/Manager@123');
}

main().catch(console.error).finally(() => prisma.$disconnect());
EOF