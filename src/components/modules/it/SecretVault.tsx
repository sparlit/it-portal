"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Key, Lock, Eye, EyeOff, Copy, Plus, ShieldAlert } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'

export function SecretVault() {
  const { t } = useI18n();
  const [secrets, setSecrets] = useState<any[]>([])
  const [visible, setVisible] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSecrets() {
      try {
        const response = await fetch('/api/it/vault')
        const data = await response.json()
        if (Array.isArray(data)) {
          setSecrets(data)
        }
      } catch (error) {
        console.error('Failed to fetch secrets:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchSecrets()
  }, [])

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2 text-slate-900">
            <Lock className="h-8 w-8 text-blue-600" /> {t('it_vault')}
          </h2>
          <p className="text-slate-500 font-medium">Encrypted storage for administrative credentials.</p>
        </div>
        <Button className="bg-slate-900 font-bold hover:bg-slate-800 shadow-lg transition-all">
          <Plus className="mr-2 h-4 w-4" /> Add Secret
        </Button>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3 shadow-sm">
        <ShieldAlert className="h-5 w-5 text-blue-600 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-blue-900">Industrial Security Audit Active</p>
          <p className="text-xs text-blue-700 font-medium">Every credential access is logged and linked to your session for industrial compliance.</p>
        </div>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <p className="text-center py-12 animate-pulse text-slate-400 font-bold uppercase tracking-widest">Accessing Secure Node...</p>
        ) : secrets.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
             <Lock className="h-12 w-12 text-slate-200 mx-auto mb-4" />
             <p className="text-slate-400 font-bold">No administrative secrets stored.</p>
          </div>
        ) : (
          secrets.map((secret) => (
            <Card key={secret.id} className="border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all group">
              <CardContent className="p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-100 rounded-xl text-slate-600 group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-inner">
                      <Key className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-lg">{secret.system}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-tighter">Credential Level: Classified</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-6 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="text-right px-2 border-r border-slate-200">
                      <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Username</p>
                      <p className="text-sm font-mono font-bold text-slate-700">{secret.username}</p>
                    </div>
                    <div className="text-right px-2">
                      <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Password</p>
                      <p className="text-sm font-mono font-bold text-slate-700">
                        {visible[secret.id] ? secret.password : '••••••••••••'}
                      </p>
                    </div>
                    <div className="flex gap-1 ml-auto">
                      <Button variant="ghost" size="icon" className="hover:bg-white" onClick={() => setVisible(v => ({...v, [secret.id]: !v[secret.id]}))}>
                        {visible[secret.id] ? <EyeOff className="h-4 w-4 text-blue-600" /> : <Eye className="h-4 w-4 text-slate-400" />}
                      </Button>
                      <Button variant="ghost" size="icon" className="hover:bg-white">
                        <Copy className="h-4 w-4 text-slate-400" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
