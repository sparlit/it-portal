"use client"

import { FleetMap } from '@/components/modules/transport/FleetMap'
import { DriverScheduling } from '@/components/modules/laundry/DriverScheduling'
import { RequisitionManager } from '@/components/shared/procurement/RequisitionManager'
import { VehicleServiceLogs } from '@/components/modules/transport/VehicleServiceLogs'
import { IndustrialDashboard } from '@/components/modules/core/IndustrialDashboard'
import { NotificationCenter } from '@/components/shared/layout/NotificationCenter'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { useTheme } from '@/lib/theme-context'
import { useI18n } from '@/lib/i18n/context'
import { Globe, ArrowLeft, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function TransportPortal() {
  const { theme } = useTheme();
  const { language, setLanguage } = useI18n();

  return (
    <main className="container mx-auto p-4 md:p-8" style={{ '--primary-brand': theme.primaryColor } as any}>
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
            <Badge variant="outline" className="text-xs uppercase tracking-wider px-3 py-1 bg-emerald-50 text-emerald-700 border-emerald-200">
              FLEET V2.1
            </Badge>
          </div>
        </header>

        <Tabs defaultValue="analytics" className="w-full">
          <div className="overflow-x-auto pb-4 scrollbar-hide">
            <TabsList className="flex h-auto gap-2 bg-transparent p-0 min-w-max">
              <TabsTrigger value="analytics" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white border font-bold">Analytics</TabsTrigger>
              <TabsTrigger value="fleet-map" className="border font-bold">Live Tracking</TabsTrigger>
              <TabsTrigger value="schedules" className="border font-bold">Scheduling</TabsTrigger>
              <TabsTrigger value="fleet-maintenance" className="border font-bold">Maintenance</TabsTrigger>
              <TabsTrigger value="indent" className="border font-bold">Procurement</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="analytics">
            <IndustrialDashboard />
          </TabsContent>

          <TabsContent value="fleet-map">
            <FleetMap />
          </TabsContent>

          <TabsContent value="schedules">
            <DriverScheduling />
          </TabsContent>

          <TabsContent value="fleet-maintenance">
            <VehicleServiceLogs />
          </TabsContent>

          <TabsContent value="indent">
            <RequisitionManager />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
