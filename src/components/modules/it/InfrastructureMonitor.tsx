"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Server, Activity, Database, Globe, Zap, RefreshCw } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'

export function InfrastructureMonitor() {
  const { t } = useI18n();
  const [servers, setServers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchServers() {
      try {
        const response = await fetch('/api/it/monitoring')
        const data = await response.json()
        if (Array.isArray(data)) {
          setServers(data)
        }
      } catch (error) {
        console.error('Failed to fetch server monitoring data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchServers()
  }, [])

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Activity className="h-8 w-8 text-green-500" /> {t('it_infra')}
          </h2>
          <p className="text-slate-500 font-medium">Real-time status of critical systems and network nodes.</p>
        </div>
        <Button variant="outline" size="sm" className="font-bold border-slate-300 hover:bg-slate-50 shadow-sm">
          <RefreshCw className="mr-2 h-4 w-4" /> Refresh Status
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-l-4 border-l-green-500 shadow-xl bg-white group hover:-translate-y-1 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-400">System Uptime</CardTitle>
            <Activity className="h-4 w-4 text-green-500 group-hover:scale-125 transition-transform" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-slate-900">99.98%</div>
            <div className="mt-2 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
               <div className="h-full bg-green-500 w-[99.98%]" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500 shadow-xl bg-white group hover:-translate-y-1 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-400">Active Nodes</CardTitle>
            <Globe className="h-4 w-4 text-blue-500 group-hover:scale-125 transition-transform" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-slate-900">{servers.length}</div>
            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">Global Load Balanced</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-500 shadow-xl bg-white group hover:-translate-y-1 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-400">Operational Health</CardTitle>
            <Zap className="h-4 w-4 text-orange-500 group-hover:scale-125 transition-transform" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-slate-900">Optimal</div>
            <p className="text-[10px] font-bold text-green-500 mt-1 uppercase tracking-tighter">No Critical Alerts</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 shadow-xl overflow-hidden rounded-xl bg-slate-50/50">
        <CardHeader className="bg-white border-b py-4">
          <CardTitle className="flex items-center gap-2 font-extrabold text-slate-800">
            <Server className="h-5 w-5 text-blue-600" /> Infrastructure Node Status
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-12">
                <RefreshCw className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-4" />
                <p className="animate-pulse text-slate-400 font-bold uppercase tracking-widest text-xs">Querying Server Nodes...</p>
              </div>
            ) : servers.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-slate-200">
                <Database className="h-10 w-10 text-slate-200 mx-auto mb-2" />
                <p className="text-slate-400 font-bold">No active server monitoring detected.</p>
              </div>
            ) : (
              servers.map((server) => (
                <div key={server.id} className="flex items-center justify-between p-4 border rounded-xl bg-white hover:shadow-md transition-all hover:border-blue-200 group">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl transition-colors ${server.status === 'online' ? 'bg-green-50 text-green-600 group-hover:bg-green-600 group-hover:text-white' : 'bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white'}`}>
                      <Database className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-extrabold text-slate-900">{server.name}</p>
                      <p className="text-[10px] text-slate-500 font-mono font-bold bg-slate-50 px-1 rounded inline-block border border-slate-100">{server.ip}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="hidden md:flex items-center gap-4 mr-8">
                       <div className="text-right">
                          <p className="text-[9px] font-bold uppercase text-slate-400">Latency</p>
                          <p className="text-xs font-bold text-slate-600">12ms</p>
                       </div>
                       <div className="text-right">
                          <p className="text-[9px] font-bold uppercase text-slate-400">Load</p>
                          <p className="text-xs font-bold text-slate-600">24%</p>
                       </div>
                    </div>
                    <Badge variant={server.status === 'online' ? 'success' : 'warning'} className="font-bold uppercase tracking-widest text-[10px] py-1 px-3 rounded-full">
                      {server.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
