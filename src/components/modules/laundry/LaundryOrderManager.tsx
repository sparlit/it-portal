"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useI18n } from '@/lib/i18n/context'
import { Plus, ShoppingBag, Clock, CheckCircle2, ChevronRight, Loader2, Trash2 } from 'lucide-react'

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
  const [customers, setCustomers] = useState<any[]>([])
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    customerId: '',
    items: [] as { serviceId: string, quantity: number }[],
    notes: '',
    address: ''
  })

  async function fetchData() {
    setLoading(true)
    try {
      const [ordersRes, customersRes, servicesRes] = await Promise.all([
        fetch('/api/laundry/orders'),
        fetch('/api/laundry/customers'),
        fetch('/api/laundry/services')
      ])

      const ordersData = await ordersRes.json()
      const customersData = await customersRes.json()
      const servicesData = await servicesRes.json()

      if (Array.isArray(ordersData)) setOrders(ordersData)
      if (Array.isArray(customersData)) setCustomers(customersData)
      if (Array.isArray(servicesData)) setServices(servicesData)
    } catch (error) {
      console.error('Failed to fetch laundry data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { serviceId: services[0]?.id || '', quantity: 1 }]
    })
  }

  const removeItem = (index: number) => {
    const newItems = [...formData.items]
    newItems.splice(index, 1)
    setFormData({ ...formData, items: newItems })
  }

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...formData.items]
    newItems[index] = { ...newItems[index], [field]: value }
    setFormData({ ...formData, items: newItems })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.items.length === 0) {
      alert('Please add at least one item')
      return
    }
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/laundry/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        setIsDialogOpen(false)
        setFormData({ customerId: '', items: [], notes: '', address: '' })
        fetchData()
      }
    } catch (error) {
      console.error('Failed to create order:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

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

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/20">
              <Plus className="mr-2 h-4 w-4" /> New Order
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create Laundry Order</DialogTitle>
              <DialogDescription>
                Select a customer and add services to the order.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="customer">Customer</Label>
                <Select
                  value={formData.customerId}
                  onValueChange={(val) => setFormData({ ...formData, customerId: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.name} ({c.phone})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Order Items</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addItem}>
                    <Plus className="h-3 w-3 mr-1" /> Add Service
                  </Button>
                </div>

                <div className="max-h-[200px] overflow-y-auto space-y-2 border rounded-md p-2">
                  {formData.items.length === 0 && <p className="text-xs text-center text-slate-400 py-4">No items added.</p>}
                  {formData.items.map((item, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <Select
                        value={item.serviceId}
                        onValueChange={(val) => updateItem(idx, 'serviceId', val)}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Service" />
                        </SelectTrigger>
                        <SelectContent>
                          {services.map(s => (
                            <SelectItem key={s.id} value={s.id}>{s.name} (QAR {s.price})</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        type="number"
                        className="w-16"
                        value={item.quantity}
                        onChange={(e) => updateItem(idx, 'quantity', parseInt(e.target.value))}
                        min="1"
                      />
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(idx)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="addr">Pickup/Delivery Address</Label>
                <Input
                  id="addr"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Leave empty for walk-in"
                />
              </div>

              <DialogFooter>
                <Button type="submit" disabled={isSubmitting || !formData.customerId}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Generate Order
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
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
