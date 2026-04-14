"use client"

import { ITTicketDashboard } from '@/components/modules/it/ITTicketDashboard'
import { AssetInventory } from '@/components/modules/it/AssetInventory'
import { InfrastructureMonitor } from '@/components/modules/it/InfrastructureMonitor'
import { SecretVault } from '@/components/modules/it/SecretVault'
import { GlobalMetrics } from '@/components/modules/core/GlobalMetrics'
import { ReceptionDesk } from '@/components/modules/core/ReceptionDesk'
import { AuditTrail } from '@/components/modules/core/AuditTrail'
import { LaundryTicketDashboard } from '@/components/modules/laundry/LaundryTicketDashboard'
import { LaundryOrderManager } from '@/components/modules/laundry/LaundryOrderManager'
import { LaundryCustomerManager } from '@/components/modules/laundry/LaundryCustomerManager'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { useI18n } from '@/lib/i18n/context'
import { Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Home() {
  const { t, language, setLanguage } = useI18n();

  return (
    <main className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col gap-8">
        <header className="border-b pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">{t('title')}</h1>
            <p className="text-xl text-muted-foreground mt-2">{t('subtitle')}</p>
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
            <Badge variant="outline" className="text-xs uppercase tracking-wider px-3 py-1 bg-blue-50 text-blue-700 border-blue-200">
              ENTERPRISE V1.2
            </Badge>
          </div>
        </header>

        <Tabs defaultValue="analytics" className="w-full">
          <div className="overflow-x-auto pb-4 scrollbar-hide">
            <TabsList className="flex h-auto gap-2 bg-transparent p-0 min-w-max">
              <TabsTrigger value="analytics" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white border font-bold">{t('analytics')}</TabsTrigger>
              <TabsTrigger value="reception" className="border font-bold">{t('reception')}</TabsTrigger>
              <TabsTrigger value="audit" className="border font-bold">{t('audit')}</TabsTrigger>
              <TabsTrigger value="laundry-orders" className="border font-bold">{t('orders')}</TabsTrigger>
              <TabsTrigger value="laundry-crm" className="border font-bold">{t('customers')}</TabsTrigger>
              <TabsTrigger value="laundry-cs" className="border font-bold">{t('laundry_cs')}</TabsTrigger>
              <TabsTrigger value="it-assets" className="border font-bold">{t('it_assets')}</TabsTrigger>
              <TabsTrigger value="it-infra" className="border font-bold">{t('it_infra')}</TabsTrigger>
              <TabsTrigger value="it-tickets" className="border font-bold">{t('it_support')}</TabsTrigger>
              <TabsTrigger value="it-vault" className="border font-bold">{t('it_vault')}</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="analytics">
            <GlobalMetrics />
          </TabsContent>

          <TabsContent value="reception">
            <ReceptionDesk />
          </TabsContent>

          <TabsContent value="audit">
            <AuditTrail />
          </TabsContent>

          <TabsContent value="laundry-orders">
            <LaundryOrderManager />
          </TabsContent>

          <TabsContent value="laundry-crm">
            <LaundryCustomerManager />
          </TabsContent>

          <TabsContent value="laundry-cs">
            <LaundryTicketDashboard />
          </TabsContent>

          <TabsContent value="it-assets">
            <AssetInventory />
          </TabsContent>

          <TabsContent value="it-infra">
            <InfrastructureMonitor />
          </TabsContent>

          <TabsContent value="it-tickets">
            <ITTicketDashboard />
          </TabsContent>

          <TabsContent value="it-vault">
            <SecretVault />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
