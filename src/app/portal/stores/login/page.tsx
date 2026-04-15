"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Lock, User, Box, ShoppingCart } from 'lucide-react'
import { Input } from '@/components/ui/input'

export default function StoresLoginPage() {
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
        body: JSON.stringify({ username, password, portal: 'stores' })
      })

      if (res.ok) {
        router.push('/portal/stores')
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
        <div className="bg-orange-500 p-4 rounded-xl inline-block mb-4 shadow-lg">
          <Box className="h-12 w-12 text-white" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Stores & Procurement</h1>
        <p className="text-slate-500 font-medium">Inventory & Supply Chain Management</p>
      </div>

      <Card className="w-full max-w-md border-slate-200 bg-white shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Warehouse Access</CardTitle>
          <CardDescription>
            Enter your credentials to manage inventory and requisitions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Staff ID</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-slate-400 z-10" />
                <Input
                  type="text"
                  value={username}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                  className="pl-10 h-12"
                  placeholder="EMP-ST-123"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Security Key</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400 z-10" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  className="pl-10 h-12"
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
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-6"
              disabled={loading}
            >
              {loading ? 'Authenticating...' : 'Enter Warehouse'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-between items-center text-[10px] text-slate-400 border-t pt-4">
           <span className="flex items-center gap-1 font-mono uppercase"><ShoppingCart className="h-3 w-3" /> Supply-V3</span>
           <span className="uppercase tracking-widest">TSysLab Industrial</span>
        </CardFooter>
      </Card>
    </div>
  )
}
