"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Truck, MapPin, Navigation2, Activity, Loader2 } from 'lucide-react'

export function FleetMap() {
  const [vehicles, setVehicles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/transport/vehicles')
      .then(res => res.json())
      .then(data => {
          if (Array.isArray(data)) setVehicles(data)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-2">
        <CardHeader className="bg-slate-900 text-white">
          <CardTitle className="flex items-center gap-2">
             <Navigation2 className="h-5 w-5 text-emerald-400" />
             Live Fleet Monitoring (OSM Integration)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
           {loading ? (
               <div className="h-[500px] flex items-center justify-center bg-slate-950">
                   <Loader2 className="h-12 w-12 animate-spin text-emerald-500" />
               </div>
           ) : (
            <div className="h-[500px] bg-slate-100 flex items-center justify-center relative">
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                <div className="text-center space-y-2 z-10">
                    <div className="flex justify-center">
                        <MapPin className="h-12 w-12 text-red-500 animate-bounce" />
                    </div>
                    <p className="font-bold text-slate-500 uppercase tracking-widest text-sm italic">Leaflet.js / OSM Render Engine</p>
                    <Badge variant="outline" className="bg-white">{vehicles.length} Vehicles in Database</Badge>
                </div>

                {vehicles.map((v, i) => (
                    <div key={v.id}
                         className="absolute p-2 bg-white rounded shadow-lg border border-emerald-500 flex items-center gap-2"
                         style={{ top: `${20 + (i * 15)}%`, left: `${15 + (i * 20)}%` }}>
                        <Truck className={`h-4 w-4 ${v.status === 'available' ? 'text-emerald-600' : 'text-blue-600'}`} />
                        <span className="text-[10px] font-black italic">{v.plateNumber} ({v.status.toUpperCase()})</span>
                    </div>
                ))}
            </div>
           )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <Card>
            <CardHeader>
               <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-600" />
                  Route Optimization Metrics
               </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="flex justify-between items-center text-sm border-b pb-2">
                  <span className="text-slate-500 font-medium">Active Fleet Utilization</span>
                  <span className="font-bold">{vehicles.filter(v => v.status === 'on_trip').length} / {vehicles.length}</span>
               </div>
               <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-medium">Optimization Engine</span>
                  <Badge variant="secondary">FOSS-OR-Tools</Badge>
               </div>
            </CardContent>
         </Card>
      </div>
    </div>
  )
}
