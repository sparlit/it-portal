"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Truck, Calendar, MapPin, User, CheckCircle2, Clock } from 'lucide-react'

export function DriverScheduling() {
  const [schedules] = useState([
    { id: '1', driver: 'Ahmed Khan', vehicle: 'VAN-001', route: 'West Bay - Pearl', status: 'On Trip', time: '08:00 - 16:00' },
    { id: '2', driver: 'John Doe', vehicle: 'TRUCK-05', route: 'Industrial Area', status: 'Loading', time: '09:00 - 18:00' },
    { id: '3', driver: 'Mohammed Ali', vehicle: 'VAN-003', route: 'Al Wakrah', status: 'Ready', time: '07:00 - 15:00' },
  ])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-blue-600 text-white">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-blue-100 text-sm font-medium uppercase tracking-wider">Active Drivers</p>
                <h3 className="text-4xl font-black mt-1">12</h3>
              </div>
              <User className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-emerald-600 text-white">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-emerald-100 text-sm font-medium uppercase tracking-wider">Active Trips</p>
                <h3 className="text-4xl font-black mt-1">8</h3>
              </div>
              <Truck className="h-8 w-8 text-emerald-200" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 text-white">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">Pending Orders</p>
                <h3 className="text-4xl font-black mt-1">45</h3>
              </div>
              <Calendar className="h-8 w-8 text-slate-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            Today's Dispatch Schedule
          </CardTitle>
          <Button variant="outline" size="sm">Modify Schedule</Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {schedules.map(s => (
              <div key={s.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-xl hover:bg-slate-50 transition-colors gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                    {s.driver.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{s.driver}</h4>
                    <p className="text-xs text-slate-500 font-medium uppercase">{s.vehicle}</p>
                  </div>
                </div>
                <div className="flex-1 px-4 border-l border-r hidden md:block">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    {s.route}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">{s.time}</div>
                </div>
                <div className="flex items-center justify-between md:justify-end gap-4 min-w-[120px]">
                   <Badge className={s.status === 'On Trip' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}>
                     {s.status}
                   </Badge>
                   <Button variant="ghost" size="icon" className="rounded-full">
                     <CheckCircle2 className="h-5 w-5 text-slate-300 hover:text-emerald-500" />
                   </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
