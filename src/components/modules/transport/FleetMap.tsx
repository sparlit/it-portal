"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Truck, Navigation2, Activity } from 'lucide-react'

export function FleetMap() {
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-2">
        <CardHeader className="bg-slate-900 text-white">
          <CardTitle className="flex items-center gap-2">
             <Navigation2 className="h-5 w-5 text-emerald-400" />
             Live Fleet Monitoring (OpenStreetMap Integration)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
           <div className="h-[500px] bg-slate-100 flex items-center justify-center relative">
              <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
              <div className="text-center space-y-2 z-10">
                 <div className="flex justify-center">
                    <MapPin className="h-12 w-12 text-red-500 animate-bounce" />
                 </div>
                 <p className="font-bold text-slate-500 uppercase tracking-widest text-sm italic">Simulating Leaflet.js / OSM Render Engine</p>
                 <Badge variant="outline" className="bg-white">8 Vehicles Online</Badge>
              </div>

              {/* Mock Vehicle Indicators */}
              <div className="absolute top-1/4 left-1/3 p-2 bg-white rounded shadow-lg border border-emerald-500 flex items-center gap-2 animate-pulse">
                 <Truck className="h-4 w-4 text-emerald-600" />
                 <span className="text-[10px] font-black italic">VAN-001 (ON ROUTE)</span>
              </div>
              <div className="absolute bottom-1/3 right-1/4 p-2 bg-white rounded shadow-lg border border-blue-500 flex items-center gap-2">
                 <Truck className="h-4 w-4 text-blue-600" />
                 <span className="text-[10px] font-black italic">TRUCK-05 (STATIONARY)</span>
              </div>
           </div>
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
                  <span className="text-slate-500 font-medium">Avg Fuel Efficiency</span>
                  <span className="font-bold">12.4 km/L</span>
               </div>
               <div className="flex justify-between items-center text-sm border-b pb-2">
                  <span className="text-slate-500 font-medium">Idle Time Reduction</span>
                  <span className="font-bold text-emerald-600">+15% YoY</span>
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
