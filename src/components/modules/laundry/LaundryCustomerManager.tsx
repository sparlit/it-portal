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
import { useI18n } from '@/lib/i18n/context'
import { Plus, Users, Mail, Phone, MapPin, Loader2 } from 'lucide-react'

interface Customer {
  id: string;
  name: string;
  email?: string;
  phone: string;
  address?: string;
  loyaltyTier: string;
}

export function LaundryCustomerManager() {
  const { t } = useI18n()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    notes: ''
  })

  async function fetchCustomers() {
    setLoading(true)
    try {
      const response = await fetch('/api/laundry/customers')
      const data = await response.json()
      if (Array.isArray(data)) {
        setCustomers(data)
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/laundry/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        setIsDialogOpen(false)
        setFormData({ name: '', phone: '', email: '', address: '', notes: '' })
        fetchCustomers()
      }
    } catch (error) {
      console.error('Failed to register customer:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">{t('customers')}</h2>
          <p className="text-muted-foreground font-bold text-xs uppercase tracking-widest">{t('crm_subtitle')}</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="font-bold">
              <Plus className="mr-2 h-4 w-4" /> Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Register New Customer</DialogTitle>
              <DialogDescription>
                Create a new customer profile for the laundry service.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Register Customer
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50 border-b">
          <CardTitle className="flex items-center gap-2 font-black text-slate-800 uppercase tracking-widest text-xs">
            <Users className="h-4 w-4 text-blue-600" /> Active Clientele
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="text-left p-4 font-black text-slate-500 uppercase tracking-widest text-[10px]">{t('customer_name')}</th>
                  <th className="text-left p-4 font-black text-slate-500 uppercase tracking-widest text-[10px]">Contact Info</th>
                  <th className="text-left p-4 font-black text-slate-500 uppercase tracking-widest text-[10px]">Loyalty</th>
                  <th className="text-right p-4 font-black text-slate-500 uppercase tracking-widest text-[10px]">{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {loading ? (
                  <tr><td colSpan={4} className="p-12 text-center animate-pulse text-slate-400 font-black tracking-widest uppercase text-xs">{t('loading')}</td></tr>
                ) : customers.length === 0 ? (
                  <tr><td colSpan={4} className="p-12 text-center text-slate-400 font-bold">No customers registered.</td></tr>
                ) : (
                  customers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <div className="font-black text-slate-900 tracking-tight">{customer.name}</div>
                        <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1 mt-0.5 uppercase">
                          <MapPin className="h-3 w-3" /> {customer.address || 'No address'}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-1 text-xs font-black text-slate-700">
                            <Phone className="h-3 w-3 text-blue-500" /> {customer.phone}
                          </div>
                          {customer.email && (
                            <div className="flex items-center gap-1 text-xs text-slate-500 font-bold">
                              <Mail className="h-3 w-3" /> {customer.email}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline" className={`font-black uppercase text-[10px] tracking-widest ${
                          customer.loyaltyTier === 'gold' ? 'bg-amber-50 text-amber-600 border-amber-200 shadow-[0_0_8px_rgba(217,119,6,0.1)]' :
                          customer.loyaltyTier === 'silver' ? 'bg-slate-50 text-slate-600 border-slate-200' :
                          'bg-blue-50 text-blue-600 border-blue-200'
                        }`}>
                          {customer.loyaltyTier}
                        </Badge>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" className="font-black text-[10px] uppercase tracking-widest text-blue-600">{t('edit')}</Button>
                          <Button variant="ghost" size="sm" className="font-black text-[10px] uppercase tracking-widest text-slate-400">{t('view')}</Button>
                        </div>
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
