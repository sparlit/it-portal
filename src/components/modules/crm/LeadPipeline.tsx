"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { UserPlus, Phone, Mail, TrendingUp, Loader2 } from 'lucide-react'

export function LeadPipeline() {
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/crm/leads')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setLeads(data)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
         <Card className="bg-white border-2">
            <CardContent className="pt-6">
               <p className="text-xs font-bold text-slate-500 uppercase">Total Active Leads</p>
               <h3 className="text-2xl font-black text-blue-600">{leads.length}</h3>
            </CardContent>
         </Card>
      </div>

      <div className="space-y-4">
         <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Active Sales Pipeline
            </h2>
            <Button size="sm" className="bg-blue-600 text-white gap-2">
                <UserPlus className="h-4 w-4" /> New Lead
            </Button>
         </div>

         {loading ? (
             <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-blue-200" /></div>
         ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {leads.length === 0 && <div className="md:col-span-2 text-center py-12 text-slate-400 border-2 border-dashed rounded-xl">No active leads in the pipeline.</div>}
                {leads.map(lead => (
                <Card key={lead.id} className="hover:border-blue-300 transition-colors">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                            <h4 className="font-bold text-lg">{lead.name}</h4>
                            <p className="text-sm text-slate-500">{lead.company || 'Private Client'}</p>
                            </div>
                            <Badge className="bg-blue-50 text-blue-700 capitalize">{lead.status}</Badge>
                        </div>
                        <div className="flex justify-between items-center pt-4 border-t">
                            <span className="font-black text-slate-900">{lead.source || 'Direct'}</span>
                            <div className="flex gap-2">
                            <Button size="icon" variant="outline" className="h-8 w-8 rounded-full"><Phone className="h-3 w-3" /></Button>
                            <Button size="icon" variant="outline" className="h-8 w-8 rounded-full"><Mail className="h-3 w-3" /></Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                ))}
            </div>
         )}
      </div>
    </div>
  )
}
