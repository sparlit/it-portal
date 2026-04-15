"use client"

import { ITTicketDashboard } from '@/components/modules/it/ITTicketDashboard'
import { AssetInventory } from '@/components/modules/it/AssetInventory'
import { InfrastructureMonitor } from '@/components/modules/it/InfrastructureMonitor'
import { SecretVault } from '@/components/modules/it/SecretVault'
import { KnowledgeBase } from '@/components/modules/it/KnowledgeBase'
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

export default function ITPortal() {
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
              <h1 className="text-4xl font-extrabold tracking-tight">IT Operations Hub</h1>
              <p className="text-xl text-muted-foreground mt-2">Enterprise Infrastructure Management</p>
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
              IT DEPT V2.1
            </Badge>
          </div>
        </header>

        <Tabs defaultValue="analytics" className="w-full">
          <div className="overflow-x-auto pb-4 scrollbar-hide">
            <TabsList className="flex h-auto gap-2 bg-transparent p-0 min-w-max">
              <TabsTrigger value="analytics" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white border font-bold">Analytics</TabsTrigger>
              <TabsTrigger value="it-assets" className="border font-bold">Assets</TabsTrigger>
              <TabsTrigger value="it-infra" className="border font-bold">Infrastructure</TabsTrigger>
              <TabsTrigger value="it-tickets" className="border font-bold">Support</TabsTrigger>
              <TabsTrigger value="it-vault" className="border font-bold">Vault</TabsTrigger>
              <TabsTrigger value="it-kb" className="border font-bold">Knowledge Base</TabsTrigger>
              <TabsTrigger value="indent" className="border font-bold">Procurement</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="analytics">
            <IndustrialDashboard />
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

          <TabsContent value="it-kb">
            <KnowledgeBase />
          </TabsContent>

          <TabsContent value="indent">
            <RequisitionManager />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
