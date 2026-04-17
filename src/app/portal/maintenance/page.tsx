"use client"

import { QRCodeAsset } from "@/components/industrial/QRCodeAsset"
import { MaintenanceTasks } from '@/components/modules/maintenance/MaintenanceTasks'
import { RequisitionManager } from '@/components/shared/procurement/RequisitionManager'
import { IndustrialDashboard } from '@/components/modules/core/IndustrialDashboard'
import { NotificationCenter } from '@/components/shared/layout/NotificationCenter'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { useTheme } from '@/lib/theme-context'
import { useI18n } from '@/lib/i18n/context'
import { ArrowLeft, Hammer, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function MaintenancePortal() {
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
              RELIABILITY V2.1
            </Badge>
          </div>
        </header>

        <Tabs defaultValue="analytics" className="w-full">
          <div className="overflow-x-auto pb-4 scrollbar-hide">
            <TabsList className="flex h-auto gap-2 bg-transparent p-0 min-w-max">
              <TabsTrigger value="analytics" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white border font-bold">Analytics</TabsTrigger>
              <TabsTrigger value="tasks" className="border font-bold">Work Orders</TabsTrigger>
              <TabsTrigger value="indent" className="border font-bold">Procurement</TabsTrigger>
              <TabsTrigger value="tags" className="border font-bold">QR Tag Center</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="analytics">
            <IndustrialDashboard />
          </TabsContent>

          <TabsContent value="tasks">
            <MaintenanceTasks />
          </TabsContent>

          <TabsContent value="indent">
            <RequisitionManager />
          </TabsContent>

          <TabsContent value="tags">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <QRCodeAsset assetId="ASSET-001" assetName="Boiler-01" serialNumber="SN-B-2024-X1" />
              <QRCodeAsset assetId="ASSET-002" assetName="Drying Tumbler 2" serialNumber="SN-DT-2024-Y2" />
              <QRCodeAsset assetId="ASSET-003" assetName="Main Switchboard" serialNumber="SN-MSB-009" />
              <QRCodeAsset assetId="ASSET-004" assetName="UPS - Data Center" serialNumber="SN-UPS-990" />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
