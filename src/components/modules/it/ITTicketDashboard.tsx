"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Ticket, Clock, CheckCircle2, ChevronRight } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'

interface ITTicket {
  id: string;
  ticketId: string;
  title: string;
  requester: string;
  priority: string;
  status: string;
  createdAt: string;
}

export function ITTicketDashboard() {
  const { t } = useI18n()
  const [tickets, setTickets] = useState<ITTicket[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTickets() {
      try {
        const response = await fetch('/api/it/tickets')
        const data = await response.json()
        if (Array.isArray(data)) {
          setTickets(data)
        }
      } catch (error) {
        console.error('Failed to fetch tickets:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchTickets()
  }, [])

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-50 text-red-700 border-red-200'
      case 'high': return 'bg-orange-50 text-orange-700 border-orange-200'
      case 'medium': return 'bg-blue-50 text-blue-700 border-blue-200'
      default: return 'bg-slate-50 text-slate-700 border-slate-200'
    }
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'open': return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'resolved': return 'bg-green-50 text-green-700 border-green-200'
      default: return 'bg-slate-50 text-slate-700 border-slate-200'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">{t('it_support')}</h2>
          <p className="text-muted-foreground font-medium">{t('it_support_subtitle')}</p>
        </div>
        <Button className="bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-lg">
          <Plus className="mr-2 h-4 w-4" /> {t('new_ticket')}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500">{t('total_tickets')}</CardTitle>
            <Ticket className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-slate-900">{tickets.length}</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500">{t('open_tickets')}</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-slate-900">
              {tickets.filter(t => t.status === 'open').length}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500">{t('resolved_tickets')}</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
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
          <CardTitle className="font-bold text-slate-800">{t('recent_tickets')}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="text-left p-4 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Ticket ID</th>
                  <th className="text-left p-4 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Title</th>
                  <th className="text-left p-4 font-bold text-slate-500 uppercase tracking-widest text-[10px]">{t('user')}</th>
                  <th className="text-left p-4 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Priority</th>
                  <th className="text-left p-4 font-bold text-slate-500 uppercase tracking-widest text-[10px]">{t('status')}</th>
                  <th className="text-right p-4 font-bold text-slate-500 uppercase tracking-widest text-[10px]">{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr><td colSpan={6} className="p-8 text-center animate-pulse text-slate-400 font-bold">{t('loading')}</td></tr>
                ) : tickets.length === 0 ? (
                  <tr><td colSpan={6} className="p-8 text-center text-slate-400 font-medium">{t('no_tickets')}</td></tr>
                ) : (
                  tickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-black text-slate-900">{ticket.ticketId}</td>
                      <td className="p-4 font-bold text-slate-800">{ticket.title}</td>
                      <td className="p-4 text-slate-600 font-medium">{ticket.requester}</td>
                      <td className="p-4">
                        <Badge variant="outline" className={`font-black uppercase text-[10px] tracking-widest ${getPriorityStyle(ticket.priority)}`}>
                          {ticket.priority}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline" className={`font-black uppercase text-[10px] tracking-widest ${getStatusStyle(ticket.status)}`}>
                          {ticket.status}
                        </Badge>
                      </td>
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
