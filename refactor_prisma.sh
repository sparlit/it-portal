#!/bin/bash
sed -i 's/prisma\.laundryTicket/prisma.lND_Ticket/g' src/app/api/laundry/tickets/*.ts
sed -i 's/prisma\.laundryTicket/prisma.lND_Ticket/g' src/app/api/laundry/tickets/[id]/*.ts
sed -i 's/prisma\.machineMetric/prisma.pROD_MachineMetric/g' src/services/intelligence/OEEEngine.ts
