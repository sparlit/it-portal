"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, MessageSquare, AlertCircle, CheckCircle } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'

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
  const { t } = useI18n()
  const [tickets, setTickets] = useState<LaundryTicket[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTickets() {
      try {
        const response = await fetch('/api/laundry/tickets')
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
          <h2 className="text-3xl font-bold tracking-tight text-blue-600">{t('laundry_cs')}</h2>
          <p className="text-muted-foreground font-medium">Manage customer complaints and inquiries.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
          <Plus className="mr-2 h-4 w-4" /> {t('new_ticket')}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500">Active Cases</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-slate-900">{tickets.length}</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500">Pending Complaints</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-slate-900">
              {tickets.filter(t => t.status === 'open' && t.type === 'complaint').length}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500">Resolved Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-slate-900">
              {tickets.filter(t => t.status === 'resolved').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50 border-b">
          <CardTitle className="font-bold text-slate-800">Customer Inquiries & Complaints</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {loading ? (
              <p className="p-8 text-center animate-pulse text-slate-400 font-bold">{t('loading')}</p>
            ) : tickets.length === 0 ? (
              <p className="text-center text-slate-400 py-10 font-medium">{t('no_tickets')}</p>
            ) : (
              tickets.map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-900 leading-none">{ticket.ticketId}: {ticket.subject}</p>
                    <p className="text-xs text-slate-500 font-medium">Customer: {ticket.customer?.name} | Type: {ticket.type}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={ticket.priority === 'high' ? 'destructive' : 'secondary'} className="font-bold uppercase text-[10px] tracking-widest">
                      {ticket.priority}
                    </Badge>
                    <Badge variant={ticket.status === 'open' ? 'warning' : 'success'} className="font-bold uppercase text-[10px] tracking-widest">
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
