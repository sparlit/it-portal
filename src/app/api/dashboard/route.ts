import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const [totalAssets, activeAssets, totalTickets, openTickets, inProgressTickets, resolvedTickets, todayVisitors, activeVisitors, totalUsers, totalLicenses, expiringLicenses] = await Promise.all([
      prisma.asset.count(),
      prisma.asset.count({ where: { status: 'active' } }),
      prisma.ticket.count(),
      prisma.ticket.count({ where: { status: 'open' } }),
      prisma.ticket.count({ where: { status: 'in_progress' } }),
      prisma.ticket.count({ where: { status: 'resolved' } }),
      prisma.visitor.count({ where: { checkIn: { gte: today } } }),
      prisma.visitor.count({ where: { checkOut: null } }),
      prisma.user.count(),
      prisma.softwareLicense.count(),
      prisma.softwareLicense.count({ where: { expiryDate: { lte: thirtyDaysFromNow, gt: today } } }),
    ]);

    const recentTickets = await prisma.ticket.findMany({ take: 5, orderBy: { createdAt: 'desc' }, select: { id: true, ticketNumber: true, title: true, status: true, priority: true, createdAt: true, requesterName: true } });
    const recentActivities = await prisma.activity.findMany({ take: 10, orderBy: { createdAt: 'desc' }, include: { user: { select: { name: true } } } });
    const upcomingEvents = await prisma.event.findMany({ where: { startDate: { gte: today }, status: 'scheduled' }, take: 5, orderBy: { startDate: 'asc' } });

    return NextResponse.json({
      stats: { assets: { total: totalAssets, active: activeAssets }, tickets: { total: totalTickets, open: openTickets, inProgress: inProgressTickets, resolved: resolvedTickets }, visitors: { today: todayVisitors, active: activeVisitors }, users: { total: totalUsers }, licenses: { total: totalLicenses, expiring: expiringLicenses } },
      recentTickets,
      recentActivities,
      upcomingEvents
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}