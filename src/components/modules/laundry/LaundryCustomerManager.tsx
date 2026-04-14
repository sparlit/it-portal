"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { UserPlus, Users, Phone, Mail, MapPin } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  loyaltyTier: string;
  totalOrders: number;
}

export function LaundryCustomerManager() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function fetchCustomers() {
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
    fetchCustomers()
  }, [])

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(search.toLowerCase()) ||
    customer.phone.includes(search) ||
    customer.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Customer CRM</h2>
          <p className="text-muted-foreground">Manage laundry customers and loyalty programs.</p>
        </div>
        <div className="flex w-full md:w-auto gap-2">
          <Input
            placeholder="Search name or phone..."
            className="md:w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <UserPlus className="mr-2 h-4 w-4" /> Add Customer
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p>Loading customers...</p>
        ) : filteredCustomers.length === 0 ? (
          <p className="col-span-full text-center text-muted-foreground py-20 border-2 border-dashed rounded-xl">No customers found.</p>
        ) : (
          filteredCustomers.map((customer) => (
            <Card key={customer.id} className="overflow-hidden">
              <CardHeader className="bg-muted/50 pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{customer.name}</CardTitle>
                    <Badge variant="outline" className="mt-1 bg-blue-50 text-blue-600">
                      {customer.loyaltyTier} Member
                    </Badge>
                  </div>
                  <Users className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                <div className="flex items-center text-sm">
                  <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                  {customer.phone}
                </div>
                {customer.email && (
                  <div className="flex items-center text-sm">
                    <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                    {customer.email}
                  </div>
                )}
                <div className="pt-2 border-t flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Total Orders:</span>
                  <span className="font-bold">{customer.totalOrders}</span>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="w-full">Edit</Button>
                  <Button variant="outline" size="sm" className="w-full">Orders</Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
