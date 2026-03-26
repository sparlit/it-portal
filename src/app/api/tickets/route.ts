import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

function generateTicketNumber(): string {
  const date = new Date();
  return `TKT-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '50');
  const status = searchParams.get('status');

  const where: any = status ? { status } : {};
  const [tickets, total] = await Promise.all([
    prisma.ticket.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { createdAt: 'desc' }, include: { assignee: { select: { id: true, name: true } } } }),
    prisma.ticket.count({ where })
  ]);

  return NextResponse.json({ tickets, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const ticket = await prisma.ticket.create({
    data: { ticketNumber: generateTicketNumber(), title: body.title, description: body.description, category: body.category || 'other', priority: body.priority || 'medium', status: 'open', requesterName: body.requesterName, requesterEmail: body.requesterEmail, assigneeId: body.assigneeId }
  });
  return NextResponse.json(ticket, { status: 201 });
}