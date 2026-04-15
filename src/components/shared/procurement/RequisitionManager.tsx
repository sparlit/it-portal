"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ClipboardList, Plus, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'

export function RequisitionManager() {
  const [requisitions, setRequisitions] = useState<any[]>([])
  const [items, setItems] = useState([{ id: '1', description: '', quantity: 1 }])
  const [department, setDepartment] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchRequisitions()
  }, [])

  const fetchRequisitions = async () => {
    try {
      const res = await fetch('/api/procurement/requisitions')
      const data = await res.json()
      setRequisitions(data)
    } finally {
      setLoading(false)
    }
  }

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), description: '', quantity: 1 }])
  }

  const updateItem = (id: string, field: string, value: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item))
  }

  const submitRequisition = async () => {
    if (!department || items.some(i => !i.description)) {
        alert("Please fill all fields")
        return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/procurement/requisitions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ department, items, priority: 'normal' })
      })
      if (res.ok) {
          setItems([{ id: '1', description: '', quantity: 1 }])
          fetchRequisitions()
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <ClipboardList className="h-6 w-6 text-blue-600" />
              New Indent / Requisition
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-slate-600">Originating Department</label>
                <input
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                  placeholder="e.g. Transport, IT, Production"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                />
             </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-slate-800">Requested Items</h3>
            <div className="border rounded-xl overflow-hidden">
               <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left">Description</th>
                      <th className="px-4 py-3 text-left w-32">Qty</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-2">
                           <input
                             className="w-full bg-transparent outline-none border rounded px-2 py-1"
                             placeholder="Item name..."
                             value={item.description}
                             onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                           />
                        </td>
                        <td className="px-4 py-2">
                           <input
                             type="number"
                             className="w-full bg-transparent outline-none border rounded px-2 py-1"
                             value={item.quantity}
                             onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value))}
                           />
                        </td>
                        <td className="px-4 py-2 text-right">
                           <Button variant="ghost" size="sm" onClick={() => setItems(items.filter(i => i.id !== item.id))}>Remove</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>
            <Button variant="outline" size="sm" onClick={addItem}>Add Line</Button>
          </div>

          <div className="flex justify-end gap-3 border-t pt-6">
             <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2" onClick={submitRequisition} disabled={submitting}>
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Submit Requisition
             </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
           <CardTitle className="text-lg font-bold">Recent History</CardTitle>
        </CardHeader>
        <CardContent>
           {loading ? <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-slate-300" /></div> : (
              <div className="space-y-2">
                 {requisitions.map(req => (
                    <div key={req.id} className="p-4 border rounded-xl flex items-center justify-between">
                       <div>
                          <div className="font-bold">{req.requisitionNo}</div>
                          <div className="text-xs text-slate-500">{req.department} • {req.items.length} items</div>
                       </div>
                       <Badge variant="outline" className="capitalize">
                          {req.status.replace('_', ' ')}
                       </Badge>
                    </div>
                 ))}
              </div>
           )}
        </CardContent>
      </Card>
    </div>
  )
}
