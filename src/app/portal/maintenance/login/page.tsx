"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Lock, User, Hammer } from 'lucide-react'

export default function MaintenanceLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/core/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, portal: 'maintenance' })
      })

      if (res.ok) {
        router.push('/portal/maintenance')
      } else {
        const data = await res.json()
        setError(data.error || 'Login failed')
      }
    } catch (err) {
      setError('A network error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center text-slate-900">
        <div className="bg-slate-900 p-4 rounded-2xl inline-block mb-4 shadow-lg text-white">
          <Hammer className="h-12 w-12" />
        </div>
        <h1 className="text-3xl font-black tracking-tight">Maintenance Hub</h1>
        <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em] mt-2">Asset Reliability & Engineering</p>
      </div>

      <Card className="w-full max-w-md border-slate-200 bg-white shadow-2xl rounded-3xl overflow-hidden">
        <CardHeader className="bg-slate-50 border-b">
          <CardTitle className="text-xl font-bold">Technician Authentication</CardTitle>
          <CardDescription>
            Elevated access for facility management and repairs.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Staff Credentials</label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 h-4 w-4 text-slate-400 z-10" />
                <Input
                  type="text"
                  value={username}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                  className="pl-10 h-14 border-slate-200 bg-slate-50/50 rounded-xl focus-visible:ring-slate-950"
                  placeholder="ENG-DOH-01"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Authorization Key</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-4 w-4 text-slate-400 z-10" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  className="pl-10 h-14 border-slate-200 bg-slate-50/50 rounded-xl focus-visible:ring-slate-950"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-bold">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-slate-900 hover:bg-black text-white font-black py-8 text-lg rounded-2xl transition-all shadow-xl hover:shadow-slate-900/20 active:scale-[0.98]"
              disabled={loading}
            >
              {loading ? 'Decrypting Access...' : 'Open Terminal'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center py-6 bg-slate-50 border-t">
           <p className="text-[10px] text-slate-400 font-mono italic">Reliability Node Qatar V2.0</p>
        </CardFooter>
      </Card>
    </div>
  )
}
