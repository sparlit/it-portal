"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Truck,
  MapPin,
  Clock,
  CheckCircle2,
  Phone,
  Navigation,
  Loader2,
  Menu,
  Bell,
  Package
} from 'lucide-react'
import Link from 'next/link'

export default function DriverMobilePortal() {
  const [trips, setTrips] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/trans/trips')
      .then(res => res.json())
      .then(data => {
          if (Array.isArray(data)) setTrips(data)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Mobile Top Bar */}
      <header className="bg-slate-900 border-b border-white/5 px-4 h-16 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
           <div className="bg-emerald-600 p-1.5 rounded-lg">
              <Truck className="h-5 w-5" />
           </div>
           <span className="font-black tracking-tighter uppercase text-sm">Fleet Mobile</span>
        </div>
        <div className="flex gap-4">
           <Bell className="h-5 w-5 text-slate-400" />
           <Menu className="h-5 w-5 text-slate-400" />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-4 space-y-6">
         <div className="flex justify-between items-end">
            <div>
               <h2 className="text-2xl font-black italic tracking-tight">Active Shifts</h2>
               <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Driver Node: DOH-77-ACTIVE</p>
            </div>
            <Badge className="bg-emerald-500 text-slate-950 font-black">ONLINE</Badge>
         </div>

         {loading ? (
             <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-emerald-500" /></div>
         ) : (
            <div className="space-y-4">
               {trips.map(trip => (
                  <Card key={trip.id} className="bg-slate-900 border-white/10 overflow-hidden shadow-2xl">
                     <CardContent className="p-0">
                        <div className="p-5 border-b border-white/5 flex justify-between items-start">
                           <div>
                              <p className="text-[10px] font-black uppercase text-emerald-500 mb-1">Assigned Route</p>
                              <h3 className="font-black text-lg leading-none">{trip.startLocation} ➔ {trip.endLocation}</h3>
                           </div>
                           <Badge variant="outline" className="text-white/40 border-white/10 uppercase text-[9px]">{trip.status}</Badge>
                        </div>
                        <div className="p-5 space-y-4">
                           <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center">
                                 <Package className="h-5 w-5 text-slate-400" />
                              </div>
                              <div>
                                 <p className="text-[10px] font-black uppercase text-slate-500">Payload</p>
                                 <p className="text-sm font-bold">Standard Operations</p>
                              </div>
                           </div>
                           <div className="grid grid-cols-2 gap-3">
                              <Button className="bg-white text-slate-950 font-black h-12 rounded-xl gap-2 active:scale-95 transition-all">
                                 <Navigation className="h-4 w-4" /> Start NAV
                              </Button>
                              <Button variant="outline" className="border-white/10 hover:bg-white/5 text-white font-black h-12 rounded-xl gap-2">
                                 <Phone className="h-4 w-4" /> Dispatch
                              </Button>
                           </div>
                        </div>
                     </CardContent>
                  </Card>
               ))}
               {trips.length === 0 && <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-3xl text-slate-600 font-bold italic">No active trips assigned.</div>}
            </div>
         )}
      </main>

      {/* Tab bar navigation for mobile */}
      <nav className="h-20 bg-slate-900 border-t border-white/5 grid grid-cols-4 sticky bottom-0 z-50">
         <div className="flex flex-col items-center justify-center gap-1 text-emerald-500">
            <Truck className="h-6 w-6" />
            <span className="text-[9px] font-black uppercase">Trips</span>
         </div>
         <div className="flex flex-col items-center justify-center gap-1 text-slate-500">
            <MapPin className="h-6 w-6" />
            <span className="text-[9px] font-black uppercase">Fleet</span>
         </div>
         <div className="flex flex-col items-center justify-center gap-1 text-slate-500">
            <Clock className="h-6 w-6" />
            <span className="text-[9px] font-black uppercase">History</span>
         </div>
         <div className="flex flex-col items-center justify-center gap-1 text-slate-500">
            <CheckCircle2 className="h-6 w-6" />
            <span className="text-[9px] font-black uppercase">Docs</span>
         </div>
      </nav>
    </div>
  )
}
