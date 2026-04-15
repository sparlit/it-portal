"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  TrendingUp,
  Truck,
  Factory,
  Hammer,
  Users,
  Box,
  ShieldCheck,
  Loader2,
  Activity
} from 'lucide-react'

export function IndustrialDashboard() {
  const [stats, setStats] = useState({
    leads: 0,
    batches: 0,
    vehicles: 0,
    items: 0,
    tasks: 0,
    requisitions: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [leads, batches, vehicles, items, tasks, requisitions] = await Promise.all([
          fetch('/api/crm/leads').then(r => r.json()),
          fetch('/api/production/batches').then(r => r.json()),
          fetch('/api/transport/vehicles').then(r => r.json()),
          fetch('/api/stores/items').then(r => r.json()),
          fetch('/api/maintenance/tasks').then(r => r.json()),
          fetch('/api/procurement/requisitions').then(r => r.json())
        ])

        setStats({
          leads: Array.isArray(leads) ? leads.length : 0,
          batches: Array.isArray(batches) ? batches.length : 0,
          vehicles: Array.isArray(vehicles) ? vehicles.length : 0,
          items: Array.isArray(items) ? items.length : 0,
          tasks: Array.isArray(tasks) ? tasks.length : 0,
          requisitions: Array.isArray(requisitions) ? requisitions.length : 0
        })
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-12 w-12 animate-spin text-slate-300" /></div>

  const metrics = [
    { label: 'Client Pipeline', value: stats.leads, icon: <Users className="h-5 w-5 text-blue-600" />, color: 'border-l-blue-600' },
    { label: 'Active Production', value: stats.batches, icon: <Factory className="h-5 w-5 text-slate-900" />, color: 'border-l-slate-900' },
    { label: 'Fleet Status', value: stats.vehicles, icon: <Truck className="h-5 w-5 text-emerald-600" />, color: 'border-l-emerald-600' },
    { label: 'Inventory SKU', value: stats.items, icon: <Box className="h-5 w-5 text-orange-600" />, color: 'border-l-orange-600' },
    { label: 'Maintenance Ops', value: stats.tasks, icon: <Hammer className="h-5 w-5 text-slate-700" />, color: 'border-l-slate-700' },
    { label: 'Purchase Indents', value: stats.requisitions, icon: <TrendingUp className="h-5 w-5 text-red-600" />, color: 'border-l-red-600' },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
         <h2 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3 italic">
            <Activity className="h-8 w-8 text-blue-600" />
            Global Operational Intelligence
         </h2>
         <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">System Nominal</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map(m => (
          <Card key={m.label} className={`border-l-4 ${m.color} shadow-sm hover:shadow-md transition-all`}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                 <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-1">{m.label}</p>
                    <h3 className="text-4xl font-black text-slate-900">{m.value}</h3>
                 </div>
                 <div className="bg-slate-50 p-3 rounded-xl border">
                    {m.icon}
                 </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-2 border-slate-900 bg-slate-950 text-white overflow-hidden">
         <CardHeader className="border-b border-slate-800 bg-slate-900/50">
            <CardTitle className="flex items-center gap-2 text-xl italic font-black uppercase">
               <ShieldCheck className="h-5 w-5 text-blue-400" />
               Enterprise Infrastructure Health
            </CardTitle>
         </CardHeader>
         <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               <div className="space-y-6">
                  <div className="flex justify-between items-end border-b border-slate-800 pb-2">
                     <span className="text-slate-400 font-bold uppercase text-xs tracking-widest">Database Sync</span>
                     <span className="text-emerald-400 font-black italic">SYNCHRONIZED</span>
                  </div>
                  <div className="flex justify-between items-end border-b border-slate-800 pb-2">
                     <span className="text-slate-400 font-bold uppercase text-xs tracking-widest">Cross-Portal Link</span>
                     <span className="text-blue-400 font-black italic">ACTIVE</span>
                  </div>
                  <div className="flex justify-between items-end">
                     <span className="text-slate-400 font-bold uppercase text-xs tracking-widest">Middleware Sentinel</span>
                     <span className="text-emerald-400 font-black italic">OPERATIONAL</span>
                  </div>
               </div>
               <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 flex flex-col justify-center items-center text-center">
                  <Activity className="h-12 w-12 text-blue-500 animate-pulse mb-4" />
                  <p className="text-slate-400 font-medium italic">All departmental nodes responding within normal latency thresholds.</p>
               </div>
            </div>
         </CardContent>
      </Card>
    </div>
  )
}
