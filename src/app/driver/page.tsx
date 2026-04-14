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
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Truck className="h-6 w-6 text-blue-600" /> Driver Dashboard
        </h1>
        <p className="text-muted-foreground">Logistics & Route Management</p>
      </header>

      <div className="space-y-4">
        {loading ? (
          <p>Loading routes...</p>
        ) : deliveries.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed">
            <p className="text-muted-foreground">No pending deliveries</p>
          </div>
        ) : (
          deliveries.map((delivery) => (
            <Card key={delivery.id} className="overflow-hidden">
              <CardHeader className="bg-white border-b py-3">
                <div className="flex justify-between items-center">
                  <Badge variant="outline">{delivery.orderNumber}</Badge>
                  <span className="text-xs text-muted-foreground">Ready for Delivery</span>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div>
                  <h3 className="font-bold text-lg">{delivery.customer?.name}</h3>
                  <p className="text-sm text-slate-600 flex items-start gap-1 mt-1">
                    <Navigation className="h-4 w-4 mt-0.5 text-blue-500 shrink-0" />
                    {delivery.logistics?.address || 'No address provided'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => updateStatus(delivery.id, 'out-for-delivery')}
                  >
                    Start Trip
                  </Button>
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700"
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

      {/* Mobile Bottom Nav Simulation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t p-3 flex justify-around items-center">
        <Button variant="ghost" className="flex flex-col h-auto py-1">
          <Truck className="h-5 w-5" />
          <span className="text-[10px] mt-1">Routes</span>
        </Button>
        <Button variant="ghost" className="flex flex-col h-auto py-1 text-slate-400">
          <CheckCircle className="h-5 w-5" />
          <span className="text-[10px] mt-1">Completed</span>
        </Button>
      </nav>
    </div>
  )
}
