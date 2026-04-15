"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ShieldCheck, UserPlus, Loader2, Globe, LayoutDashboard, Key, ShieldAlert, X } from 'lucide-react'
import { UserProvisioningForm } from '@/components/shared/forms/UserProvisioningForm'

export default function AdminPortal() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showProvision, setShowProvision] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/core/admin/users')
      const data = await res.json()
      if (Array.isArray(data)) setUsers(data)
    } finally {
      setLoading(false)
    }
  }

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
        <Button
            className={`${showProvision ? 'bg-red-600' : 'bg-slate-900'} text-white gap-2 transition-colors`}
            onClick={() => setShowProvision(!showProvision)}
        >
           {showProvision ? <X className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
           {showProvision ? 'Close Panel' : 'Provision New User'}
        </Button>
      </header>

      {showProvision && (
          <div className="mb-8 animate-in slide-in-from-top duration-300">
              <UserProvisioningForm onComplete={() => {
                  setShowProvision(false)
                  fetchUsers()
              }} />
          </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 border-2">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2 text-slate-900">
               <Globe className="h-5 w-5 text-blue-600" />
               Identity Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-slate-300" /></div>
            ) : (
                <div className="relative overflow-x-auto border rounded-xl">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50 uppercase text-[10px] font-black tracking-widest">
                                <TableHead>User Identity</TableHead>
                                <TableHead>Global Role</TableHead>
                                <TableHead>Portal Status</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((u) => (
                                <TableRow key={u.id} className="hover:bg-slate-50 transition-colors">
                                    <TableCell className="font-bold text-slate-900">
                                        {u.name}
                                        <div className="text-[10px] text-slate-400 font-mono italic">@{u.username}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={u.role === 'SUPERADMIN' ? 'bg-red-50 text-red-700 border-red-200' : ''}>
                                            {u.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-1 flex-wrap">
                                            {Object.keys(u.portalPermissions || {}).map(p => (
                                                <Badge key={p} variant="secondary" className="text-[10px] uppercase">{p}</Badge>
                                            ))}
                                            {u.role === 'SUPERADMIN' && <Badge className="bg-slate-900 text-white text-[10px] uppercase">ALL ACCESS</Badge>}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" className="text-blue-600 font-bold uppercase tracking-widest text-[10px]">Configure</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-2 border-amber-100 bg-amber-50/30">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-amber-900">
                <ShieldAlert className="h-5 w-5 text-amber-600" />
                Security Overrides
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start gap-2 bg-white border-amber-200 text-amber-900 hover:bg-amber-100">
                <Key className="h-4 w-4" /> Rotate Master Vault Key
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2 bg-white border-amber-200 text-amber-900 hover:bg-amber-100">
                <LayoutDashboard className="h-4 w-4" /> Global Session Reset
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Node Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="flex justify-between items-center text-sm border-b pb-2">
                 <span className="text-slate-500 font-medium">Provisioned Users</span>
                 <span className="font-bold">{users.length}</span>
               </div>
               <div className="flex justify-between items-center text-sm border-b pb-2">
                 <span className="text-slate-500 font-medium">Active Portals</span>
                 <span className="font-bold">8</span>
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
