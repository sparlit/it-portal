import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const ticket = await prisma.ticket.findUnique({ where: { id }, include: { assignee: true, comments: true } });
  if (!ticket) return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
  return NextResponse.json(ticket);
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const body = await request.json();
  const ticket = await prisma.ticket.update({ where: { id }, data: body });
  return NextResponse.json(ticket);
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  await prisma.ticketComment.deleteMany({ where: { ticketId: id } });
  await prisma.ticket.delete({ where: { id } });
  return NextResponse.json({ success: true });
}