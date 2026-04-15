"use client"

import { LaundryTicketDashboard } from '@/components/modules/laundry/LaundryTicketDashboard'
import { LaundryOrderManager } from '@/components/modules/laundry/LaundryOrderManager'
import { LaundryCustomerManager } from '@/components/modules/laundry/LaundryCustomerManager'
import { ServicePricing } from '@/components/modules/laundry/ServicePricing'
import { DriverScheduling } from '@/components/modules/laundry/DriverScheduling'
import { GarmentTracker } from '@/components/modules/laundry/GarmentTracker'
import { RequisitionManager } from '@/components/shared/procurement/RequisitionManager'
import { IndustrialDashboard } from '@/components/modules/core/IndustrialDashboard'
import { NotificationCenter } from '@/components/shared/layout/NotificationCenter'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { useI18n } from '@/lib/i18n/context'
import { useTheme } from '@/lib/theme-context'
import { Globe, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function LaundryPortal() {
  const { language, setLanguage } = useI18n();
  const { theme } = useTheme();

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
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight">Laundry Operations</h1>
              <p className="text-xl text-muted-foreground mt-2">Precision Cleaning Management</p>
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
            <Badge variant="outline" className="text-xs uppercase tracking-wider px-3 py-1 bg-blue-50 text-blue-700 border-blue-200">
              LAUNDRY V2.1
            </Badge>
          </div>
        </header>

        <Tabs defaultValue="analytics" className="w-full">
          <div className="overflow-x-auto pb-4 scrollbar-hide">
            <TabsList className="flex h-auto gap-2 bg-transparent p-0 min-w-max">
              <TabsTrigger value="analytics" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white border font-bold">Analytics</TabsTrigger>
              <TabsTrigger value="laundry-orders" className="border font-bold">Orders</TabsTrigger>
              <TabsTrigger value="laundry-crm" className="border font-bold">Customers</TabsTrigger>
              <TabsTrigger value="laundry-pricing" className="border font-bold">Pricing</TabsTrigger>
              <TabsTrigger value="laundry-cs" className="border font-bold">Support</TabsTrigger>
              <TabsTrigger value="laundry-tracking" className="border font-bold">Garment Tracking</TabsTrigger>
              <TabsTrigger value="laundry-logistics" className="border font-bold">Logistics</TabsTrigger>
              <TabsTrigger value="indent" className="border font-bold">Procurement</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="analytics">
            <IndustrialDashboard />
          </TabsContent>

          <TabsContent value="laundry-orders">
            <LaundryOrderManager />
          </TabsContent>

          <TabsContent value="laundry-crm">
            <LaundryCustomerManager />
          </TabsContent>

          <TabsContent value="laundry-pricing">
            <ServicePricing />
          </TabsContent>

          <TabsContent value="laundry-cs">
            <LaundryTicketDashboard />
          </TabsContent>

          <TabsContent value="laundry-tracking">
            <GarmentTracker />
          </TabsContent>

          <TabsContent value="laundry-logistics">
            <DriverScheduling />
          </TabsContent>

          <TabsContent value="indent">
            <RequisitionManager />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
