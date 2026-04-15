"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useI18n } from '@/lib/i18n/context'
import { Plus, ShoppingBag, Clock, CheckCircle2, ChevronRight } from 'lucide-react'

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  customer: {
    name: string;
    phone: string;
  };
  items: any[];
}

export function LaundryOrderManager() {
  const { t } = useI18n()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch('/api/laundry/orders')
        const data = await response.json()
        if (Array.isArray(data)) {
          setOrders(data)
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'received': return 'bg-blue-50 text-blue-600 border-blue-200'
      case 'processing': return 'bg-orange-50 text-orange-600 border-orange-200'
      case 'ready': return 'bg-purple-50 text-purple-600 border-purple-200'
      case 'delivered': return 'bg-green-50 text-green-600 border-green-200'
      default: return 'bg-slate-50 text-slate-600 border-slate-200'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">{t('orders')}</h2>
          <p className="text-muted-foreground font-medium">Real-time operational workflow & lifecycle tracking.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/20">
          <Plus className="mr-2 h-4 w-4" /> New Order
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500">Inbound</CardTitle>
            <ShoppingBag className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-slate-900">{orders.filter(o => o.status === 'received').length}</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500">Processing</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-slate-900">{orders.filter(o => o.status === 'processing').length}</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500">Ready</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-slate-900">{orders.filter(o => o.status === 'ready').length}</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500">Completed</CardTitle>
            <Badge variant="success" className="h-4 w-4 rounded-full p-0" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-slate-900">{orders.filter(o => o.status === 'delivered').length}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50 border-b">
          <CardTitle className="font-bold text-slate-800">Operational Queue</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="text-left p-4 font-bold text-slate-500 uppercase tracking-widest text-[10px]">{t('order_number')}</th>
                  <th className="text-left p-4 font-bold text-slate-500 uppercase tracking-widest text-[10px]">{t('customer_name')}</th>
                  <th className="text-left p-4 font-bold text-slate-500 uppercase tracking-widest text-[10px]">{t('status')}</th>
                  <th className="text-left p-4 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Items</th>
                  <th className="text-left p-4 font-bold text-slate-500 uppercase tracking-widest text-[10px]">{t('total_amount')}</th>
                  <th className="text-right p-4 font-bold text-slate-500 uppercase tracking-widest text-[10px]">{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr><td colSpan={6} className="p-8 text-center animate-pulse text-slate-400 font-bold">{t('loading')}</td></tr>
                ) : orders.length === 0 ? (
                  <tr><td colSpan={6} className="p-8 text-center text-slate-400 font-medium">Queue is currently empty.</td></tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-black text-slate-900">{order.orderNumber}</td>
                      <td className="p-4">
                        <div className="font-bold text-slate-800">{order.customer.name}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase">{order.customer.phone}</div>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline" className={`font-black uppercase text-[10px] tracking-widest ${getStatusStyle(order.status)}`}>
                          {order.status}
                        </Badge>
                      </td>
                      <td className="p-4 font-bold text-slate-600">{order.items.length} Units</td>
                      <td className="p-4 font-mono font-black text-blue-600">QAR {order.totalAmount.toFixed(2)}</td>
                      <td className="p-4 text-right">
                        <Button variant="ghost" size="sm" className="font-bold text-blue-600 flex items-center gap-1 ml-auto">
                          {t('view')} <ChevronRight className="h-3 w-3" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
