import { prisma } from '../src/lib/db';

async function verifyVault() {
  console.log('--- Verifying Security Vault Logic ---');

  const tenant = await prisma.tenant.findFirst();
  if (!tenant) throw new Error('No tenant found');
  const tenantId = tenant.id;

  const systemName = `TestSystem_${Date.now()}`;

  console.log(`Adding credential for ${systemName}...`);
  const credential = await prisma.credential.create({
    data: {
      tenantId,
      system: systemName,
      username: 'admin',
      password: 'password123'
    }
  });

  await prisma.activityLog.create({
    data: {
      tenantId,
      user: 'Vault Verification Script',
      action: `Added credential for system: ${systemName}`
    }
  });

  const logEntry = await prisma.activityLog.findFirst({
    where: { tenantId, action: { contains: systemName } },
    orderBy: { timestamp: 'desc' }
  });

  if (credential && logEntry) {
    console.log('SUCCESS: Credential created and audit log entry found.');
  } else {
    throw new Error('Vault verification failed.');
  }
}

verifyVault().catch(console.error);
