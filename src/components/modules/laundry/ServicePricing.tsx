"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Settings2, Tag, Clock } from 'lucide-react'

export function ServicePricing() {
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
          <h2 className="text-3xl font-bold tracking-tight">Service & Pricing Catalog</h2>
          <p className="text-muted-foreground">Manage laundry services and TAT targets.</p>
        </div>
        <Button className="font-bold"><Plus className="mr-2 h-4 w-4" /> Add Service</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-bold"><Settings2 className="h-5 w-5" /> Active Price List</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="text-left p-4 font-bold">Service</th>
                  <th className="text-left p-4 font-bold">Category</th>
                  <th className="text-left p-4 font-bold">Price</th>
                  <th className="text-left p-4 font-bold">Est. TAT</th>
                  <th className="text-right p-4 font-bold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {loading ? (
                  <tr><td colSpan={5} className="p-8 text-center">Loading pricing...</td></tr>
                ) : services.map((service) => (
                  <tr key={service.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-bold">{service.name}</td>
                    <td className="p-4"><Badge variant="outline">{service.category}</Badge></td>
                    <td className="p-4 font-mono font-bold">QR {service.price.toFixed(2)}</td>
                    <td className="p-4 flex items-center gap-1 text-slate-500"><Clock className="h-3 w-3" /> {service.estimatedTime}h</td>
                    <td className="p-4 text-right"><Button variant="ghost" size="sm">Edit</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
