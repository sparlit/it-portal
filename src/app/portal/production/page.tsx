"use client"

import { IndustrialDashboard } from '@/components/modules/core/IndustrialDashboard'
import { BatchMonitor } from '@/components/modules/production/BatchMonitor'
import { RequisitionManager } from '@/components/shared/procurement/RequisitionManager'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Factory } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function ProductionPortal() {
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
              <div className="bg-slate-900 p-2 rounded-lg text-white">
                <Factory className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight">Production & Process</h1>
                <p className="text-xl text-muted-foreground mt-2">Industrial Throughput & Quality Control</p>
              </div>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <Badge variant="outline" className="text-xs uppercase tracking-wider px-3 py-1 bg-slate-50 text-slate-700 border-slate-200">
              INDUSTRIAL-V2
            </Badge>
          </div>
        </header>

        <Tabs defaultValue="batches" className="w-full">
          <div className="overflow-x-auto pb-4 scrollbar-hide">
            <TabsList className="flex h-auto gap-2 bg-transparent p-0 min-w-max">
              <TabsTrigger value="batches" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white border font-bold">Active Batches</TabsTrigger>
              <TabsTrigger value="qc" className="border font-bold">Quality Control</TabsTrigger>
              <TabsTrigger value="efficiency" className="border font-bold">OEE Metrics</TabsTrigger>
              <TabsTrigger value="indent" className="border font-bold">Procurement Indent</TabsTrigger>
              <TabsTrigger value="analytics" className="border font-bold">Throughput Data</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="batches">
            <BatchMonitor />
          </TabsContent>

          <TabsContent value="qc">
            <CardPlaceholder title="Statistical Process Control (SPC)" />
          </TabsContent>

          <TabsContent value="efficiency">
            <CardPlaceholder title="Overall Equipment Effectiveness" />
          </TabsContent>

          <TabsContent value="indent">
            <RequisitionManager />
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
