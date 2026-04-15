"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Activity, Thermometer, ShieldCheck, Loader2 } from 'lucide-react'

export function BatchMonitor() {
  const [batches, setBatches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/production/batches')
      .then(res => res.json())
      .then(data => {
          if (Array.isArray(data)) setBatches(data)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-slate-300" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {batches.length === 0 && <div className="md:col-span-2 text-center py-20 text-slate-400 border-2 border-dashed rounded-xl font-medium uppercase tracking-widest">No active production batches.</div>}
            {batches.map(batch => (
                <Card key={batch.id} className="border-2">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg font-bold">{batch.productName}</CardTitle>
                    <Badge variant="outline" className="font-mono">{batch.batchNumber}</Badge>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-sm font-medium text-slate-500 uppercase">Current Status</p>
                            <p className="text-2xl font-black text-slate-900 capitalize">{batch.status.replace('_', ' ')}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-bold text-slate-400">TARGET QTY</p>
                            <p className="text-xl font-black text-blue-600">{batch.quantity} {batch.unit}</p>
                        </div>
                    </div>

                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                        <div className="bg-blue-600 h-full transition-all duration-1000" style={{ width: '45%' }}></div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                        <div className="flex items-center gap-2">
                            <Thermometer className="h-4 w-4 text-orange-500" />
                            <span className="text-xs font-bold">Standard</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4 text-emerald-500" />
                            <span className="text-xs font-bold">Active</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-blue-500" />
                            <span className="text-xs font-bold text-blue-700">{batch.qcChecks?.length || 0} QC Points</span>
                        </div>
                    </div>
                </CardContent>
                </Card>
            ))}
        </div>
      )}
    </div>
  )
}
