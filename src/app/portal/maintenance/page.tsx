"use client"

import { IndustrialDashboard } from '@/components/modules/core/IndustrialDashboard'
import { MaintenanceTasks } from '@/components/modules/maintenance/MaintenanceTasks'
import { RequisitionManager } from '@/components/shared/procurement/RequisitionManager'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Hammer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function MaintenancePortal() {
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
              <div className="bg-slate-800 p-2 rounded-lg text-white">
                <Hammer className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight">Maintenance Hub</h1>
                <p className="text-xl text-muted-foreground mt-2">Facility & Asset Reliability</p>
              </div>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <Badge variant="outline" className="text-xs uppercase tracking-wider px-3 py-1 bg-slate-50 text-slate-700 border-slate-200">
              RELIABILITY-V2
            </Badge>
          </div>
        </header>

        <Tabs defaultValue="tasks" className="w-full">
          <div className="overflow-x-auto pb-4 scrollbar-hide">
            <TabsList className="flex h-auto gap-2 bg-transparent p-0 min-w-max">
              <TabsTrigger value="tasks" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white border font-bold">Work Orders</TabsTrigger>
              <TabsTrigger value="pm" className="border font-bold">Preventive Schedule</TabsTrigger>
              <TabsTrigger value="spare-parts" className="border font-bold">Spare Parts</TabsTrigger>
              <TabsTrigger value="indent" className="border font-bold">Procurement Indent</TabsTrigger>
              <TabsTrigger value="analytics" className="border font-bold">Performance</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="tasks">
            <MaintenanceTasks />
          </TabsContent>

          <TabsContent value="pm">
            <CardPlaceholder title="Predictive & Preventive Maintenance" />
          </TabsContent>

          <TabsContent value="spare-parts">
            <CardPlaceholder title="Specialized Maintenance Inventory" />
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
