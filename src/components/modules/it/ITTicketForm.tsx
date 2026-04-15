"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ShieldAlert, Send } from 'lucide-react'

export function ITTicketForm({ onSuccess }: { onSuccess: () => void }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [requester, setRequester] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Industrial Validation
    if (title.length < 5) {
      setError('Title must be at least 5 characters')
      return
    }
    if (requester.length < 3) {
      setError('Requester name must be at least 3 characters')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/it/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, requester })
      })
      if (response.ok) {
        setTitle('')
        setDescription('')
        setRequester('')
        onSuccess()
      } else {
        setError('Failed to transmit ticket to HQ')
      }
    } catch (error) {
      console.error('Failed to create ticket:', error)
      setError('Network communication failure')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 border border-slate-800 p-6 rounded-xl bg-slate-900 text-slate-100 shadow-2xl">
      <div className="flex items-center gap-2 mb-2">
        <ShieldAlert className="h-5 w-5 text-blue-500" />
        <h3 className="text-lg font-black uppercase tracking-tighter">New Incident Report</h3>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title" className="text-xs font-black uppercase tracking-widest text-slate-400">Issue Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., L3 Switch Failure"
          className="bg-slate-800 border-slate-700 focus:ring-blue-500"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="requester" className="text-xs font-black uppercase tracking-widest text-slate-400">Officer Name</Label>
        <Input
          id="requester"
          value={requester}
          onChange={(e) => setRequester(e.target.value)}
          placeholder="e.g., Operator-77"
          className="bg-slate-800 border-slate-700 focus:ring-blue-500"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-xs font-black uppercase tracking-widest text-slate-400">Operational Intel (Optional)</Label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Provide technical details..."
          className="flex min-h-[80px] w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm ring-offset-slate-950 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      {error && (
        <div className="text-[10px] font-bold text-red-400 uppercase tracking-widest p-2 bg-red-900/20 border border-red-900/50 rounded">
          ERROR: {error}
        </div>
      )}

      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest h-12" disabled={loading}>
        {loading ? 'Transmitting...' : (
          <span className="flex items-center gap-2">
            <Send className="h-4 w-4" /> Dispatch Ticket
          </span>
        )}
      </Button>
    </form>
  )
}
