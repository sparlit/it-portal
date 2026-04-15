"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Truck, CheckCircle, Navigation, Globe } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'

export default function DriverDashboard() {
  const { t, language, setLanguage } = useI18n()
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
      <header className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-black flex items-center gap-2 text-slate-900 tracking-tight">
            <Truck className="h-6 w-6 text-blue-600" /> {t('driver_dashboard')}
          </h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">{t('logistics_mgmt')}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-slate-500 font-bold flex items-center gap-2"
          onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
        >
          <Globe className="h-4 w-4" />
          {language === 'en' ? 'AR' : 'EN'}
        </Button>
      </header>

      <div className="space-y-4">
        {loading ? (
          <p className="p-12 text-center animate-pulse text-slate-400 font-bold">{t('loading')}</p>
        ) : deliveries.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">{t('no_deliveries')}</p>
          </div>
        ) : (
          deliveries.map((delivery) => (
            <Card key={delivery.id} className="overflow-hidden border-slate-200 shadow-sm hover:shadow-md transition-all">
              <CardHeader className="bg-white border-b py-3">
                <div className="flex justify-between items-center">
                  <Badge variant="outline" className="font-black text-blue-600 border-blue-100">{delivery.orderNumber}</Badge>
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{t('ready_for_delivery')}</span>
                </div>
              </CardHeader>
              <CardContent className="p-5 space-y-5">
                <div>
                  <h3 className="font-black text-xl text-slate-900 tracking-tight">{delivery.customer?.name}</h3>
                  <p className="text-sm text-slate-600 flex items-start gap-1.5 mt-2 font-bold leading-snug">
                    <Navigation className="h-4 w-4 mt-0.5 text-blue-500 shrink-0" />
                    {delivery.logistics?.address || 'No address provided'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <Button
                    variant="outline"
                    className="w-full border-slate-200 font-black text-xs uppercase tracking-widest h-12 hover:bg-slate-50"
                    onClick={() => updateStatus(delivery.id, 'out-for-delivery')}
                  >
                    {t('start_trip')}
                  </Button>
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-black text-xs uppercase tracking-widest h-12 shadow-lg shadow-green-200"
                    onClick={() => updateStatus(delivery.id, 'delivered')}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" /> {t('delivered')}
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
