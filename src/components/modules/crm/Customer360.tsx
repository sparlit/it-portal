"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { User, Phone, Mail, MapPin, Loader2, Globe } from 'lucide-react'

export function Customer360() {
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/laundry/customers')
      .then(res => res.json())
      .then(data => {
          if (Array.isArray(data)) setCustomers(data)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black uppercase tracking-tighter italic flex items-center gap-2">
         <Globe className="h-6 w-6 text-blue-600" />
         Unified Customer Database
      </h2>

      {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-blue-200" /></div>
      ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {customers.length === 0 && <div className="col-span-full text-center py-20 text-slate-400 border-2 border-dashed rounded-2xl italic font-bold">No registered customers found.</div>}
              {customers.map(c => (
                  <Card key={c.id} className="hover:shadow-lg transition-shadow border-2">
                      <CardHeader className="pb-2">
                         <div className="flex justify-between items-start">
                            <div className="h-12 w-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-xl">
                               {c.name[0]}
                            </div>
                            <Badge variant="outline" className="capitalize">{c.loyaltyTier}</Badge>
                         </div>
                         <CardTitle className="text-xl pt-4">{c.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                         <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                               <Phone className="h-4 w-4" /> {c.phone}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                               <MapPin className="h-4 w-4" /> {c.address || 'No address provided'}
                            </div>
                         </div>
                         <div className="pt-4 border-t flex justify-between items-center">
                            <div className="text-xs font-bold text-slate-400 uppercase">Total Orders</div>
                            <div className="font-black text-blue-600">{c.totalOrders}</div>
                         </div>
                         <Button className="w-full bg-slate-900 text-white text-xs font-bold uppercase tracking-widest mt-2">View Transaction History</Button>
                      </CardContent>
                  </Card>
              ))}
          </div>
      )}
    </div>
  )
}
