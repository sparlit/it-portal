import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withRBAC } from '@/lib/api-middleware';
import { AuditService } from '@/services/AuditService';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

const UserSchema = z.object({
  username: z.string().min(3).toLowerCase(),
  password: z.string().min(6),
  name: z.string().min(1),
  email: z.string().email().optional().or(z.literal('')),
  role: z.enum(['SUPERADMIN', 'ADMIN', 'MANAGER', 'OPERATOR', 'CUSTOMER']).default('OPERATOR'),
});

export async function GET(request: NextRequest) {
  return withRBAC(request, 'read', 'User', async (tenantId) => {
    const users = await prisma.user.findMany({
      where: { tenantId },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true
      }
    });
    return NextResponse.json(users);
  });
}

export async function POST(request: NextRequest) {
  return withRBAC(request, 'manage', 'User', async (tenantId, user) => {
    try {
      const body = await request.json();
      const validatedData = UserSchema.parse(body);

      const hashedPassword = await bcrypt.hash(validatedData.password, 10);

      const newUser = await prisma.user.create({
        data: {
          tenantId,
          username: validatedData.username,
          password: hashedPassword,
          name: validatedData.name,
          email: validatedData.email || null,
          role: validatedData.role
        }
      });

      await AuditService.logActivity(tenantId, user.id, user.username, `Created User: ${newUser.username}`);

      const { password: _, ...userWithoutPassword } = newUser;
      return NextResponse.json(userWithoutPassword, { status: 201 });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json({ error: error.issues }, { status: 400 });
      }
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  });
}
