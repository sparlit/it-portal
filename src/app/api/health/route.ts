import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  const start = Date.now();

  try {
    // 1. Database Connectivity Check
    await prisma.$queryRaw`SELECT 1`;
    const dbStatus = 'healthy';

    // 2. Latency calculation
    const latency = Date.now() - start;

    // 3. System Metrics (Industrial Standard)
    const metrics = {
      status: 'operational',
      latency: `${latency}ms`,
      dbStatus,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: '2.0.0-advanced'
    };

    // Log metric to database if latency exceeds threshold (KPI Audit)
    if (latency > 200) {
       // Optional: Log high latency events for PM Mode audit
    }

    return NextResponse.json(metrics, {
      status: 200,
      headers: {
        'X-Response-Time': `${latency}ms`
      }
    });
  } catch (e: any) {
    return NextResponse.json({
      status: 'degraded',
      error: e.message,
      timestamp: new Date().toISOString()
    }, { status: 503 });
  }
}
