"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Plus, X } from 'lucide-react'

export function UserProvisioningForm({ onComplete }: { onComplete: () => void }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    email: '',
    role: 'MANAGER',
  })
  const [portals, setPortals] = useState<string[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const portalPermissions = portals.reduce((acc, p) => ({ ...acc, [p]: ['manage'] }), {})
      const res = await fetch('/api/core/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, portalPermissions })
      })
      if (res.ok) onComplete()
    } finally {
      setLoading(false)
    }
  }

  const togglePortal = (p: string) => {
    setPortals(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])
  }

  const portalList = ['it', 'laundry', 'crm', 'maintenance', 'stores', 'transport', 'production']

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle>System Provisioning</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
                placeholder="Full Name"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                required
            />
            <Input
                placeholder="Username"
                value={formData.username}
                onChange={e => setFormData({...formData, username: e.target.value})}
                required
            />
            <Input
                type="password"
                placeholder="Cipher Key (Password)"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                required
            />
            <select
                className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm"
                value={formData.role}
                onChange={e => setFormData({...formData, role: e.target.value})}
            >
                <option value="MANAGER">MANAGER</option>
                <option value="OPERATOR">OPERATOR</option>
                <option value="ADMIN">ADMIN</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-500">Authorized Portals</label>
            <div className="flex flex-wrap gap-2">
                {portalList.map(p => (
                    <Button
                        key={p}
                        type="button"
                        variant={portals.includes(p) ? "default" : "outline"}
                        size="sm"
                        className="text-[10px] uppercase font-black"
                        onClick={() => togglePortal(p)}
                    >
                        {p}
                    </Button>
                ))}
            </div>
          </div>

          <Button type="submit" className="w-full bg-slate-900 text-white" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
            Commit Identity
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
