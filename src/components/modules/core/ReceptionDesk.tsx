"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Users, Calendar, UserCheck, UserPlus, Clock, MoreVertical, MapPin, Loader2 } from 'lucide-react'

export function ReceptionDesk() {
  const [visitors, setVisitors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    purpose: ''
  })

  async function fetchVisitors() {
    setLoading(true)
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

  useEffect(() => {
    fetchVisitors()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/core/visitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        setIsDialogOpen(false)
        setFormData({ name: '', company: '', purpose: '' })
        fetchVisitors()
      }
    } catch (error) {
      console.error('Failed to check in visitor:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

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

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="font-bold">
                <UserPlus className="mr-2 h-4 w-4" /> New Check-in
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Visitor Check-In</DialogTitle>
                <DialogDescription>
                  Register a new visitor arriving at the facility.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="vname" className="text-right">Name</Label>
                  <Input
                    id="vname"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="vcompany" className="text-right">Company</Label>
                  <Input
                    id="vcompany"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="vpurpose" className="text-right">Purpose</Label>
                  <Input
                    id="vpurpose"
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Confirm Check-In
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-slate-900 text-white shadow-xl border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-widest opacity-70">Active On-Site</CardTitle>
            <UserCheck className="h-4 w-4 opacity-50" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold">{visitors.filter(v => v.status === 'checked-in').length}</div>
            <p className="text-[10px] font-bold opacity-50 mt-1 uppercase tracking-tighter">Total visitors today</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500">Pending Arrival</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-slate-900">{visitors.filter(v => v.status === 'expected').length}</div>
            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">Next 2 hours</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500">Facility Security</CardTitle>
            <MapPin className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">Level 4 Node</div>
            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">Infrastructure zone active</p>
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
                {loading ? (
                  <tr><td colSpan={5} className="p-8 text-center animate-pulse">Loading Visitor Log...</td></tr>
                ) : visitors.length === 0 ? (
                  <tr><td colSpan={5} className="p-8 text-center text-slate-400">No visitors recorded today.</td></tr>
                ) : (
                  visitors.map((visitor) => (
                    <tr key={visitor.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-slate-900">{visitor.name}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">ID: {visitor.id.slice(-6)}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-slate-800 font-bold">{visitor.company}</div>
                        <div className="text-xs text-slate-500 font-medium">{visitor.purpose}</div>
                      </td>
                      <td className="p-4 font-mono text-xs font-bold text-slate-600">{visitor.checkInTime || '-'}</td>
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
