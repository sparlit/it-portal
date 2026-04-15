"use client"

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Package, Search, RefreshCcw } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  paymentStatus: string;
  receivedAt: string;
  customer: {
    name: string;
    phone: string;
  };
  items: any[];
}

export function LaundryOrderManager() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [search, setSearch] = useState('')

  const fetchOrders = useCallback(async (silent = false) => {
    if (!silent) setLoading(true)
    else setRefreshing(true)

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
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchOrders()
    const interval = setInterval(() => {
      fetchOrders(true)
    }, 30000)
    return () => clearInterval(interval)
  }, [fetchOrders])

  const filteredOrders = orders.filter(order =>
    order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
    order.customer.name.toLowerCase().includes(search.toLowerCase()) ||
    order.customer.phone.includes(search)
  )

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'received': return { color: 'bg-blue-900/10 text-blue-600 border-blue-200', label: 'RECEIVED' }
      case 'processing': return { color: 'bg-yellow-900/10 text-yellow-600 border-yellow-200', label: 'IN PROCESS' }
      case 'ready': return { color: 'bg-green-900/10 text-green-600 border-green-200', label: 'READY' }
      case 'delivered': return { color: 'bg-slate-100 text-slate-500 border-slate-200', label: 'DELIVERED' }
      default: return { color: 'bg-slate-50 text-slate-400 border-slate-100', label: status.toUpperCase() }
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black tracking-tighter uppercase">Order Management</h2>
          <p className="text-slate-500 font-medium text-sm mt-1 uppercase tracking-widest">Global Logistics Operations</p>
        </div>
        <div className="flex w-full md:w-auto gap-3">
          <div className="relative flex-1 md:w-72">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder="SEARCH BY ORDER ID OR PHONE..."
              className="pl-10 bg-white border-slate-200 text-xs font-bold uppercase tracking-widest h-11"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            className="h-11 border-slate-200 font-bold gap-2"
            onClick={() => fetchOrders()}
            disabled={refreshing}
          >
            <RefreshCcw className={cn("h-4 w-4", refreshing && "animate-spin")} />
          </Button>
          <Button className="bg-slate-900 hover:bg-slate-800 text-white h-11 px-6 font-bold uppercase tracking-widest text-xs">
            <Package className="mr-2 h-4 w-4" /> New Dispatch
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {[
          { label: 'Pending Sorting', value: orders.filter(o => o.status === 'received').length, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Operational Flow', value: orders.filter(o => o.status === 'processing' || o.status === 'sorting').length, color: 'text-yellow-600', bg: 'bg-yellow-50' },
          { label: 'Ready for Dispatch', value: orders.filter(o => o.status === 'ready').length, color: 'text-green-600', bg: 'bg-green-50' }
        ].map((stat, i) => (
          <Card key={i} className={cn("border-none shadow-sm", stat.bg)}>
            <CardHeader className="pb-2">
              <CardTitle className={cn("text-[10px] font-black uppercase tracking-[0.2em]", stat.color)}>{stat.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black tracking-tighter text-slate-900">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="relative w-full overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="h-14 px-6 text-left align-middle font-black text-[10px] uppercase tracking-widest text-slate-400">Order ID</th>
                <th className="h-14 px-6 text-left align-middle font-black text-[10px] uppercase tracking-widest text-slate-400">Customer Node</th>
                <th className="h-14 px-6 text-left align-middle font-black text-[10px] uppercase tracking-widest text-slate-400">Status</th>
                <th className="h-14 px-6 text-left align-middle font-black text-[10px] uppercase tracking-widest text-slate-400">Payload</th>
                <th className="h-14 px-6 text-left align-middle font-black text-[10px] uppercase tracking-widest text-slate-400">Value</th>
                <th className="h-14 px-6 text-left align-middle font-black text-[10px] uppercase tracking-widest text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={6} className="h-64 text-center font-bold text-slate-400 animate-pulse">Synchronizing Order Stream...</td></tr>
              ) : filteredOrders.length === 0 ? (
                <tr><td colSpan={6} className="h-64 text-center font-bold text-slate-400">No active orders detected in sector.</td></tr>
              ) : (
                filteredOrders.map((order) => {
                  const config = getStatusConfig(order.status);
                  return (
                    <tr key={order.id} className="transition-colors hover:bg-slate-50/50 group">
                      <td className="px-6 py-4 align-middle font-black text-slate-900 tabular-nums">{order.orderNumber}</td>
                      <td className="px-6 py-4 align-middle">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-700">{order.customer.name}</span>
                          <span className="text-[10px] font-bold text-slate-400 tracking-tighter tabular-nums">{order.customer.phone}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 align-middle">
                        <Badge variant="outline" className={cn("text-[9px] font-black tracking-widest px-2 py-0.5 border", config.color)}>
                          {config.label}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 align-middle text-xs font-bold text-slate-500">{order.items.length} Units</td>
                      <td className="px-6 py-4 align-middle font-black text-slate-900 tabular-nums">QAR {order.totalAmount.toFixed(2)}</td>
                      <td className="px-6 py-4 align-middle">
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="sm" className="h-8 text-xs font-bold text-slate-600 hover:bg-slate-100">Review</Button>
                          <Button variant="ghost" size="sm" className="h-8 text-xs font-bold text-blue-600 hover:bg-blue-50">Transmit</Button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
