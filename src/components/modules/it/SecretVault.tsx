"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Key,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Copy,
  Plus,
  ShieldAlert
} from 'lucide-react'

export function SecretVault() {
  const [secrets, setSecrets] = useState<any[]>([
    { id: 1, system: 'PostgreSQL Root', username: 'postgres', password: '••••••••••••', lastUpdated: '2 days ago' },
    { id: 2, system: 'WiFi Guest Qatar', username: 'guest', password: '••••••••••••', lastUpdated: '1 month ago' },
    { id: 3, system: 'AWS IAM Operator', username: 'svc-it-laundry', password: '••••••••••••', lastUpdated: '5 days ago' }
  ])
  const [showPassword, setShowPassword] = useState<Record<number, boolean>>({})

  const toggleVisibility = (id: number) => {
    setShowPassword(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Lock className="h-8 w-8 text-slate-900" /> Secret Vault
          </h2>
          <p className="text-slate-500">Encrypted storage for administrative credentials and system keys.</p>
        </div>
        <Button className="bg-slate-900">
          <Plus className="mr-2 h-4 w-4" /> Add Secret
        </Button>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
        <ShieldAlert className="h-5 w-5 text-amber-600 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-amber-800">Security Access Logged</p>
          <p className="text-xs text-amber-700">Every secret viewing or copy action is audited and linked to your User ID.</p>
        </div>
      </div>

      <div className="grid gap-4">
        {secrets.map((secret) => (
          <Card key={secret.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex items-center justify-between p-4 bg-white">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-slate-100 rounded text-slate-600">
                    <Key className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{secret.system}</h3>
                    <p className="text-xs text-slate-500">Updated {secret.lastUpdated}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-end mr-4">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Username</p>
                    <p className="text-sm font-mono bg-slate-50 px-2 py-0.5 rounded border">{secret.username}</p>
                  </div>
                  <div className="flex flex-col items-end mr-8">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Password</p>
                    <p className="text-sm font-mono bg-slate-50 px-2 py-0.5 rounded border">
                      {showPassword[secret.id] ? 'AdminPass123!' : '••••••••••••'}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleVisibility(secret.id)}
                    >
                      {showPassword[secret.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
