"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { UserPlus, Phone, Mail, TrendingUp } from 'lucide-react'

export function LeadPipeline() {
  const leads = [
    { id: '1', name: 'Doha Grand Hotel', contact: 'Mr. Salim', status: 'Qualified', value: 'QAR 120k' },
    { id: '2', name: 'West Bay Residences', contact: 'Ms. Fatima', status: 'In Discussion', value: 'QAR 45k' },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
         <Card className="bg-white border-2">
            <CardContent className="pt-6">
               <p className="text-xs font-bold text-slate-500 uppercase">Conversion Rate</p>
               <h3 className="text-2xl font-black text-blue-600">18.4%</h3>
            </CardContent>
         </Card>
         <Card className="bg-white border-2">
            <CardContent className="pt-6">
               <p className="text-xs font-bold text-slate-500 uppercase">Pipeline Value</p>
               <h3 className="text-2xl font-black text-emerald-600">QAR 2.1M</h3>
            </CardContent>
         </Card>
      </div>

      <div className="space-y-4">
         <h2 className="text-xl font-bold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Active Sales Pipeline
         </h2>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {leads.map(lead => (
               <Card key={lead.id} className="hover:border-blue-300 transition-colors">
                  <CardContent className="p-6">
                     <div className="flex justify-between items-start mb-4">
                        <div>
                           <h4 className="font-bold text-lg">{lead.name}</h4>
                           <p className="text-sm text-slate-500">{lead.contact}</p>
                        </div>
                        <Badge className="bg-blue-50 text-blue-700">{lead.status}</Badge>
                     </div>
                     <div className="flex justify-between items-center pt-4 border-t">
                        <span className="font-black text-slate-900">{lead.value}</span>
                        <div className="flex gap-2">
                           <Button size="icon" variant="outline" className="h-8 w-8 rounded-full"><Phone className="h-3 w-3" /></Button>
                           <Button size="icon" variant="outline" className="h-8 w-8 rounded-full"><Mail className="h-3 w-3" /></Button>
                        </div>
                     </div>
                  </CardContent>
               </Card>
            ))}
         </div>
      </div>
    </div>
  )
}
