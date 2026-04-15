"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Lock, User, Factory } from 'lucide-react'

export default function ProductionLoginPage() {
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
        body: JSON.stringify({ username, password, portal: 'production' })
      })

      if (res.ok) {
        router.push('/portal/production')
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
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center text-white">
        <div className="bg-white p-4 rounded-3xl inline-block mb-4 shadow-2xl text-slate-900 transform -rotate-3">
          <Factory className="h-12 w-12" />
        </div>
        <h1 className="text-4xl font-black tracking-tighter uppercase italic">Production Command</h1>
        <p className="text-slate-400 font-medium text-xs uppercase tracking-[0.3em] mt-2">Industrial Process Control</p>
      </div>

      <Card className="w-full max-w-md border-slate-700 bg-slate-800 text-white shadow-2xl rounded-none border-t-4 border-t-blue-500">
        <CardHeader>
          <CardTitle className="text-2xl font-black italic">Station Login</CardTitle>
          <CardDescription className="text-slate-500">
            Authorized production personnel and QC officers only.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-blue-500">Operator ID</label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 h-4 w-4 text-slate-600 z-10" />
                <Input
                  type="text"
                  value={username}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                  className="pl-10 h-14 border-slate-700 bg-slate-900 text-white focus-visible:ring-blue-500 rounded-none"
                  placeholder="OP-77"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-blue-500">Station Key</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-4 w-4 text-slate-600 z-10" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  className="pl-10 h-14 border-slate-700 bg-slate-900 text-white focus-visible:ring-blue-500 rounded-none"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-950 border border-red-900 text-red-500 text-xs font-black uppercase italic">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-8 text-xl rounded-none transition-all shadow-lg active:translate-y-1"
              disabled={loading}
            >
              {loading ? 'Initiating Link...' : 'Start Session'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-end border-t border-slate-700/50 py-4 px-6 bg-slate-900/50">
           <p className="text-[10px] text-slate-600 font-mono italic">Production Control Qatar • V2.0</p>
        </CardFooter>
      </Card>
    </div>
  )
}
