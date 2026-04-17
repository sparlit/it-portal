"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Truck, AlertCircle, Loader2, Plus, Calendar } from 'lucide-react'

export function VehicleServiceLogs() {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/transport/vehicles')
      .then(res => res.json())
      .then(data => {
          if (Array.isArray(data)) setLogs(data)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Vehicle Maintenance</h2>
        <Button className="bg-slate-900 text-white gap-2">
           <Plus className="h-4 w-4" /> Schedule Service
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-slate-300" /></div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {logs.length === 0 && <div className="text-center py-12 text-slate-400 font-medium border-2 border-dashed rounded-xl uppercase tracking-widest text-xs">No service records found.</div>}
          {logs.map(v => (
            <Card key={v.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                     <div className={`p-3 rounded-lg bg-slate-100 text-slate-600`}>
                        <Truck className="h-6 w-6" />
                     </div>
                     <div>
                        <h4 className="font-bold text-lg">{v.plateNumber}</h4>
                        <p className="text-sm text-slate-500 font-medium">{v.make} {v.model} ({v.year})</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-6">
                     <div className="text-right hidden md:block">
                        <p className="text-[10px] font-black uppercase text-slate-400">Next Service</p>
                        <p className="text-sm font-bold text-slate-700 flex items-center gap-1">
                           <Calendar className="h-3 w-3" />
                           {v.lastServiceDate ? new Date(v.lastServiceDate).toLocaleDateString() : 'TBD'}
                        </p>
                     </div>
                     <Badge className={v.status === 'available' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}>
                        {v.status.toUpperCase()}
                     </Badge>
                     <Button variant="ghost" size="sm" className="font-bold text-blue-600">Full History</Button>
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
