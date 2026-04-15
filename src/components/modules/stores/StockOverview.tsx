"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Box, RefreshCcw, TrendingDown, AlertTriangle, Loader2 } from 'lucide-react'

export function StockOverview() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/stores/items')
      .then(res => res.json())
      .then(data => {
          if (Array.isArray(data)) setItems(data)
      })
      .finally(() => setLoading(false))
  }, [])

  const lowStockItems = items.filter(i => i.currentStock <= i.minStockLevel)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
           <CardContent className="pt-6">
              <p className="text-xs font-bold uppercase text-slate-500">Total SKU Count</p>
              <h3 className="text-2xl font-black">{items.length}</h3>
           </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500">
           <CardContent className="pt-6">
              <p className="text-xs font-bold uppercase text-slate-500">Critical Low Stock</p>
              <h3 className="text-2xl font-black text-red-600">{lowStockItems.length}</h3>
           </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Box className="h-5 w-5 text-slate-600" />
            Inventory Master List
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
              <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-slate-300" /></div>
          ) : (
            <div className="border rounded-xl overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 border-b">
                    <tr>
                        <th className="px-6 py-4">Item Details</th>
                        <th className="px-6 py-4">Category</th>
                        <th className="px-6 py-4">Stock Level</th>
                        <th className="px-6 py-4">Status</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y">
                    {items.length === 0 && <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-400 font-medium">Warehouse inventory is empty.</td></tr>}
                    {items.map(item => (
                        <tr key={item.id} className="hover:bg-slate-50">
                            <td className="px-6 py-4">
                                <div className="font-bold">{item.name}</div>
                                <div className="text-[10px] text-slate-400 font-mono">{item.sku}</div>
                            </td>
                            <td className="px-6 py-4 capitalize">{item.category}</td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                <span className={`font-black ${item.currentStock <= item.minStockLevel ? 'text-red-600' : 'text-slate-900'}`}>{item.currentStock}</span>
                                <span className="text-slate-400">/ {item.minStockLevel} min</span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                {item.currentStock <= item.minStockLevel ? (
                                    <Badge className="bg-red-100 text-red-700 border-red-200">Refill Required</Badge>
                                ) : (
                                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Healthy</Badge>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
