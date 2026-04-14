"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Plus,
  Settings2,
  Tag,
  Clock,
  Search,
  CheckCircle,
  FileText
} from 'lucide-react'

interface LaundryService {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  estimatedTime: number;
}

export function ServicePricing() {
  const [services, setServices] = useState<LaundryService[]>([])
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
          <p className="text-muted-foreground">Manage laundry services, price lists, and TAT targets.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Service
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {['Garment', 'Bedding', 'Specialty'].map((category) => (
          <Card key={category}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{category} Services</CardTitle>
              <Tag className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {services.filter(s => s.category === category).length}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5" /> Active Price List
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? (
              <p>Loading catalog...</p>
            ) : services.length === 0 ? (
              <p className="text-center text-muted-foreground py-10">No services defined.</p>
            ) : (
              <div className="rounded-md border overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b">
                    <tr>
                      <th className="text-left p-3 font-medium">Service Name</th>
                      <th className="text-left p-3 font-medium">Category</th>
                      <th className="text-left p-3 font-medium">Pricing</th>
                      <th className="text-left p-3 font-medium">Est. TAT</th>
                      <th className="text-right p-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {services.map((service) => (
                      <tr key={service.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3">
                          <div className="font-medium">{service.name}</div>
                        </td>
                        <td className="p-3">
                          <Badge variant="outline">{service.category}</Badge>
                        </td>
                        <td className="p-3 font-mono">
                          QR {service.price.toFixed(2)} / {service.unit}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-3 w-3" /> {service.estimatedTime}h
                          </div>
                        </td>
                        <td className="p-3 text-right">
                          <Button variant="ghost" size="sm">Edit</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
