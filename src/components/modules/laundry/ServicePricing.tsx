"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Settings2, Clock } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'

export function ServicePricing() {
  const { t } = useI18n()
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchServices() {
      try {
        const response = await fetch('/api/laundry/services')
        const data = await response.json()
        if (Array.isArray(data)) {
          setServices(data)
        }
      } catch (error) {
        console.error('Failed to fetch services:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchServices()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">{t('pricing')}</h2>
          <p className="text-muted-foreground font-medium">Manage laundry services and TAT targets.</p>
        </div>
        <Button className="font-bold"><Plus className="mr-2 h-4 w-4" /> {t('add_service')}</Button>
      </div>

      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50 border-b">
          <CardTitle className="flex items-center gap-2 font-bold text-slate-800"><Settings2 className="h-5 w-5 text-blue-600" /> Active Price List</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="text-left p-4 font-bold text-slate-500 uppercase tracking-widest text-[10px]">{t('price')}</th>
                  <th className="text-left p-4 font-bold text-slate-500 uppercase tracking-widest text-[10px]">{t('category')}</th>
                  <th className="text-left p-4 font-bold text-slate-500 uppercase tracking-widest text-[10px]">{t('price')}</th>
                  <th className="text-left p-4 font-bold text-slate-500 uppercase tracking-widest text-[10px]">{t('est_tat')}</th>
                  <th className="text-right p-4 font-bold text-slate-500 uppercase tracking-widest text-[10px]">{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr><td colSpan={5} className="p-8 text-center animate-pulse text-slate-400 font-bold">{t('loading')}</td></tr>
                ) : services.length === 0 ? (
                  <tr><td colSpan={5} className="p-8 text-center text-slate-400">No services defined.</td></tr>
                ) : (
                  services.map((service) => (
                    <tr key={service.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-bold text-slate-900">{service.name}</td>
                      <td className="p-4"><Badge variant="outline" className="font-bold uppercase text-[10px] tracking-widest">{service.category}</Badge></td>
                      <td className="p-4 font-mono font-black text-blue-600">QAR {service.price.toFixed(2)}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 text-slate-500 font-bold">
                          <Clock className="h-3 w-3" /> {service.estimatedTime}h
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <Button variant="ghost" size="sm" className="font-bold text-blue-600">{t('edit')}</Button>
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
