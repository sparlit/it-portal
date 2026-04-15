import { prisma } from '../src/lib/db';
import { InfrastructureService } from '../src/services/InfrastructureService';

async function verifyMonitoring() {
  console.log('--- Verifying Infrastructure Monitoring Logic ---');

  const tenant = await prisma.tenant.findFirst();
  if (!tenant) {
    console.log('Creating test tenant...');
    const newTenant = await prisma.tenant.create({
      data: { name: 'IT Test Tenant', slug: 'it-test' }
    });

    await prisma.serverMonitor.create({
      data: {
        tenantId: newTenant.id,
        name: 'Primary Gateway',
        ip: '10.0.0.1',
        status: 'online'
      }
    });
  }

  const activeTenant = await prisma.tenant.findFirst();
  const tenantId = activeTenant!.id;

  console.log('Performing health checks via Service...');
  const results = await InfrastructureService.performHealthChecks(tenantId);

  console.log(`Updated ${results.length} servers.`);
  results.forEach(s => console.log(`- ${s.name}: ${s.status}`));

  if (results.length > 0) {
    console.log('SUCCESS: Infrastructure Monitoring Service is functional.');
  } else {
    console.log('WARNING: No servers found to monitor.');
  }
}

verifyMonitoring().catch(console.error);
