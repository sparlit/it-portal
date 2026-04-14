"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, Clock, ShieldCheck, Users, Activity } from 'lucide-react'

export function GlobalMetrics() {
  const [metrics, setMetrics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const response = await fetch('/api/core/metrics')
        const data = await response.json()
        setMetrics(data)
      } catch (error) {
        console.error('Failed to fetch metrics:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchMetrics()
  }, [])

  if (loading) return <div className="p-8 text-center font-bold animate-pulse text-slate-500">Initializing Terminal Analytics...</div>

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-slate-900 text-white border-none shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-wider opacity-70">Total Orders</CardTitle>
            <BarChart3 className="h-4 w-4 opacity-50" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold">{metrics?.summary.totalOrders}</div>
            <p className="text-[10px] font-bold text-green-400 mt-1 uppercase tracking-tighter">+12% vs last week</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500">Laundry Takt Time</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-slate-900">{metrics?.kpis.laundryTaktTime}</div>
            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">Target: 4.0h</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500">SLA Compliance</CardTitle>
            <ShieldCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-slate-900">{metrics?.kpis.slaCompliance}</div>
            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">Service Level Agreement</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500">Active Users</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-slate-900">{metrics?.summary.activeUsers}</div>
            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">Concurrent sessions</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 overflow-hidden">
        <CardHeader className="bg-slate-50 border-b">
          <CardTitle className="flex items-center gap-2 font-bold text-slate-800">
            <Activity className="h-5 w-5 text-blue-600" /> Operational Health Index
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-8">
            <div className="flex items-center justify-between gap-12">
              <div className="flex-1 space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-500">
                  <span>Infrastructure Availability</span>
                  <span>99.9%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-[99.9%]" />
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-500">
                  <span>Garment Quality Rate</span>
                  <span>98.2%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-[98.2%]" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
