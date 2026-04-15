"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Lock, User, Cpu } from 'lucide-react'

export default function ITLoginPage() {
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
        body: JSON.stringify({ username, password, portal: 'it' })
      })

      if (res.ok) {
        router.push('/portal/it')
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
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-4">
      <div className="mb-12 text-center">
        <div className="bg-blue-500 p-4 rounded-full inline-block mb-6 shadow-[0_0_30px_rgba(59,130,246,0.5)]">
          <Cpu className="h-10 w-10 text-white animate-pulse" />
        </div>
        <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">Infrastructure Command</h1>
        <p className="text-blue-500 font-mono text-[10px] uppercase tracking-[0.5em] mt-3">Elite IT Operations Portal</p>
      </div>

      <Card className="w-full max-w-md border-blue-900/30 bg-[#0f172a]/80 backdrop-blur-xl text-white shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-2xl overflow-hidden">
        <CardHeader className="text-center pt-8">
          <CardTitle className="text-xl font-bold uppercase tracking-widest text-blue-400">Secure Gateway</CardTitle>
          <CardDescription className="text-slate-500">
            Biometric & Credential Handshake Required
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Identity UID</label>
              <div className="relative">
                <User className="absolute left-4 top-4 h-4 w-4 text-blue-500 z-10" />
                <Input
                  type="text"
                  value={username}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                  className="pl-12 h-14 bg-slate-900/50 border-blue-900/20 text-white focus-visible:ring-blue-500 rounded-xl"
                  placeholder="admin.root"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Access Cipher</label>
              <div className="relative">
                <Lock className="absolute left-4 top-4 h-4 w-4 text-blue-500 z-10" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  className="pl-12 h-14 bg-slate-900/50 border-blue-900/20 text-white focus-visible:ring-blue-500 rounded-xl"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-950/30 border border-red-900/50 text-red-400 text-xs font-bold rounded-xl animate-shake">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-8 text-lg rounded-xl transition-all shadow-lg hover:shadow-blue-500/20"
              disabled={loading}
            >
              {loading ? 'Decrypting...' : 'Authorize Access'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center py-6 bg-slate-900/50 border-t border-blue-900/10">
           <p className="text-[8px] text-slate-600 font-mono uppercase tracking-[0.2em]">Infrastructure Qatar • Node DOH-77-V2</p>
        </CardFooter>
      </Card>
    </div>
  )
}
