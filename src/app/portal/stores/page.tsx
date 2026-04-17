"use client"
import { StockAlertPanel } from "@/components/industrial/StockAlertPanel"

import { StockOverview } from '@/components/modules/stores/StockOverview'
import { RequisitionManager } from '@/components/shared/procurement/RequisitionManager'
import { IndustrialDashboard } from '@/components/modules/core/IndustrialDashboard'
import { NotificationCenter } from '@/components/shared/layout/NotificationCenter'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { useTheme } from '@/lib/theme-context'
import { useI18n } from '@/lib/i18n/context'
import { ArrowLeft, Box, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function StoresPortal() {
  const { theme } = useTheme();
  const { language, setLanguage } = useI18n();

  return (
    <main className="container mx-auto p-4 md:p-8" style={{ '--primary-brand': theme.primaryColor } as any}>
      <div className="flex flex-col gap-8">
        <StockAlertPanel />
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
                <p className="text-xl text-muted-foreground mt-2">Inventory & Supply Chain</p>
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
            <Badge variant="outline" className="text-xs uppercase tracking-wider px-3 py-1 bg-orange-50 text-orange-700 border-orange-200">
              STORES V2.1
            </Badge>
          </div>
        </header>

        <Tabs defaultValue="analytics" className="w-full">
          <div className="overflow-x-auto pb-4 scrollbar-hide">
            <TabsList className="flex h-auto gap-2 bg-transparent p-0 min-w-max">
              <TabsTrigger value="analytics" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white border font-bold">Analytics</TabsTrigger>
              <TabsTrigger value="inventory" className="border font-bold">Inventory</TabsTrigger>
              <TabsTrigger value="requisitions" className="border font-bold">Requisitions</TabsTrigger>
              <TabsTrigger value="indent" className="border font-bold">Internal</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="analytics">
            <IndustrialDashboard />
          </TabsContent>

          <TabsContent value="inventory">
            <StockOverview />
          </TabsContent>

          <TabsContent value="requisitions">
            <RequisitionManager />
          </TabsContent>

          <TabsContent value="indent">
             <div className="p-12 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-slate-400">
                <h3 className="text-xl font-bold italic uppercase">Departmental Stream</h3>
                <p>Real-time indent pipeline synchronized.</p>
             </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
