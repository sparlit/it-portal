"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Activity, Thermometer, ShieldCheck } from 'lucide-react'

export function BatchMonitor() {
  const activeBatches = [
    { id: '1', product: 'Premium White Linens', batch: 'B-2024-05-21-01', stage: 'Washing', completion: 65, status: 'Optimal' },
    { id: '2', product: 'Industrial Uniforms', batch: 'B-2024-05-21-02', stage: 'Drying', completion: 30, status: 'Warning' },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {activeBatches.map(batch => (
            <Card key={batch.id} className="border-2">
               <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-bold">{batch.product}</CardTitle>
                  <Badge variant="outline" className="font-mono">{batch.batch}</Badge>
               </CardHeader>
               <CardContent className="space-y-6">
                  <div className="flex justify-between items-end">
                     <div>
                        <p className="text-sm font-medium text-slate-500 uppercase">Current Stage</p>
                        <p className="text-2xl font-black text-slate-900">{batch.stage}</p>
                     </div>
                     <div className="text-right">
                        <p className="text-xs font-bold text-slate-400">THROUGHPUT</p>
                        <p className="text-xl font-black text-blue-600">{batch.completion}%</p>
                     </div>
                  </div>

                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                     <div className="bg-blue-600 h-full transition-all duration-1000" style={{ width: `${batch.completion}%` }}></div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                     <div className="flex items-center gap-2">
                        <Thermometer className="h-4 w-4 text-orange-500" />
                        <span className="text-xs font-bold">60°C</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-emerald-500" />
                        <span className="text-xs font-bold">Stable</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-blue-500" />
                        <span className="text-xs font-bold text-blue-700">QC Pass</span>
                     </div>
                  </div>
               </CardContent>
            </Card>
         ))}
      </div>
    </div>
  )
}
