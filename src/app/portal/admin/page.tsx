"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ShieldCheck, UserPlus, Loader2, Globe, LayoutDashboard, Key, ShieldAlert, X, BarChart3, Activity } from 'lucide-react'
import { UserProvisioningForm } from '@/components/shared/forms/UserProvisioningForm'
import { NotificationCenter } from '@/components/shared/layout/NotificationCenter'
import { ExecutiveDashboard } from '@/components/modules/core/ExecutiveDashboard'

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
    <main className="container mx-auto p-8 bg-white min-h-screen">
      <header className="flex justify-between items-center mb-12 border-b pb-8">
        <div className="flex items-center gap-4">
          <div className="bg-red-600 p-4 rounded-3xl text-white shadow-xl rotate-3">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-900 italic">Command Control</h1>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">Enterprise Sovereign Governance</p>
          </div>
        </div>
        <div className="flex gap-4 items-center">
            <NotificationCenter />
            <Button
                className={`${showProvision ? 'bg-red-600' : 'bg-slate-900'} text-white px-8 py-6 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-lg hover:scale-105`}
                onClick={() => setShowProvision(!showProvision)}
            >
               {showProvision ? <X className="h-4 w-4 mr-2" /> : <UserPlus className="h-4 w-4 mr-2" />}
               {showProvision ? 'Close Panel' : 'Provision User'}
            </Button>
        </div>
      </header>

      {showProvision && (
          <div className="mb-12 animate-in slide-in-from-top duration-500">
              <UserProvisioningForm onComplete={() => {
                  setShowProvision(false)
                  fetchUsers()
              }} />
          </div>
      )}

      <Tabs defaultValue="executive" className="w-full">
        <div className="overflow-x-auto pb-8 scrollbar-hide">
          <TabsList className="flex h-auto gap-4 bg-transparent p-0 min-w-max">
            <TabsTrigger value="executive" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white px-8 py-4 rounded-2xl border-2 font-black uppercase tracking-widest text-[10px]">
               Executive Intel
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white px-8 py-4 rounded-2xl border-2 font-black uppercase tracking-widest text-[10px]">
               Identity Access
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-red-600 data-[state=active]:text-white px-8 py-4 rounded-2xl border-2 font-black uppercase tracking-widest text-[10px]">
               Security Core
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="executive">
           <ExecutiveDashboard />
        </TabsContent>

        <TabsContent value="users">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 border-2 rounded-[40px] shadow-2xl overflow-hidden">
              <CardHeader className="p-8 border-b bg-slate-50">
                <CardTitle className="text-2xl font-black italic uppercase tracking-tighter flex items-center gap-3">
                   <Globe className="h-6 w-6 text-blue-600" />
                   Personnel Directory
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-slate-300" /></div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-100/50 uppercase text-[10px] font-black tracking-widest">
                                <TableHead className="px-8 py-6">User Identity</TableHead>
                                <TableHead>Global Role</TableHead>
                                <TableHead>Authorized Portals</TableHead>
                                <TableHead className="text-right px-8">Governance</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((u) => (
                                <TableRow key={u.id} className="hover:bg-slate-50 transition-colors border-b last:border-none">
                                    <TableCell className="px-8 py-6">
                                        <div className="font-black text-slate-900 text-lg tracking-tighter italic">{u.name}</div>
                                        <div className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-widest">UID: {u.id.slice(-8)}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={u.role === 'SUPERADMIN' ? 'bg-red-600 text-white border-none' : 'bg-slate-200 text-slate-700'}>
                                            {u.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2 flex-wrap">
                                            {Object.keys(u.portalPermissions || {}).map(p => (
                                                <Badge key={p} variant="outline" className="text-[10px] font-black uppercase border-blue-200 text-blue-700">{p}</Badge>
                                            ))}
                                            {u.role === 'SUPERADMIN' && <Badge className="bg-blue-600 text-white text-[10px] uppercase font-black">OMNIPOTENT</Badge>}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right px-8">
                                        <Button variant="ghost" size="sm" className="text-blue-600 font-black uppercase tracking-widest text-[10px] hover:bg-blue-50">MANAGE</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
              </CardContent>
            </Card>

            <div className="space-y-8">
               <Card className="border-2 rounded-[40px] shadow-xl overflow-hidden">
                  <CardHeader className="p-8">
                    <CardTitle className="text-lg font-black uppercase tracking-widest">Directory Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="px-8 pb-8 space-y-4">
                     <div className="flex justify-between items-center text-sm border-b border-dashed pb-4">
                       <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Total Workforce</span>
                       <span className="font-black italic text-xl">{users.length}</span>
                     </div>
                     <div className="flex justify-between items-center text-sm border-b border-dashed pb-4">
                       <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Active Portals</span>
                       <span className="font-black italic text-xl text-blue-600">8</span>
                     </div>
                  </CardContent>
               </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="security">
           <div className="max-w-4xl mx-auto space-y-8">
              <Card className="border-4 border-amber-500 rounded-[40px] shadow-2xl bg-amber-50/50 overflow-hidden">
                <CardHeader className="p-12 text-center border-b border-amber-200">
                   <ShieldAlert size={64} className="mx-auto text-amber-600 mb-6" />
                   <CardTitle className="text-4xl font-black uppercase italic tracking-tighter text-amber-900">High-Level Overrides</CardTitle>
                   <p className="text-amber-700 font-medium">Critical system-wide security operations</p>
                </CardHeader>
                <CardContent className="p-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                   <Button className="h-32 bg-white border-2 border-amber-200 text-amber-900 hover:bg-amber-100 flex flex-col gap-2 rounded-[30px] font-black uppercase tracking-widest shadow-lg">
                      <Key className="h-8 w-8 text-amber-600" />
                      Rotate Master Vault
                   </Button>
                   <Button className="h-32 bg-white border-2 border-amber-200 text-amber-900 hover:bg-amber-100 flex flex-col gap-2 rounded-[30px] font-black uppercase tracking-widest shadow-lg">
                      <LayoutDashboard className="h-8 w-8 text-amber-600" />
                      Global Session Flush
                   </Button>
                </CardContent>
              </Card>

              <div className="bg-slate-900 p-12 rounded-[40px] text-white flex items-center justify-between shadow-2xl">
                 <div className="flex items-center gap-6">
                    <Activity size={48} className="text-emerald-500 animate-pulse" />
                    <div>
                       <h4 className="text-2xl font-black italic uppercase">System Sentinel</h4>
                       <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Real-time audit log active • monitoring 482 points</p>
                    </div>
                 </div>
                 <Badge className="bg-emerald-500 text-white px-6 py-2 rounded-full font-black uppercase tracking-widest text-[10px]">NOMINAL</Badge>
              </div>
           </div>
        </TabsContent>
      </Tabs>
    </main>
  )
}
