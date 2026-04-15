"use client"

import { IndustrialDashboard } from '@/components/modules/core/IndustrialDashboard'
import { FleetMap } from '@/components/modules/transport/FleetMap'
import { DriverScheduling } from '@/components/modules/laundry/DriverScheduling'
import { RequisitionManager } from '@/components/shared/procurement/RequisitionManager'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Globe, ArrowLeft, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function TransportPortal() {
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
              <div className="bg-emerald-600 p-2 rounded-lg text-white">
                <Truck className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight">Transport Command</h1>
                <p className="text-xl text-muted-foreground mt-2">Logistics & Fleet Operations</p>
              </div>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <Badge variant="outline" className="text-xs uppercase tracking-wider px-3 py-1 bg-emerald-50 text-emerald-700 border-emerald-200">
              FLEET-OPS V2.0
            </Badge>
          </div>
        </header>

        <Tabs defaultValue="fleet-map" className="w-full">
          <div className="overflow-x-auto pb-4 scrollbar-hide">
            <TabsList className="flex h-auto gap-2 bg-transparent p-0 min-w-max">
              <TabsTrigger value="fleet-map" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white border font-bold">Live Tracking</TabsTrigger>
              <TabsTrigger value="schedules" className="border font-bold">Duty Scheduling</TabsTrigger>
              <TabsTrigger value="fleet-maintenance" className="border font-bold">Vehicle Maintenance</TabsTrigger>
              <TabsTrigger value="indent" className="border font-bold">Procurement Indent</TabsTrigger>
              <TabsTrigger value="analytics" className="border font-bold">Logistics Data</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="fleet-map">
            <FleetMap />
          </TabsContent>

          <TabsContent value="schedules">
            <DriverScheduling />
          </TabsContent>

          <TabsContent value="fleet-maintenance">
            <CardPlaceholder title="Vehicle Service Logs" />
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
