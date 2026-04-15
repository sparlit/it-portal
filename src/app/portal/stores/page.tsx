"use client"

import { IndustrialDashboard } from '@/components/modules/core/IndustrialDashboard'
import { StockOverview } from '@/components/modules/stores/StockOverview'
import { RequisitionManager } from '@/components/shared/procurement/RequisitionManager'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Box } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function StoresPortal() {
  return (
    <main className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col gap-8">
        <header className="border-b pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="rounded-full border shadow-sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="bg-orange-600 p-2 rounded-lg text-white">
                <Box className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight">Stores & Purchase</h1>
                <p className="text-xl text-muted-foreground mt-2">Inventory & Supply Chain Control</p>
              </div>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <Badge variant="outline" className="text-xs uppercase tracking-wider px-3 py-1 bg-orange-50 text-orange-700 border-orange-200">
              SUPPLY-CHAIN V2.0
            </Badge>
          </div>
        </header>

        <Tabs defaultValue="inventory" className="w-full">
          <div className="overflow-x-auto pb-4 scrollbar-hide">
            <TabsList className="flex h-auto gap-2 bg-transparent p-0 min-w-max">
              <TabsTrigger value="inventory" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white border font-bold">Inventory Overview</TabsTrigger>
              <TabsTrigger value="requisitions" className="border font-bold">Purchase Requisitions</TabsTrigger>
              <TabsTrigger value="suppliers" className="border font-bold">Supplier Database</TabsTrigger>
              <TabsTrigger value="indent" className="border font-bold">Internal Indents</TabsTrigger>
              <TabsTrigger value="analytics" className="border font-bold">Valuation Data</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="inventory">
            <StockOverview />
          </TabsContent>

          <TabsContent value="requisitions">
            <RequisitionManager />
          </TabsContent>

          <TabsContent value="suppliers">
            <CardPlaceholder title="Strategic Supplier Management" />
          </TabsContent>

          <TabsContent value="indent">
             <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-sm">
                   Showing all cross-departmental indents awaiting stores verification.
                </div>
                <CardPlaceholder title="Departmental Request Stream" />
             </div>
          </TabsContent>

          <TabsContent value="analytics">
            <IndustrialDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

function CardPlaceholder({ title }: { title: string }) {
    return (
        <div className="p-12 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-slate-400">
            <h3 className="text-xl font-bold">{title}</h3>
            <p>Module content currently in synchronization...</p>
        </div>
    )
}
