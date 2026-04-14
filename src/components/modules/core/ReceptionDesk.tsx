"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, Calendar, UserCheck, UserPlus, Clock, MoreVertical, MapPin } from 'lucide-react'

export function ReceptionDesk() {
  const visitors = [
    { id: 1, name: 'Mohammed Al-Thani', company: 'Doha Logistics', purpose: 'Maintenance Delivery', checkIn: '09:00 AM', status: 'checked-in' },
    { id: 2, name: 'Sarah Jenkins', company: 'CleanTech Solutions', purpose: 'Audit', checkIn: '10:15 AM', status: 'checked-in' },
    { id: 3, name: 'James Wilson', company: 'External Contractor', purpose: 'IT Support', checkIn: '-', status: 'expected' }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Reception & Visitor Management</h2>
          <p className="text-slate-500 font-medium">Track facility access and scheduled contractor visits.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="font-bold border-slate-300">
            <Calendar className="mr-2 h-4 w-4" /> Schedule Visit
          </Button>
          <Button className="font-bold">
            <UserPlus className="mr-2 h-4 w-4" /> New Check-in
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-slate-900 text-white shadow-xl border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-widest opacity-70">Active On-Site</CardTitle>
            <UserCheck className="h-4 w-4 opacity-50" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold">14</div>
            <p className="text-[10px] font-bold opacity-50 mt-1 uppercase tracking-tighter">Total visitors today</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500">Pending Arrival</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-slate-900">3</div>
            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">Next 2 hours</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500">Service Area Access</CardTitle>
            <MapPin className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-slate-900">5</div>
            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">Infrastructure zone</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200">
        <CardHeader className="bg-slate-50 border-b">
          <CardTitle className="flex items-center gap-2 font-bold text-slate-800">
            <Users className="h-5 w-5 text-blue-600" /> Visitor Registry
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="text-left p-4 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Visitor</th>
                  <th className="text-left p-4 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Company / Purpose</th>
                  <th className="text-left p-4 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Check-In</th>
                  <th className="text-left p-4 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Status</th>
                  <th className="text-right p-4 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visitors.map((visitor) => (
                  <tr key={visitor.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{visitor.name}</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Badge #VIS-00{visitor.id}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-slate-800 font-bold">{visitor.company}</div>
                      <div className="text-xs text-slate-500 font-medium">{visitor.purpose}</div>
                    </td>
                    <td className="p-4 font-mono text-xs font-bold text-slate-600">{visitor.checkIn}</td>
                    <td className="p-4">
                      <Badge variant={visitor.status === 'checked-in' ? 'success' : 'outline'} className="font-bold text-[10px] uppercase tracking-wider">
                        {visitor.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4 text-slate-400" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
