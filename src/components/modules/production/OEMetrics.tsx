"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Settings, Loader2, Plus, Zap, Activity, ShieldCheck } from 'lucide-react'

export function OEMetrics() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Card className="bg-slate-900 text-white">
            <CardContent className="pt-6">
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Availability</p>
               <h3 className="text-4xl font-black italic">94.2%</h3>
            </CardContent>
         </Card>
         <Card className="bg-blue-600 text-white">
            <CardContent className="pt-6">
               <p className="text-[10px] font-black uppercase tracking-widest text-blue-200">Performance</p>
               <h3 className="text-4xl font-black italic">88.7%</h3>
            </CardContent>
         </Card>
         <Card className="bg-emerald-600 text-white">
            <CardContent className="pt-6">
               <p className="text-[10px] font-black uppercase tracking-widest text-emerald-200">Quality Index</p>
               <h3 className="text-4xl font-black italic">99.1%</h3>
            </CardContent>
         </Card>
      </div>

      <Card className="border-2 border-slate-200">
         <CardHeader className="bg-slate-50 border-b">
            <CardTitle className="flex items-center gap-2 text-lg font-black uppercase italic">
               <Activity className="h-5 w-5 text-blue-600" />
               Real-time OEE Calculation Engine
            </CardTitle>
         </CardHeader>
         <CardContent className="p-12 flex flex-col items-center justify-center text-center">
            <Zap className="h-16 w-16 text-slate-200 mb-4 animate-pulse" />
            <p className="text-slate-500 font-medium max-w-md">The system is currently aggregating sensor data from industrial washing and drying units to calculate global OEE scores.</p>
            <div className="mt-8 flex gap-4">
               <Button variant="outline" className="text-[10px] font-black uppercase italic">Download Shift Report</Button>
               <Button className="bg-slate-900 text-white text-[10px] font-black uppercase italic">Recalculate Baseline</Button>
            </div>
         </CardContent>
      </Card>
    </div>
  )
}
