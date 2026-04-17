"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Hammer, Plus, Wrench, Loader2 } from 'lucide-react'

export function MaintenanceTasks() {
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/maintenance/tasks')
      .then(res => res.json())
      .then(data => {
          if (Array.isArray(data)) setTasks(data)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Work Orders</h2>
        <Button className="bg-slate-900 text-white gap-2">
           <Plus className="h-4 w-4" /> Create Work Order
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-slate-300" /></div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {tasks.length === 0 && <div className="text-center py-12 text-slate-400 font-medium border-2 border-dashed rounded-xl">No active work orders found.</div>}
          {tasks.map(task => (
            <Card key={task.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                     <div className={`p-3 rounded-lg ${task.priority === 'High' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
                        <Wrench className="h-6 w-6" />
                     </div>
                     <div>
                        <h4 className="font-bold text-lg">{task.title}</h4>
                        <p className="text-sm text-slate-500 font-medium">{task.asset?.name || 'General Facility'} • {task.type}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-3">
                     <Badge variant="outline" className={task.priority === 'High' ? 'border-red-200 text-red-700 bg-red-50' : ''}>
                        {task.priority} Priority
                     </Badge>
                     <Badge className={task.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'}>
                        {task.status.replace('_', ' ')}
                     </Badge>
                     <Button variant="ghost" size="sm" className="font-bold text-blue-600">View Details</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
