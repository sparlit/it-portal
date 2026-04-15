import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withRBAC } from '@/lib/api-middleware';
import { AuditService } from '@/services/AuditService';
import { z } from 'zod';

const CustomerSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email().optional().or(z.literal('')),
  address: z.string().optional(),
  notes: z.string().optional(),
});

export async function GET(request: NextRequest) {
  return withRBAC(request, 'read', 'LaundryCustomer', async (tenantId) => {
    const customers = await prisma.laundryCustomer.findMany({
      where: { tenantId },
      orderBy: { name: 'asc' }
    });
    return NextResponse.json(customers);
  });
}

export async function POST(request: NextRequest) {
  return withRBAC(request, 'manage', 'LaundryCustomer', async (tenantId, user) => {
    try {
      const body = await request.json();
      const validatedData = CustomerSchema.parse(body);

      const customer = await prisma.laundryCustomer.create({
        data: {
          tenantId,
          ...validatedData,
          email: validatedData.email || null
        }
      });

      await AuditService.logActivity(tenantId, user.id, user.username, `Created Laundry Customer: ${customer.name}`);

      return NextResponse.json(customer, { status: 201 });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json({ error: error.issues }, { status: 400 });
      }
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  });
}
