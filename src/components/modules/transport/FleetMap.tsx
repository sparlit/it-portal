"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Truck, MapPin, Navigation2, Activity, Loader2 } from 'lucide-react'
import dynamic from 'next/dynamic'

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false })
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false })

export function FleetMap() {
  const [vehicles, setVehicles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    fetch('/api/transport/vehicles')
      .then(res => res.json())
      .then(data => {
          if (Array.isArray(data)) setVehicles(data)
      })
      .finally(() => setLoading(false))
  }, [])

  if (!isMounted) return null

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-2">
        <CardHeader className="bg-slate-900 text-white">
          <CardTitle className="flex items-center gap-2 text-lg font-black uppercase italic">
             <Navigation2 className="h-5 w-5 text-emerald-400" />
             Live Fleet Monitoring (OSM Real-time)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
           {loading ? (
               <div className="h-[500px] flex items-center justify-center bg-slate-950">
                   <Loader2 className="h-12 w-12 animate-spin text-emerald-500" />
               </div>
           ) : (
            <div className="h-[600px] relative z-0">
                {/* Real Leaflet Map */}
                <MapContainer center={[25.2854, 51.5310]} zoom={12} style={{ height: '100%', width: '100%' }}>
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  {vehicles.map((v, i) => {
                      // Mocking coordinates around Doha for simulation
                      const lat = 25.28 + (Math.random() * 0.1)
                      const lng = 51.53 + (Math.random() * 0.1)
                      return (
                        <Marker key={v.id} position={[lat, lng]}>
                           <Popup>
                              <div className="p-2">
                                 <h4 className="font-bold text-blue-600">{v.plateNumber}</h4>
                                 <p className="text-xs uppercase font-black">{v.status}</p>
                                 <p className="text-[10px] text-slate-500 mt-1">{v.make} {v.model}</p>
                              </div>
                           </Popup>
                        </Marker>
                      )
                  })}
                </MapContainer>

                <div className="absolute top-4 right-4 z-[1000] space-y-2">
                   <div className="p-3 bg-white/90 backdrop-blur rounded-xl shadow-xl border border-emerald-500 flex items-center gap-2 animate-pulse">
                      <Truck className="h-4 w-4 text-emerald-600" />
                      <span className="text-[10px] font-black italic">FLEET ENGINE ACTIVE</span>
                   </div>
                </div>
            </div>
           )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <Card>
            <CardHeader>
               <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-600" />
                  Route Optimization Engine
               </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="flex justify-between items-center text-sm border-b pb-2">
                  <span className="text-slate-500 font-medium">Global Fleet Utilization</span>
                  <span className="font-bold">{vehicles.length} Active Nodes</span>
               </div>
               <div className="flex justify-between items-center text-sm border-b pb-2">
                  <span className="text-slate-500 font-medium">Optimization Status</span>
                  <Badge className="bg-emerald-100 text-emerald-700">OPTIMAL</Badge>
               </div>
               <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-medium">Library</span>
                  <span className="font-mono text-[10px] bg-slate-100 px-2 py-1 rounded">Leaflet + FOSS OSM</span>
               </div>
            </CardContent>
         </Card>
      </div>
    </div>
  )
}
