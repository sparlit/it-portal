"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Hammer, Settings, Plus, Wrench } from 'lucide-react'

export function MaintenanceTasks() {
  const tasks = [
    { id: '1', title: 'Boiler #2 Descaling', asset: 'LND-BLR-02', priority: 'High', status: 'In Progress', type: 'Preventive' },
    { id: '2', title: 'Server Rack Fan Replacement', asset: 'IT-SRV-RK-A', priority: 'Medium', status: 'Pending', type: 'Corrective' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Work Orders</h2>
        <Button className="bg-slate-900 text-white gap-2">
           <Plus className="h-4 w-4" /> Create Work Order
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
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
                      <p className="text-sm text-slate-500 font-medium">{task.asset} • {task.type}</p>
                   </div>
                </div>
                <div className="flex items-center gap-3">
                   <Badge variant="outline" className={task.priority === 'High' ? 'border-red-200 text-red-700 bg-red-50' : ''}>
                      {task.priority} Priority
                   </Badge>
                   <Badge className={task.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'}>
                      {task.status}
                   </Badge>
                   <Button variant="ghost" size="sm" className="font-bold text-blue-600">View Details</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
