"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Server, Activity, Database, Globe, Zap, RefreshCw } from 'lucide-react'

export function InfrastructureMonitor() {
  const servers = [
    { id: 1, name: 'Doha-ERP-Srv', ip: '10.0.1.5', status: 'online', load: '12%' },
    { id: 2, name: 'Laundry-POS-Gateway', ip: '10.0.1.12', status: 'online', load: '8%' },
    { id: 3, name: 'Database-Primary', ip: '10.0.2.2', status: 'online', load: '24%' },
    { id: 4, name: 'Backup-Node-01', ip: '10.0.3.10', status: 'warning', load: '88%' }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Infrastructure Monitoring</h2>
          <p className="text-slate-500">Real-time status of critical systems and network nodes.</p>
        </div>
        <Button variant="outline" size="sm" className="font-bold border-slate-300">
          <RefreshCw className="mr-2 h-4 w-4" /> Refresh Status
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-l-4 border-l-green-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-slate-600">Uptime</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">99.98%</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-slate-600">Avg Latency</CardTitle>
            <Globe className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">12ms</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-slate-600">Load</CardTitle>
            <Zap className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">18.4%</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-bold text-slate-900">
            <Server className="h-5 w-5 text-blue-600" /> Active Nodes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {servers.map((server) => (
              <div key={server.id} className="flex items-center justify-between p-4 border rounded-lg bg-white hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${server.status === 'online' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                    <Database className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{server.name}</p>
                    <p className="text-xs text-slate-500 font-mono font-bold">{server.ip}</p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Load</p>
                    <p className="font-mono text-sm font-bold">{server.load}</p>
                  </div>
                  <Badge variant={server.status === 'online' ? 'success' : 'warning'} className="font-bold uppercase tracking-widest text-[10px]">
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
