import net from 'net';

export interface NodeHealth {
  id: string;
  name: string;
  ip: string;
  status: 'online' | 'offline';
  latency?: number;
}

export class InfrastructureService {
  static async checkNodeHealth(ip: string, port: number = 80, timeout: number = 2000): Promise<'online' | 'offline'> {
    return new Promise((resolve) => {
      const socket = new net.Socket();
      let status: 'online' | 'offline' = 'offline';

      socket.setTimeout(timeout);

      socket.on('connect', () => {
        status = 'online';
        socket.destroy();
      });

      socket.on('timeout', () => {
        socket.destroy();
      });

      socket.on('error', () => {
        socket.destroy();
      });

      socket.on('close', () => {
        resolve(status);
      });

      socket.connect(port, ip);
    });
  }

  static async getDashboardMetrics(tenantId: string, nodes: { id: string, name: string, ip: string }[]) {
    const healthChecks = await Promise.all(
      nodes.map(async (node) => ({
        ...node,
        status: await this.checkNodeHealth(node.ip)
      }))
    );

    return healthChecks;
  }
}
