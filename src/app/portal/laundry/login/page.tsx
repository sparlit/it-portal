"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Lock, User, Waves } from 'lucide-react'

export default function LaundryLoginPage() {
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
        body: JSON.stringify({ username, password, portal: 'laundry' })
      })

      if (res.ok) {
        router.push('/portal/laundry')
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
    <div className="min-h-screen bg-blue-600 flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center text-white">
        <div className="bg-white p-4 rounded-full inline-block mb-4 shadow-2xl text-blue-600">
          <Waves className="h-12 w-12" />
        </div>
        <h1 className="text-4xl font-black tracking-tighter uppercase italic">Precision Cleaning</h1>
        <p className="text-blue-100 font-bold text-xs uppercase tracking-[0.2em] mt-2">Laundry Management Suite</p>
      </div>

      <Card className="w-full max-w-md border-none bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] rounded-[2rem] overflow-hidden">
        <CardHeader className="pt-10 text-center">
          <CardTitle className="text-2xl font-black text-blue-900">Portal Access</CardTitle>
          <CardDescription className="text-slate-500">
            Secure login for operations and logistics.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-10">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Work ID</label>
              <div className="relative">
                <User className="absolute left-4 top-4 h-4 w-4 text-blue-400 z-10" />
                <Input
                  type="text"
                  value={username}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                  className="pl-12 h-14 bg-slate-50 border-transparent focus-visible:ring-blue-600 rounded-2xl transition-all"
                  placeholder="operator.lnd"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Security Key</label>
              <div className="relative">
                <Lock className="absolute left-4 top-4 h-4 w-4 text-blue-400 z-10" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  className="pl-12 h-14 bg-slate-50 border-transparent focus-visible:ring-blue-600 rounded-2xl transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-2xl bg-red-50 text-red-600 text-xs font-bold text-center border border-red-100">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-8 text-xl rounded-2xl transition-all shadow-xl hover:shadow-blue-600/30 active:scale-[0.97]"
              disabled={loading}
            >
              {loading ? 'Entering...' : 'Log In'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center py-6 bg-slate-50">
           <p className="text-[10px] text-slate-400 font-mono italic uppercase">Al Rayes Laundry & Dry Cleaning</p>
        </CardFooter>
      </Card>
    </div>
  )
}
