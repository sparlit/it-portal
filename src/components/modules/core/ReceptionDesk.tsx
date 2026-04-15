"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, Calendar, UserCheck, UserPlus, Clock, MoreVertical, MapPin, ShieldCheck } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'

export function ReceptionDesk() {
  const { t } = useI18n();
  const [visitors, setVisitors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchVisitors() {
      try {
        const response = await fetch('/api/core/visitors')
        const data = await response.json()
        if (Array.isArray(data)) {
          setVisitors(data)
        }
      } catch (error) {
        console.error('Failed to fetch visitors:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchVisitors()
  }, [])

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <ShieldCheck className="h-8 w-8 text-blue-600" /> {t('reception')}
          </h2>
          <p className="text-slate-500 font-medium">Facility access control and guest logging terminal.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="font-bold border-slate-300 hover:bg-slate-50 shadow-sm transition-all">
            <Calendar className="mr-2 h-4 w-4" /> Schedule Visit
          </Button>
          <Button className="font-bold bg-blue-600 hover:bg-blue-700 shadow-lg transition-all">
            <UserPlus className="mr-2 h-4 w-4" /> New Check-in
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-slate-900 text-white shadow-2xl border-none relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
             <UserCheck className="h-24 w-24" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
            <CardTitle className="text-xs font-bold uppercase tracking-widest opacity-70">Active On-Site</CardTitle>
            <UserCheck className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent className="relative">
            <div className="text-4xl font-extrabold">{visitors.filter(v => v.status === 'checked-in').length}</div>
            <p className="text-[10px] font-bold opacity-50 mt-1 uppercase tracking-tighter">Authorized personnel currently in building</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xl hover:border-blue-200 transition-all bg-white group">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-400">Pending Arrival</CardTitle>
            <Clock className="h-4 w-4 text-blue-500 group-hover:animate-spin-slow" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-extrabold text-slate-900">{visitors.filter(v => v.status === 'expected').length}</div>
            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">Scheduled for next 24 hours</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xl bg-slate-50 group hover:bg-white transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-400">Access Node</CardTitle>
            <MapPin className="h-4 w-4 text-orange-500 group-hover:scale-125 transition-transform" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 italic">Qatar Node: DOH-77</div>
            <p className="text-[10px] font-bold text-blue-600 mt-1 uppercase tracking-tighter">Secure Communication Active</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 shadow-2xl rounded-2xl overflow-hidden bg-white">
        <CardHeader className="bg-slate-50 border-b py-4">
          <CardTitle className="flex items-center gap-2 font-extrabold text-slate-800">
            <Users className="h-5 w-5 text-blue-600" /> Facility Access Log
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50/50 border-b">
                <tr>
                  <th className="text-left p-5 font-extrabold text-slate-400 uppercase tracking-widest text-[10px]">Guest Identity</th>
                  <th className="text-left p-5 font-extrabold text-slate-400 uppercase tracking-widest text-[10px]">Deployment / Objective</th>
                  <th className="text-left p-5 font-extrabold text-slate-400 uppercase tracking-widest text-[10px]">Access Time</th>
                  <th className="text-left p-5 font-extrabold text-slate-400 uppercase tracking-widest text-[10px]">Status</th>
                  <th className="text-right p-5 font-extrabold text-slate-400 uppercase tracking-widest text-[10px]">Operation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr><td colSpan={5} className="p-12 text-center">
                    <div className="animate-pulse flex flex-col items-center">
                       <div className="h-8 w-8 bg-slate-200 rounded-full mb-4" />
                       <p className="font-bold uppercase tracking-widest text-slate-300 text-xs">Synchronizing Access Registry...</p>
                    </div>
                  </td></tr>
                ) : visitors.length === 0 ? (
                  <tr><td colSpan={5} className="p-20 text-center">
                    <MapPin className="h-12 w-12 text-slate-100 mx-auto mb-4" />
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No active guest registrations recorded.</p>
                  </td></tr>
                ) : (
                  visitors.map((visitor) => (
                    <tr key={visitor.id} className="hover:bg-slate-50 transition-all group">
                      <td className="p-5">
                        <div className="font-extrabold text-slate-900">{visitor.name}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter bg-slate-100 px-1 rounded inline-block mt-1 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors border border-slate-200">NODE-AUTH: {visitor.id.slice(-6).toUpperCase()}</div>
                      </td>
                      <td className="p-5">
                        <div className="text-slate-800 font-bold flex items-center gap-1">
                           <ShieldCheck className="h-3 w-3 text-blue-400" />
                           {visitor.company}
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium mt-0.5">{visitor.purpose}</div>
                      </td>
                      <td className="p-5 font-mono text-xs font-extrabold text-slate-600">{visitor.checkInTime || 'PENDING_AUTH'}</td>
                      <td className="p-5">
                        <Badge variant={visitor.status === 'checked-in' ? 'success' : 'outline'} className={`font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full ${visitor.status === 'checked-in' ? 'animate-pulse' : ''}`}>
                          {visitor.status}
                        </Badge>
                      </td>
                      <td className="p-5 text-right">
                        <Button variant="ghost" size="icon" className="hover:bg-white rounded-xl shadow-sm">
                          <MoreVertical className="h-4 w-4 text-slate-400" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
