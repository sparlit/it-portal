"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Key, Lock, Eye, EyeOff, Copy, Plus, ShieldAlert, Loader2 } from 'lucide-react'

export function SecretVault() {
  const [secrets, setSecrets] = useState<any[]>([])
  const [visible, setVisible] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    system: '',
    username: '',
    password: ''
  })

  async function fetchSecrets() {
    setLoading(true)
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

  useEffect(() => {
    fetchSecrets()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/it/vault', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        setIsDialogOpen(false)
        setFormData({ system: '', username: '', password: '' })
        fetchSecrets()
      }
    } catch (error) {
      console.error('Failed to create secret:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2 text-slate-900">
            <Lock className="h-8 w-8" /> Secret Vault
          </h2>
          <p className="text-slate-500 font-medium">Encrypted storage for administrative credentials.</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-slate-900 font-bold">
              <Plus className="mr-2 h-4 w-4" /> Add Secret
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Administrative Secret</DialogTitle>
              <DialogDescription>
                Credentials will be encrypted with AES-256-CBC before storage.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="system" className="text-right">System</Label>
                <Input
                  id="system"
                  value={formData.system}
                  onChange={(e) => setFormData({ ...formData, system: e.target.value })}
                  className="col-span-3"
                  placeholder="e.g. Core Database"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="user" className="text-right">Username</Label>
                <Input
                  id="user"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="pass" className="text-right">Password</Label>
                <Input
                  id="pass"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="col-span-3"
                  required
                />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Encrypt & Save
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3 shadow-sm">
        <ShieldAlert className="h-5 w-5 text-amber-600 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-amber-800">Security Audit Active</p>
          <p className="text-xs text-amber-700 font-medium">Every credential access is logged and linked to your session for industrial compliance.</p>
        </div>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <p className="text-center py-12 animate-pulse text-slate-400">Accessing Encrypted Storage...</p>
        ) : secrets.length === 0 ? (
          <p className="text-center py-12 text-slate-400">No administrative secrets stored.</p>
        ) : (
          secrets.map((secret) => (
            <Card key={secret.id} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                      <Key className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{secret.system}</h3>
                      <p className="text-xs text-slate-500 font-medium">Credential Level: High</p>
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
                        {visible[secret.id] ? secret.password : '••••••••••••'}
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
          ))
        )}
      </div>
    </div>
  )
}
