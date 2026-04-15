import { prisma } from '@/lib/db';
import net from 'net';

export class InfrastructureService {
  static async getServers(tenantId: string) {
    return prisma.serverMonitor.findMany({
      where: { tenantId },
      orderBy: { name: 'asc' }
    });
  }

  static async updateServerStatus(tenantId: string, serverId: string, status: 'online' | 'offline' | 'warning') {
    return prisma.serverMonitor.update({
      where: { id: serverId, tenantId },
      data: { status }
    });
  }

  /**
   * Real health check logic using TCP connection attempts
   */
  private static checkHealth(ip: string, port: number = 80): Promise<'online' | 'offline'> {
    return new Promise((resolve) => {
      const socket = new net.Socket();
      socket.setTimeout(2000); // 2 second timeout

      socket.on('connect', () => {
        socket.destroy();
        resolve('online');
      });

      socket.on('timeout', () => {
        socket.destroy();
        resolve('offline');
      });

      socket.on('error', () => {
        socket.destroy();
        resolve('offline');
      });

      // For local testing, if IP is 127.0.0.1 and port 3000, it should be online
      socket.connect(port, ip);
    });
  }

  static async performHealthChecks(tenantId: string) {
    const servers = await this.getServers(tenantId);
    const results = [];

    for (const server of servers) {
      // Use real health check. Default to port 80 or 3000 for local test servers
      const status = await this.checkHealth(server.ip, server.ip === '127.0.0.1' ? 3000 : 80);

      const updated = await this.updateServerStatus(tenantId, server.id, status);
      results.push(updated);
    }

    return results;
  }
}
