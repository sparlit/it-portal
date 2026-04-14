"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Server,
  Activity,
  Database,
  ShieldCheck,
  Zap,
  RefreshCw,
  Globe
} from 'lucide-react'

export function InfrastructureMonitor() {
  const [servers, setServers] = useState<any[]>([
    { id: 1, name: 'Doha-ERP-Srv', ip: '10.0.1.5', status: 'online', uptime: '142 days', load: '12%' },
    { id: 2, name: 'Laundry-POS-Gateway', ip: '10.0.1.12', status: 'online', uptime: '45 days', load: '8%' },
    { id: 3, name: 'Database-Primary', ip: '10.0.2.2', status: 'online', uptime: '210 days', load: '24%' },
    { id: 4, name: 'Backup-Node-01', ip: '10.0.3.10', status: 'warning', uptime: '12 days', load: '88%' }
  ])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Infrastructure Monitoring</h2>
          <p className="text-slate-500">Real-time status of critical systems and network nodes.</p>
        </div>
        <Button variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" /> Refresh Status
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.98%</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Global Latency</CardTitle>
            <Globe className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12ms</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
            <Zap className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">64.2%</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Backup Health</CardTitle>
            <ShieldCheck className="h-4 w-4 text-slate-800" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Secure</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" /> Active Server Nodes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {servers.map((server) => (
              <div key={server.id} className="flex items-center justify-between p-4 border rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${server.status === 'online' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                    <Database className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{server.name}</p>
                    <p className="text-xs text-slate-500 font-mono">{server.ip}</p>
                  </div>
                </div>

                <div className="flex items-center gap-8 text-sm">
                  <div className="text-center">
                    <p className="text-xs text-slate-400 uppercase font-bold tracking-tighter">Load</p>
                    <p className="font-mono">{server.load}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-400 uppercase font-bold tracking-tighter">Uptime</p>
                    <p className="font-mono">{server.uptime}</p>
                  </div>
                  <Badge variant={server.status === 'online' ? 'success' : 'warning'}>
                    {server.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
