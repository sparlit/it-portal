"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, MessageSquare, AlertCircle, CheckCircle } from 'lucide-react'

interface LaundryTicket {
  id: string;
  ticketId: string;
  subject: string;
  type: string;
  priority: string;
  status: string;
  customer?: {
    name: string;
    phone: string;
  };
}

export function LaundryTicketDashboard() {
  const [tickets, setTickets] = useState<LaundryTicket[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTickets() {
      try {
        const response = await fetch('/api/laundry/tickets', {
          headers: { 'x-tenant-id': 'default-tenant' }
        })
        const data = await response.json()
        if (Array.isArray(data)) {
          setTickets(data)
        }
      } catch (error) {
        console.error('Failed to fetch laundry tickets:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchTickets()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-blue-600">Laundry Customer Service</h2>
          <p className="text-muted-foreground">Manage customer complaints and inquiries.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="mr-2 h-4 w-4" /> Log Complaint
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tickets.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Complaints</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tickets.filter(t => t.status === 'open' && t.type === 'complaint').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tickets.filter(t => t.status === 'resolved').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Inquiries & Complaints</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? (
              <p>Loading cases...</p>
            ) : tickets.length === 0 ? (
              <p className="text-center text-muted-foreground py-10">No customer cases found.</p>
            ) : (
              tickets.map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{ticket.ticketId}: {ticket.subject}</p>
                    <p className="text-xs text-muted-foreground">Customer: {ticket.customer?.name} | Type: {ticket.type}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={ticket.priority === 'high' ? 'destructive' : 'secondary'}>
                      {ticket.priority}
                    </Badge>
                    <Badge variant={ticket.status === 'open' ? 'warning' : 'success'}>
                      {ticket.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
