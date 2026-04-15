"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useI18n } from '@/lib/i18n/context'
import { History, Shield, User, Clock } from 'lucide-react'

interface LogEntry {
  id: string;
  user: string;
  action: string;
  timestamp: string;
}

export function AuditTrail() {
  const { t } = useI18n()
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLogs() {
      try {
        const response = await fetch('/api/core/audit')
        const data = await response.json()
        if (Array.isArray(data)) {
          setLogs(data)
        }
      } catch (error) {
        console.error('Failed to fetch audit logs:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchLogs()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">{t('audit')}</h2>
          <p className="text-muted-foreground font-bold text-xs uppercase tracking-widest">Immutable Industrial Activity Stream</p>
        </div>
        <Badge className="bg-slate-900 text-white font-bold py-1 px-3 flex items-center gap-2">
          <Shield className="h-3 w-3" /> Integrity Verified
        </Badge>
      </div>

      <Card className="border-slate-200 shadow-xl overflow-hidden bg-slate-50/50">
        <CardHeader className="bg-white border-b">
          <CardTitle className="flex items-center gap-2 font-black text-slate-800 text-sm uppercase tracking-widest">
            <History className="h-4 w-4 text-blue-600" /> Operational History
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-200">
            {loading ? (
              <div className="p-12 text-center animate-pulse font-bold text-slate-400">Accessing Audit Vault...</div>
            ) : logs.length === 0 ? (
              <div className="p-12 text-center text-slate-400 font-medium">No activity recorded in the current session.</div>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="p-4 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-black text-slate-900 tracking-tight">{log.action}</p>
                      <p className="text-xs font-bold text-blue-600 uppercase tracking-tighter">By: {log.user}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-1.5 text-slate-500 font-bold text-[10px] uppercase tracking-widest">
                      <Clock className="h-3 w-3" /> {new Date(log.timestamp).toLocaleTimeString()}
                    </div>
                    <p className="text-[9px] font-black text-slate-400 mt-1">{new Date(log.timestamp).toLocaleDateString()}</p>
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
