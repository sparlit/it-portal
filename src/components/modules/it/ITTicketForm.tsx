"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function ITTicketForm({ onSuccess }: { onSuccess: () => void }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [requester, setRequester] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch('/api/it/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, requester })
      })
      if (response.ok) {
        onSuccess()
      }
    } catch (error) {
      console.error('Failed to create ticket:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded-lg bg-card">
      <div className="space-y-2">
        <Label htmlFor="title">Issue Title</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Printer not working" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="requester">Requester Name</Label>
        <Input id="requester" value={requester} onChange={(e) => setRequester(e.target.value)} placeholder="e.g., John Doe" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Provide more details..." />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Submitting...' : 'Create Ticket'}
      </Button>
    </form>
  )
}
