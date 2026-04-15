"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Lock, User, Users } from 'lucide-react'

export default function CRMLoginPage() {
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
        body: JSON.stringify({ username, password, portal: 'crm' })
      })

      if (res.ok) {
        router.push('/portal/crm')
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
    <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center text-blue-900">
        <div className="bg-blue-600 p-4 rounded-full inline-block mb-4 shadow-lg text-white">
          <Users className="h-12 w-12" />
        </div>
        <h1 className="text-3xl font-black tracking-tight uppercase">Client Growth Hub</h1>
        <p className="text-blue-600/60 font-medium text-xs uppercase tracking-widest mt-2">CRM & Sales Intelligence</p>
      </div>

      <Card className="w-full max-w-md border-blue-100 bg-white shadow-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-blue-900">Agent Login</CardTitle>
          <CardDescription>
            Secure access to sales pipelines and customer 360 views.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-blue-800">Agent ID</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-blue-300 z-10" />
                <Input
                  type="text"
                  value={username}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                  className="pl-10 h-12 border-blue-100 focus-visible:ring-blue-600"
                  placeholder="agent.name"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-blue-800">Security Cipher</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-blue-300 z-10" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  className="pl-10 h-12 border-blue-100 focus-visible:ring-blue-600"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 text-lg rounded-xl transition-all active:scale-95"
              disabled={loading}
            >
              {loading ? 'Authenticating...' : 'Enter Hub'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center border-t border-blue-50 pt-6">
           <p className="text-[10px] text-blue-300 font-mono uppercase tracking-widest">TSysLab Industrial Growth Node</p>
        </CardFooter>
      </Card>
    </div>
  )
}
