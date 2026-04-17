"use client"

import { useState, useEffect } from 'react'
import { Bell, Check, Info, AlertTriangle, XCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isOpen) fetchNotifications()
  }, [isOpen])

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/core/notifications')
      const data = await res.json()
      if (Array.isArray(data)) setNotifications(data)
    } finally {
      setLoading(false)
    }
  }

  const markRead = async (id: string) => {
     await fetch('/api/core/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
     })
     setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n))
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative hover:bg-slate-100 dark:hover:bg-slate-800"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 h-4 w-4 bg-red-600 text-[10px] font-bold text-white rounded-full flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 md:w-96 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <Card className="shadow-2xl border-2">
            <CardHeader className="py-3 border-b flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-black uppercase tracking-widest">Live Alert Stream</CardTitle>
              <Badge variant="outline" className="text-[10px]">REAL-TIME</Badge>
            </CardHeader>
            <CardContent className="p-0 max-h-[400px] overflow-y-auto">
              {loading ? (
                <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-slate-300" /></div>
              ) : (
                <div className="divide-y">
                  {notifications.length === 0 && <div className="p-8 text-center text-slate-400 text-xs font-medium uppercase italic">No active notifications</div>}
                  {notifications.map(n => (
                    <div
                      key={n.id}
                      className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer relative ${!n.isRead ? 'bg-blue-50/30' : ''}`}
                      onClick={() => markRead(n.id)}
                    >
                      <div className="flex gap-3">
                         <div className={`mt-1 h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                            n.type === 'success' ? 'bg-emerald-100 text-emerald-600' :
                            n.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                            n.type === 'error' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                         }`}>
                            {n.type === 'success' ? <Check className="h-4 w-4" /> :
                             n.type === 'warning' ? <AlertTriangle className="h-4 w-4" /> :
                             n.type === 'error' ? <XCircle className="h-4 w-4" /> : <Info className="h-4 w-4" />}
                         </div>
                         <div className="flex-1 min-w-0">
                            <p className={`text-xs font-bold truncate ${!n.isRead ? 'text-slate-900' : 'text-slate-500'}`}>{n.title}</p>
                            <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2">{n.message}</p>
                            <p className="text-[9px] text-slate-400 mt-2 font-mono">{new Date(n.createdAt).toLocaleTimeString()}</p>
                         </div>
                      </div>
                      {!n.isRead && <div className="absolute right-4 top-4 h-2 w-2 rounded-full bg-blue-600" />}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
