import { NextRequest, NextResponse } from 'next/server';
import { withTenant } from '@/lib/api-middleware';
import { CustomerService } from '@/services/CustomerService';
import { z } from 'zod';

const CustomerSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email().optional().or(z.literal('')),
  address: z.string().optional(),
  notes: z.string().optional()
});

export async function GET(request: NextRequest) {
  return withTenant(request, async (tenantId: string) => {
    const customers = await CustomerService.listCustomers(tenantId);
    return NextResponse.json(customers);
  });
}

export async function POST(request: NextRequest) {
  return withTenant(request, async (tenantId: string) => {
    try {
      const body = await request.json();
      const result = CustomerSchema.safeParse(body);

      if (!result.success) {
        return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
      }

      const customer = await CustomerService.createCustomer(tenantId, result.data);
      return NextResponse.json(customer, { status: 201 });
    } catch (error) {
      return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 });
    }
  });
}
