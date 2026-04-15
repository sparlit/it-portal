"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ShieldCheck, UserPlus, ShieldAlert, Key, Globe, LayoutDashboard } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'

export default function AdminPortal() {
  const { t } = useI18n()
  const [users, setUsers] = useState<any[]>([])

  // Mock data for initial UI - in real app would fetch from /api/admin/users
  useEffect(() => {
    setUsers([
      { id: '1', username: 'admin', name: 'System Admin', role: 'SUPERADMIN', status: 'active', portals: ['it', 'laundry', 'admin'] },
      { id: '2', username: 'transport_mgr', name: 'Transport Manager', role: 'MANAGER', status: 'active', portals: ['transport', 'stores'] },
    ])
  }, [])

  return (
    <main className="container mx-auto p-8">
      <header className="flex justify-between items-center mb-8 border-b pb-6">
        <div className="flex items-center gap-4">
          <div className="bg-red-600 p-2 rounded-lg text-white">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter text-slate-900">System Admin Control</h1>
            <p className="text-slate-500 font-medium">Unified User & Portal Governance</p>
          </div>
        </div>
        <div className="flex gap-2">
           <Button className="bg-slate-900 text-white gap-2">
             <UserPlus className="h-4 w-4" /> Provision New User
           </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 border-2">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
               <Globe className="h-5 w-5 text-blue-600" />
               Identity Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative overflow-x-auto border rounded-xl">
              <table className="w-full text-sm text-left text-slate-500">
                <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b">
                  <tr>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Global Role</th>
                    <th className="px-6 py-4">Portal Access</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="bg-white border-b hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900">
                        {u.name}
                        <div className="text-[10px] text-slate-400 font-mono">@{u.username}</div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={u.role === 'SUPERADMIN' ? 'bg-red-50 text-red-700 border-red-200' : ''}>
                          {u.role}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1 flex-wrap">
                          {u.portals.map((p: string) => (
                            <Badge key={p} variant="secondary" className="text-[10px] uppercase">
                              {p}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1 text-green-600 font-bold text-xs uppercase">
                          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                          {u.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="sm" className="text-blue-600 font-bold">Configure</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-2 border-amber-100 bg-amber-50/30">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-amber-600" />
                Security Overrides
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start gap-2 bg-white">
                <Key className="h-4 w-4" /> Rotate Master Vault Key
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2 bg-white">
                <LayoutDashboard className="h-4 w-4" /> Global Session Reset
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-lg">Portal Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="flex justify-between items-center text-sm border-b pb-2">
                 <span className="text-slate-500 font-medium">Total Portals</span>
                 <span className="font-bold">8 Active</span>
               </div>
               <div className="flex justify-between items-center text-sm border-b pb-2">
                 <span className="text-slate-500 font-medium">Concurrent Users</span>
                 <span className="font-bold">12</span>
               </div>
               <div className="flex justify-between items-center text-sm">
                 <span className="text-slate-500 font-medium">Auth Failures (24h)</span>
                 <span className="font-bold text-red-600">0</span>
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
