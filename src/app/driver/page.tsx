"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Truck, CheckCircle, Navigation } from 'lucide-react'

export default function DriverDashboard() {
  const [deliveries, setDeliveries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDeliveries() {
      try {
        const response = await fetch('/api/laundry/orders?status=ready')
        const data = await response.json()
        if (Array.isArray(data)) {
          setDeliveries(data)
        }
      } catch (error) {
        console.error('Failed to fetch deliveries:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchDeliveries()
  }, [])

  const updateStatus = async (orderId: string, status: string) => {
    try {
      await fetch(`/api/laundry/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      setDeliveries(deliveries.filter(d => d.id !== orderId))
    } catch (error) {
      console.error('Update failed:', error)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 pb-20">
      <header className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-900">
          <Truck className="h-6 w-6 text-blue-600" /> Driver Dashboard
        </h1>
        <p className="text-slate-500">Logistics & Route Management</p>
      </header>

      <div className="space-y-4">
        {loading ? (
          <p>Loading routes...</p>
        ) : deliveries.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed">
            <p className="text-slate-500">No pending deliveries</p>
          </div>
        ) : (
          deliveries.map((delivery) => (
            <Card key={delivery.id} className="overflow-hidden border-slate-200">
              <CardHeader className="bg-white border-b py-3">
                <div className="flex justify-between items-center">
                  <Badge variant="outline">{delivery.orderNumber}</Badge>
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Ready for Delivery</span>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">{delivery.customer?.name}</h3>
                  <p className="text-sm text-slate-600 flex items-start gap-1 mt-1 font-medium">
                    <Navigation className="h-4 w-4 mt-0.5 text-blue-500 shrink-0" />
                    {delivery.logistics?.address || 'No address provided'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Button
                    variant="outline"
                    className="w-full border-slate-300 font-bold"
                    onClick={() => updateStatus(delivery.id, 'out-for-delivery')}
                  >
                    Start Trip
                  </Button>
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold"
                    onClick={() => updateStatus(delivery.id, 'delivered')}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" /> Delivered
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
