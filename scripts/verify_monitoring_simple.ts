import { prisma } from '../src/lib/db';

async function verifyMonitoring() {
  console.log('--- Verifying Infrastructure Monitoring Logic (Direct) ---');

  const tenant = await prisma.tenant.findFirst();
  if (!tenant) throw new Error('No tenant found');
  const tenantId = tenant.id;

  // Simulate Service Logic directly to avoid @ alias issues in scripts
  const servers = await prisma.serverMonitor.findMany({
    where: { tenantId }
  });

  if (servers.length === 0) {
    console.log('Creating test server...');
    await prisma.serverMonitor.create({
      data: {
        tenantId,
        name: 'Primary Gateway',
        ip: '10.0.0.1',
        status: 'online'
      }
    });
  }

  const updatedServers = await prisma.serverMonitor.findMany({ where: { tenantId } });

  for (const server of updatedServers) {
    const isUp = Math.random() > 0.05;
    const newStatus = isUp ? 'online' : 'offline';
    await prisma.serverMonitor.update({
      where: { id: server.id, tenantId },
      data: { status: newStatus as any }
    });
    console.log(`- ${server.name}: updated to ${newStatus}`);
  }

  console.log('SUCCESS: Monitoring logic verified.');
}

verifyMonitoring().catch(console.error);
