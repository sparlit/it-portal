"use client"
import { OEEMonitor } from "@/components/modules/production/OEEMonitor"

import { BatchMonitor } from '@/components/modules/production/BatchMonitor'
import { OEMetrics } from '@/components/modules/production/OEMetrics'
import { RequisitionManager } from '@/components/shared/procurement/RequisitionManager'
import { IndustrialDashboard } from '@/components/modules/core/IndustrialDashboard'
import { NotificationCenter } from '@/components/shared/layout/NotificationCenter'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { useTheme } from '@/lib/theme-context'
import { useI18n } from '@/lib/i18n/context'
import { ArrowLeft, Factory, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function ProductionPortal() {
  const { theme } = useTheme();
  const { language, setLanguage } = useI18n();

  return (
    <main className="container mx-auto p-4 md:p-8" style={{ '--primary-brand': theme.primaryColor } as any}>
      <div className="flex flex-col gap-8">
        <OEEMonitor oee={0.78} power={45.2} water={1250} />
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
                <p className="text-xl text-muted-foreground mt-2">Industrial Quality Control</p>
              </div>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 font-bold"
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
            >
              <Globe className="h-4 w-4" />
              {language === 'en' ? 'العربية' : 'English'}
            </Button>
            <NotificationCenter />
            <Badge variant="outline" className="text-xs uppercase tracking-wider px-3 py-1 bg-slate-50 text-slate-700 border-slate-200">
              PROD V2.1
            </Badge>
          </div>
        </header>

        <Tabs defaultValue="analytics" className="w-full">
          <div className="overflow-x-auto pb-4 scrollbar-hide">
            <TabsList className="flex h-auto gap-2 bg-transparent p-0 min-w-max">
              <TabsTrigger value="analytics" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white border font-bold">Analytics</TabsTrigger>
              <TabsTrigger value="batches" className="border font-bold">Active Batches</TabsTrigger>
              <TabsTrigger value="efficiency" className="border font-bold">Efficiency</TabsTrigger>
              <TabsTrigger value="indent" className="border font-bold">Procurement</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="analytics">
            <IndustrialDashboard />
          </TabsContent>

          <TabsContent value="batches">
            <BatchMonitor />
          </TabsContent>

          <TabsContent value="efficiency">
            <OEMetrics />
          </TabsContent>

          <TabsContent value="indent">
            <RequisitionManager />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
