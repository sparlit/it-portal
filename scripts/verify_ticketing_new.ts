import { prisma } from '../src/lib/db';

async function verifyTicketing() {
  console.log('--- START TICKETING VERIFICATION ---');
  const tenant = await prisma.tenant.findFirst();
  const tenantId = tenant!.id;

  const ticketId = `TKT-IT-VERIFY-${Date.now()}`;
  console.log(`Creating IT Ticket ${ticketId}...`);

  const ticket = await prisma.iTTicket.create({
    data: {
      tenantId,
      ticketId,
      title: 'Verification Ticket',
      requester: 'Verification Script',
      status: 'open'
    }
  });

  if (ticket) {
    console.log('SUCCESS: Ticket created.');
  }
}

verifyTicketing().catch(console.error);
