"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Key, Lock, Eye, EyeOff, Copy, Plus, ShieldAlert } from 'lucide-react'

export function SecretVault() {
  const [secrets] = useState([
    { id: 1, system: 'PostgreSQL Root', username: 'postgres', password: '••••••••••••', updated: '2 days ago' },
    { id: 2, system: 'WiFi Guest Qatar', username: 'guest', password: '••••••••••••', updated: '1 month ago' },
    { id: 3, system: 'AWS IAM Operator', username: 'svc-it-laundry', password: '••••••••••••', updated: '5 days ago' }
  ])
  const [visible, setVisible] = useState<Record<number, boolean>>({})

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2 text-slate-900">
            <Lock className="h-8 w-8" /> Secret Vault
          </h2>
          <p className="text-slate-500 font-medium">Encrypted storage for administrative credentials.</p>
        </div>
        <Button className="bg-slate-900 font-bold">
          <Plus className="mr-2 h-4 w-4" /> Add Secret
        </Button>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3 shadow-sm">
        <ShieldAlert className="h-5 w-5 text-amber-600 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-amber-800">Security Audit Active</p>
          <p className="text-xs text-amber-700 font-medium">Every credential access is logged and linked to your session for industrial compliance.</p>
        </div>
      </div>

      <div className="grid gap-4">
        {secrets.map((secret) => (
          <Card key={secret.id} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                    <Key className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{secret.system}</h3>
                    <p className="text-xs text-slate-500 font-medium">Modified {secret.updated}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Username</p>
                    <p className="text-sm font-mono font-bold bg-slate-50 px-2 rounded border border-slate-100">{secret.username}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Password</p>
                    <p className="text-sm font-mono font-bold bg-slate-50 px-2 rounded border border-slate-100">
                      {visible[secret.id] ? 'Admin@123!' : '••••••••••••'}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => setVisible(v => ({...v, [secret.id]: !v[secret.id]}))}>
                      {visible[secret.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
