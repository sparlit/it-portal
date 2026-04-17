"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Lock, User, ShieldCheck } from 'lucide-react'

export default function AdminLoginPage() {
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
        body: JSON.stringify({ username, password, portal: 'admin' })
      })

      if (res.ok) {
        router.push('/portal/admin')
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
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <div className="bg-red-600 p-3 rounded-2xl inline-block mb-4 shadow-xl shadow-red-900/20">
          <ShieldCheck className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight uppercase">System Sentinel</h1>
        <p className="text-slate-400 mt-2 font-mono text-xs uppercase tracking-widest">Global Governance Root</p>
      </div>

      <Card className="w-full max-w-md border-red-900/50 bg-slate-900 text-slate-100 shadow-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Admin Authentication</CardTitle>
          <CardDescription className="text-slate-400 text-center">
            Restricted Access. All attempts are logged via Audit-V2.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-red-500">Root Identity</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-slate-500 z-10" />
                <Input
                  type="text"
                  value={username}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                  className="pl-10 h-12 bg-slate-800 border-slate-700 text-white focus-visible:ring-red-600"
                  placeholder="admin"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-red-500">Cipher Key</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500 z-10" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  className="pl-10 h-12 bg-slate-800 border-slate-700 text-white focus-visible:ring-red-600"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded bg-red-900/20 border border-red-900/50 text-red-400 text-xs font-medium">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-6 uppercase tracking-widest"
              disabled={loading}
            >
              {loading ? 'Authorizing...' : 'Elevate Session'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 border-t border-slate-800 pt-6">
          <p className="text-[10px] text-slate-600 text-center uppercase tracking-tighter">
            Level 5 Encryption Active • DOH-ROOT-NODE
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
