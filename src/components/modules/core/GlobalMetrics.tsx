"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, Clock, ShieldCheck, Users, Activity } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'

export function GlobalMetrics() {
  const { t } = useI18n()
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

  if (loading) return <div className="p-8 text-center font-black animate-pulse text-slate-400 tracking-widest uppercase text-xs">{t('loading')}</div>

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-slate-900 text-white border-none shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-[0.2em] opacity-70">{t('daily_throughput')}</CardTitle>
            <BarChart3 className="h-4 w-4 opacity-50" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{metrics?.summary.totalOrders}</div>
            <p className="text-[10px] font-bold text-green-400 mt-1 uppercase tracking-tighter">+12.4% vs L7D</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">{t('takt_time')}</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-900">{metrics?.kpis.laundryTaktTime}</div>
            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">Target: 4.0h</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">{t('sla_compliance')}</CardTitle>
            <ShieldCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-900">{metrics?.kpis.slaCompliance}</div>
            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">Gold Tier Service</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">{t('active_users')}</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-900">{metrics?.summary.activeUsers}</div>
            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">Concurrent Nodes</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50 border-b">
          <CardTitle className="flex items-center gap-2 font-black text-slate-800 uppercase tracking-widest text-sm">
            <Activity className="h-5 w-5 text-blue-600" /> {t('health_index')}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-8">
          <div className="space-y-10">
            <div className="space-y-3">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                <span>{t('infra_availability')}</span>
                <span className="text-green-600">99.98%</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div className="h-full bg-green-500 w-[99.98%] shadow-[0_0_10px_rgba(34,197,94,0.3)]" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                <span>{t('quality_rate')}</span>
                <span className="text-blue-600">98.2%</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div className="h-full bg-blue-500 w-[98.2%] shadow-[0_0_10px_rgba(59,130,246,0.3)]" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
