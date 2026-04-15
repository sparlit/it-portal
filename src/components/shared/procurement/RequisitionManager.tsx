"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ClipboardList, Plus, Send, CheckCircle2, AlertCircle } from 'lucide-react'

export function RequisitionManager() {
  const [items, setItems] = useState([{ id: '1', description: '', quantity: 1 }])
  const [department, setDepartment] = useState('')

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), description: '', quantity: 1 }])
  }

  const updateItem = (id: string, field: string, value: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item))
  }

  const submitRequisition = async () => {
    // Logic to send to /api/procurement/requisitions
    alert("Requisition submitted for multi-level approval.")
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <ClipboardList className="h-6 w-6 text-blue-600" />
              Departmental Indent / Requisition
            </CardTitle>
            <p className="text-sm text-slate-500">Request items from stores or initiate a new purchase.</p>
          </div>
          <Badge variant="outline" className="bg-blue-50 text-blue-700">STORES-V2</Badge>
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
             <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-slate-600">Priority Level</label>
                <select className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm">
                   <option>Normal</option>
                   <option>Urgent</option>
                   <option>Critical (Operational Stopper)</option>
                </select>
             </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
               Requested Items
            </h3>
            <div className="border rounded-xl overflow-hidden">
               <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left">Description / SKU</th>
                      <th className="px-4 py-3 text-left w-32">Quantity</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-2">
                           <input
                             className="w-full bg-transparent outline-none focus:ring-1 ring-blue-500 rounded px-2 py-1"
                             placeholder="Enter item name or SKU..."
                             value={item.description}
                             onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                           />
                        </td>
                        <td className="px-4 py-2">
                           <input
                             type="number"
                             className="w-full bg-transparent outline-none focus:ring-1 ring-blue-500 rounded px-2 py-1"
                             value={item.quantity}
                             onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value))}
                           />
                        </td>
                        <td className="px-4 py-2 text-right">
                           <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50" onClick={() => setItems(items.filter(i => i.id !== item.id))}>Remove</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>
            <Button variant="outline" size="sm" className="gap-2" onClick={addItem}>
               <Plus className="h-4 w-4" /> Add Line Item
            </Button>
          </div>

          <div className="flex justify-end gap-3 border-t pt-6">
             <Button variant="ghost">Save Draft</Button>
             <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2" onClick={submitRequisition}>
                <Send className="h-4 w-4" /> Submit for Approval
             </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <Card>
            <CardHeader>
               <CardTitle className="text-lg">Approval Workflow</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="space-y-4">
                  <div className="flex items-center gap-3">
                     <CheckCircle2 className="h-5 w-5 text-green-500" />
                     <div className="text-sm">
                        <p className="font-bold">Dept. Head Approval</p>
                        <p className="text-slate-500 text-xs">Awaiting action</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-3">
                     <AlertCircle className="h-5 w-5 text-slate-300" />
                     <div className="text-sm">
                        <p className="font-bold text-slate-400">Stores Availability Check</p>
                        <p className="text-slate-500 text-xs">Pending</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-3">
                     <AlertCircle className="h-5 w-5 text-slate-300" />
                     <div className="text-sm">
                        <p className="font-bold text-slate-400">Finance Clearance</p>
                        <p className="text-slate-500 text-xs">Pending</p>
                     </div>
                  </div>
               </div>
            </CardContent>
         </Card>
      </div>
    </div>
  )
}
