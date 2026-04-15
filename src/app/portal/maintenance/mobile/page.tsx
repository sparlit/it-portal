"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Hammer,
  Wrench,
  Clipboard,
  CheckCircle2,
  Camera,
  AlertTriangle,
  Loader2,
  ChevronLeft
} from 'lucide-react'
import Link from 'next/link'

export default function TechMobilePortal() {
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/maint/tasks')
      .then(res => res.json())
      .then(data => {
          if (Array.isArray(data)) setTasks(data)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="bg-slate-900 text-white px-4 h-16 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
           <Link href="/portal/maintenance">
              <ChevronLeft className="h-6 w-6 text-slate-400" />
           </Link>
           <span className="font-black tracking-tighter uppercase text-sm">Tech Floor Ops</span>
        </div>
        <Badge variant="outline" className="text-white border-white/20">DOH-FAC</Badge>
      </header>

      <main className="flex-1 p-4 space-y-6">
         <div className="flex justify-between items-center">
            <h2 className="text-2xl font-black tracking-tight">Assigned Tasks</h2>
            <div className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1 border border-red-100">
               <AlertTriangle className="h-3 w-3" /> 2 High Priority
            </div>
         </div>

         {loading ? (
             <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-slate-900" /></div>
         ) : (
            <div className="space-y-4">
               {tasks.map(task => (
                  <Card key={task.id} className="border-2 rounded-3xl overflow-hidden shadow-xl shadow-slate-100 transition-all active:scale-95">
                     <CardContent className="p-0">
                        <div className="p-6 space-y-4">
                           <div className="flex justify-between items-start">
                              <div>
                                 <h3 className="font-black text-xl leading-tight">{task.title}</h3>
                                 <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">{task.asset?.name || 'FACILITY'}</p>
                              </div>
                              <Badge className={task.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'}>{task.priority}</Badge>
                           </div>

                           <div className="flex gap-4 pt-4">
                              <div className="flex-1 space-y-2">
                                 <p className="text-[10px] font-black uppercase text-slate-400">Task Details</p>
                                 <p className="text-sm text-slate-600 leading-relaxed">{task.description || 'Standard inspection required.'}</p>
                              </div>
                           </div>

                           <div className="grid grid-cols-2 gap-3 pt-2">
                              <Button className="bg-slate-900 text-white font-black h-14 rounded-2xl gap-2 text-sm">
                                 <CheckCircle2 className="h-4 w-4" /> Finish Task
                              </Button>
                              <Button variant="outline" className="border-2 border-slate-200 h-14 rounded-2xl gap-2">
                                 <Camera className="h-4 w-4" /> Log Photo
                              </Button>
                           </div>
                        </div>
                     </CardContent>
                  </Card>
               ))}
               {tasks.length === 0 && <div className="text-center py-20 border-2 border-dashed rounded-3xl text-slate-400 font-bold italic">Clear queue. Stand by for orders.</div>}
            </div>
         )}
      </main>

      <nav className="h-20 bg-slate-50 border-t grid grid-cols-3 sticky bottom-0 z-50">
         <div className="flex flex-col items-center justify-center gap-1 text-slate-900 font-black">
            <Clipboard className="h-6 w-6" />
            <span className="text-[9px] uppercase">Job Card</span>
         </div>
         <div className="flex flex-col items-center justify-center gap-1 text-slate-400 font-black">
            <Wrench className="h-6 w-6" />
            <span className="text-[9px] uppercase">Tools</span>
         </div>
         <div className="flex flex-col items-center justify-center gap-1 text-slate-400 font-black">
            <Hammer className="h-6 w-6" />
            <span className="text-[9px] uppercase">Safety</span>
         </div>
      </nav>
    </div>
  )
}
