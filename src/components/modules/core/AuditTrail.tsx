"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { History, ShieldCheck, User, Activity } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'

export function AuditTrail() {
  const { t } = useI18n()
  const [logs, setLogs] = useState<any[]>([])
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
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">{t('audit')}</h2>
          <p className="text-slate-500 font-medium">Immutable log of administrative and operational actions.</p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full border border-green-200 shadow-sm">
          <ShieldCheck className="h-4 w-4" />
          <span className="text-xs font-black uppercase tracking-widest">Compliance Active</span>
        </div>
      </div>

      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50 border-b">
          <CardTitle className="flex items-center gap-2 font-bold text-slate-800">
            <History className="h-5 w-5 text-blue-600" /> Activity Stream
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="text-left p-4 font-bold text-slate-500 uppercase tracking-widest text-[10px]">{t('timestamp')}</th>
                  <th className="text-left p-4 font-bold text-slate-500 uppercase tracking-widest text-[10px]">{t('user')}</th>
                  <th className="text-left p-4 font-bold text-slate-500 uppercase tracking-widest text-[10px]">{t('action')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr><td colSpan={3} className="p-8 text-center animate-pulse text-slate-400 font-bold">{t('loading')}</td></tr>
                ) : logs.length === 0 ? (
                  <tr><td colSpan={3} className="p-8 text-center text-slate-400 font-medium">No activity recorded yet.</td></tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 transition-colors font-medium">
                      <td className="p-4 font-mono text-xs text-slate-500 whitespace-nowrap font-bold">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 font-black text-slate-900">
                          <User className="h-3 w-3 text-slate-400" />
                          {log.user}
                        </div>
                      </td>
                      <td className="p-4 text-slate-700">
                        <div className="flex items-center gap-2">
                          <Activity className="h-3 w-3 text-blue-500" />
                          {log.action}
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
