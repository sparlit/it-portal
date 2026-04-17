"use client"

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  Search,
  Terminal,
  Settings,
  Truck,
  Box,
  Factory,
  Hammer,
  Users,
  Cpu,
  Waves,
  Command as CommandIcon,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const router = useRouter()

  const commands = [
    { name: 'IT Infrastructure', icon: <Cpu className="h-4 w-4" />, link: '/portal/it', portal: 'it' },
    { name: 'Laundry Operations', icon: <Waves className="h-4 w-4" />, link: '/portal/laundry', portal: 'laundry' },
    { name: 'CRM & Sales', icon: <Users className="h-4 w-4" />, link: '/portal/crm', portal: 'crm' },
    { name: 'Transport Logistics', icon: <Truck className="h-4 w-4" />, link: '/portal/transport', portal: 'transport' },
    { name: 'Stores & Purchase', icon: <Box className="h-4 w-4" />, link: '/portal/stores', portal: 'stores' },
    { name: 'Maintenance', icon: <Hammer className="h-4 w-4" />, link: '/portal/maintenance', portal: 'maintenance' },
    { name: 'Production', icon: <Factory className="h-4 w-4" />, link: '/portal/production', portal: 'production' },
    { name: 'System Administration', icon: <Settings className="h-4 w-4" />, link: '/portal/admin', portal: 'admin' },
  ]

  const filtered = commands.filter(c => c.name.toLowerCase().includes(query.toLowerCase()))

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      setIsOpen(prev => !prev)
    }
    if (e.key === 'Escape') setIsOpen(false)
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[10000] flex items-start justify-center pt-[15vh] px-4">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border-2 border-slate-200 dark:border-slate-800 overflow-hidden relative animate-in zoom-in-95 duration-200">
        <div className="p-4 border-b dark:border-slate-800 flex items-center gap-3">
          <Search className="h-5 w-5 text-slate-400" />
          <input
            autoFocus
            className="flex-1 bg-transparent border-none outline-none text-lg font-medium text-slate-900 dark:text-white"
            placeholder="Type a command or jump to portal..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <div className="flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded border text-[10px] font-black text-slate-500">
             ESC TO CLOSE
          </div>
        </div>

        <div className="p-2 max-h-[400px] overflow-y-auto">
          {filtered.length === 0 && (
              <div className="p-12 text-center">
                 <Terminal className="h-10 w-10 text-slate-200 mx-auto mb-4" />
                 <p className="text-slate-400 font-medium">No results found for "{query}"</p>
              </div>
          )}
          {filtered.map(c => (
             <div
               key={c.link}
               className="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl cursor-pointer transition-colors group"
               onClick={() => {
                   router.push(c.link)
                   setIsOpen(false)
               }}
             >
                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                   {c.icon}
                </div>
                <div className="flex-1">
                   <p className="font-bold text-slate-900 dark:text-white">{c.name}</p>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{c.portal} portal active</p>
                </div>
                <div className="text-[10px] font-bold text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">Jump to Section</div>
             </div>
          ))}
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-950/50 border-t dark:border-slate-800 flex justify-between items-center text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase">
           <div className="flex gap-4">
              <span>↑↓ Navigate</span>
              <span>↵ Select</span>
           </div>
           <div className="flex items-center gap-1">
              <CommandIcon className="h-3 w-3" /> Artemis Intelligence v2.2
           </div>
        </div>
      </div>
    </div>
  )
}
