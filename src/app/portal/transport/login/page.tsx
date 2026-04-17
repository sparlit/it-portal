"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Lock, User, Truck, MapPin } from 'lucide-react'
import { Input } from '@/components/ui/input'

export default function TransportLoginPage() {
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
        body: JSON.stringify({ username, password, portal: 'transport' })
      })

      if (res.ok) {
        router.push('/portal/transport')
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
    <div className="min-h-screen bg-emerald-950 flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center text-white">
        <div className="bg-emerald-500 p-4 rounded-full inline-block mb-4 shadow-xl shadow-emerald-900/40">
          <Truck className="h-12 w-12 text-emerald-950" />
        </div>
        <h1 className="text-4xl font-black tracking-tighter uppercase italic">Transport Command</h1>
        <p className="text-emerald-300/60 font-medium tracking-widest text-xs mt-2 flex items-center justify-center gap-2">
           <MapPin className="h-3 w-3" /> FLEET MONITORING & LOGISTICS
        </p>
      </div>

      <Card className="w-full max-w-md border-emerald-800 bg-emerald-900/50 backdrop-blur-md text-emerald-50 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Driver/Dispatcher Portal</CardTitle>
          <CardDescription className="text-emerald-400/70">
            Secure access for authorized logistics personnel only.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-emerald-500">Fleet ID / Username</label>
              <div className="relative">
                <User className="absolute left-3 top-4 h-4 w-4 text-emerald-500 z-10" />
                <Input
                  type="text"
                  value={username}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                  className="pl-10 h-12 border-2 border-emerald-800 bg-emerald-950/50 text-emerald-50 focus-visible:ring-emerald-500"
                  placeholder="DRIVER_77"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-emerald-500">Passcode</label>
              <div className="relative">
                <Lock className="absolute left-3 top-4 h-4 w-4 text-emerald-500 z-10" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  className="pl-10 h-12 border-2 border-emerald-800 bg-emerald-950/50 text-emerald-50 focus-visible:ring-emerald-500"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded bg-red-950/50 border border-red-500 text-red-200 text-xs font-bold uppercase">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black py-6 rounded-lg text-lg transition-transform active:scale-95"
              disabled={loading}
            >
              {loading ? 'Verifying Route...' : 'Initiate Session'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center border-t border-emerald-800/50 pt-6">
           <p className="text-[10px] text-emerald-600 font-mono">DOH-FLEET-NODE-OSM-v2</p>
        </CardFooter>
      </Card>
    </div>
  )
}
