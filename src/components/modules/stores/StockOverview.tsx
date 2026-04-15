"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Box, RefreshCcw, TrendingDown, AlertTriangle } from 'lucide-react'

export function StockOverview() {
  const lowStock = [
    { id: '1', name: 'Alkaline Detergent', sku: 'CHEM-001', stock: 12, min: 20 },
    { id: '2', name: 'Plastic Covers (L)', sku: 'PCK-005', stock: 50, min: 100 },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
           <CardContent className="pt-6">
              <p className="text-xs font-bold uppercase text-slate-500">Total SKU Count</p>
              <h3 className="text-2xl font-black">1,452</h3>
           </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500">
           <CardContent className="pt-6">
              <p className="text-xs font-bold uppercase text-slate-500">Out of Stock</p>
              <h3 className="text-2xl font-black text-red-600">4</h3>
           </CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-500">
           <CardContent className="pt-6">
              <p className="text-xs font-bold uppercase text-slate-500">Reorder Points Met</p>
              <h3 className="text-2xl font-black text-orange-600">12</h3>
           </CardContent>
        </Card>
        <Card className="border-l-4 border-l-emerald-500">
           <CardContent className="pt-6">
              <p className="text-xs font-bold uppercase text-slate-500">Valuation</p>
              <h3 className="text-2xl font-black text-emerald-600">QAR 450k</h3>
           </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Stock Depletion Alerts
          </CardTitle>
          <Button variant="outline" size="sm" className="gap-2">
             <RefreshCcw className="h-4 w-4" /> Recalculate EOQ
          </Button>
        </CardHeader>
        <CardContent>
          <div className="border rounded-xl overflow-hidden">
             <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b">
                   <tr>
                      <th className="px-6 py-4">Item Details</th>
                      <th className="px-6 py-4">Current Stock</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Auto-Reorder</th>
                   </tr>
                </thead>
                <tbody className="divide-y">
                   {lowStock.map(item => (
                      <tr key={item.id} className="hover:bg-slate-50">
                         <td className="px-6 py-4">
                            <div className="font-bold">{item.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{item.sku}</div>
                         </td>
                         <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                               <span className="font-black text-red-600">{item.stock}</span>
                               <span className="text-slate-400">/ {item.min} min</span>
                               <TrendingDown className="h-3 w-3 text-red-400" />
                            </div>
                         </td>
                         <td className="px-6 py-4">
                            <Badge className="bg-orange-100 text-orange-700">Low Stock</Badge>
                         </td>
                         <td className="px-6 py-4 text-right">
                            <Button size="sm" className="bg-slate-900 text-white">Generate PO</Button>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
