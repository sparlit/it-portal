"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Scan, ArrowRight, CheckCircle2, Loader2, Waves, Zap } from 'lucide-react'

export function GarmentTracker() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [scanning, setScanning] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    const res = await fetch('/api/laundry/orders')
    const data = await res.json()
    if (Array.isArray(data)) setOrders(data)
    setLoading(false)
  }

  const simulateScan = async (orderId: string, currentStatus: string) => {
    setScanning(true)
    const statusMap: Record<string, string> = {
        'received': 'sorting',
        'sorting': 'processing',
        'processing': 'quality-check',
        'quality-check': 'ready',
        'ready': 'out-for-delivery',
        'out-for-delivery': 'delivered'
    }
    const nextStatus = statusMap[currentStatus] || 'ready'

    await fetch(`/api/laundry/orders/${orderId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
    })

    // Simulate RFID/Barcode lag
    setTimeout(() => {
        setScanning(false)
        fetchOrders()
    }, 800)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-blue-600 p-6 rounded-2xl text-white shadow-xl">
         <div>
            <h2 className="text-2xl font-black uppercase italic tracking-tighter">Garment Lifecycle Engine</h2>
            <p className="text-blue-100 text-xs font-bold uppercase tracking-widest mt-1 flex items-center gap-2">
               <Scan className="h-3 w-3" /> RFID & BARCODE SIMULATION ACTIVE
            </p>
         </div>
         <Badge className="bg-white text-blue-600 font-black">STATION: DOH-LND-01</Badge>
      </div>

      {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-blue-300" /></div>
      ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {orders.map(order => (
                  <Card key={order.id} className="border-2 overflow-hidden hover:border-blue-500 transition-colors">
                      <CardContent className="p-0">
                          <div className="flex">
                             <div className="w-24 bg-slate-50 flex flex-col items-center justify-center border-r">
                                <Scan className={`h-8 w-8 ${scanning ? 'text-blue-500 animate-pulse' : 'text-slate-300'}`} />
                                <span className="text-[9px] font-bold text-slate-400 mt-2 uppercase tracking-tighter">Ready for Scan</span>
                             </div>
                             <div className="flex-1 p-5">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-black text-lg text-slate-900">{order.orderNumber}</h4>
                                        <p className="text-xs font-medium text-slate-500">{order.customer?.name}</p>
                                    </div>
                                    <Badge variant="secondary" className="uppercase text-[10px] font-black">{order.status}</Badge>
                                </div>
                                <div className="mt-6 flex items-center justify-between">
                                    <div className="flex items-center gap-1">
                                        <div className={`h-2 w-2 rounded-full ${order.status === 'ready' ? 'bg-emerald-500 animate-ping' : 'bg-blue-600'}`} />
                                        <span className="text-[10px] font-black uppercase text-slate-400">Current Phase</span>
                                    </div>
                                    <Button
                                        size="sm"
                                        className="bg-slate-900 text-white gap-2 text-[10px] font-black uppercase h-8"
                                        onClick={() => simulateScan(order.id, order.status)}
                                        disabled={scanning || order.status === 'delivered'}
                                    >
                                        Update via RFID <ArrowRight className="h-3 w-3" />
                                    </Button>
                                </div>
                             </div>
                          </div>
                      </CardContent>
                  </Card>
              ))}
          </div>
      )}
    </div>
  )
}
