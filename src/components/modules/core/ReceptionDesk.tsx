"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  Calendar,
  UserCheck,
  UserPlus,
  Clock,
  MoreVertical,
  MapPin
} from 'lucide-react'

export function ReceptionDesk() {
  const [visitors, setVisitors] = useState<any[]>([
    { id: 1, name: 'Mohammed Al-Thani', company: 'Doha Logistics', purpose: 'Maintenance Delivery', checkIn: '09:00 AM', status: 'checked-in' },
    { id: 2, name: 'Sarah Jenkins', company: 'CleanTech Solutions', purpose: 'Audit', checkIn: '10:15 AM', status: 'checked-in' },
    { id: 3, name: 'James Wilson', company: 'External Contractor', purpose: 'IT Support', checkIn: '-', status: 'expected' }
  ])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Reception & Visitor Management</h2>
          <p className="text-slate-500">Track facility access and scheduled contractor visits.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" /> Schedule Visit
          </Button>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" /> New Check-in
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-slate-900 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Currently In Facility</CardTitle>
            <UserCheck className="h-4 w-4 opacity-70" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14</div>
            <p className="text-xs opacity-70 mt-1">Total visitors today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Arrivals</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground mt-1">Expected in next 2h</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Contractors</CardTitle>
            <MapPin className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground mt-1">Infrastructure area access</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" /> Visitor Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="text-left p-4 font-bold text-slate-700">Visitor</th>
                  <th className="text-left p-4 font-bold text-slate-700">Company / Purpose</th>
                  <th className="text-left p-4 font-bold text-slate-700">Check-In</th>
                  <th className="text-left p-4 font-bold text-slate-700">Status</th>
                  <th className="text-right p-4 font-bold text-slate-700">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {visitors.map((visitor) => (
                  <tr key={visitor.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{visitor.name}</div>
                      <div className="text-xs text-slate-500">Badge #VIS-00{visitor.id}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-slate-800 font-medium">{visitor.company}</div>
                      <div className="text-xs text-slate-500">{visitor.purpose}</div>
                    </td>
                    <td className="p-4 font-mono text-slate-600">{visitor.checkIn}</td>
                    <td className="p-4">
                      <Badge variant={visitor.status === 'checked-in' ? 'success' : 'outline'}>
                        {visitor.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
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
