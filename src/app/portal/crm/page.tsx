"use client"

import { IndustrialDashboard } from '@/components/modules/core/IndustrialDashboard'
import { LeadPipeline } from '@/components/modules/crm/LeadPipeline'
import { Customer360 } from '@/components/modules/crm/Customer360'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Users, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function CRMPortal() {
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
              <div className="bg-blue-600 p-2 rounded-lg text-white">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight">Customer Relationship & Sales</h1>
                <p className="text-xl text-muted-foreground mt-2">Client Growth & Retention Hub</p>
              </div>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <Badge variant="outline" className="text-xs uppercase tracking-wider px-3 py-1 bg-blue-50 text-blue-700 border-blue-200">
              GROWTH-V2
            </Badge>
          </div>
        </header>

        <Tabs defaultValue="pipeline" className="w-full">
          <div className="overflow-x-auto pb-4 scrollbar-hide">
            <TabsList className="flex h-auto gap-2 bg-transparent p-0 min-w-max">
              <TabsTrigger value="pipeline" className="data-[state=active]:bg-blue-900 data-[state=active]:text-white border font-bold">Sales Pipeline</TabsTrigger>
              <TabsTrigger value="customers" className="border font-bold">Client 360</TabsTrigger>
              <TabsTrigger value="marketing" className="border font-bold">Marketing Campaigns</TabsTrigger>
              <TabsTrigger value="analytics" className="border font-bold">Revenue Data</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="pipeline">
            <LeadPipeline />
          </TabsContent>

          <TabsContent value="customers">
            <Customer360 />
          </TabsContent>

          <TabsContent value="marketing">
            <CardPlaceholder title="Omnichannel Campaign Manager" />
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
