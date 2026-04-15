"use client"

import { useState, useMemo } from 'react'
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
import { Globe, LayoutDashboard, Database, Activity, ShieldAlert, ShoppingBag, Users, Headphones, HardDrive, Terminal } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Home() {
  const { t, language, setLanguage } = useI18n();
  const [activeTab, setActiveTab] = useState('analytics');

  const navigation = useMemo(() => [
    { id: 'analytics', label: t('analytics'), icon: LayoutDashboard },
    { id: 'reception', label: t('reception'), icon: Users },
    { id: 'audit', label: t('audit'), icon: Activity },
    { id: 'laundry-orders', label: t('orders'), icon: ShoppingBag },
    { id: 'laundry-crm', label: t('customers'), icon: Database },
    { id: 'laundry-cs', label: t('laundry_cs'), icon: Headphones },
    { id: 'it-assets', label: t('it_assets'), icon: HardDrive },
    { id: 'it-infra', label: t('it_infra'), icon: Terminal },
    { id: 'it-tickets', label: t('it_support'), icon: ShieldAlert },
    { id: 'it-vault', label: t('it_vault'), icon: Database },
  ], [t]);

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Industrial Header */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-20 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter uppercase leading-none">TSysLab Industrial</h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1 font-bold">Doha Node | Operational Hub</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end mr-4">
              <span className="text-[10px] text-slate-500 uppercase font-black">System Status</span>
              <span className="text-xs text-green-400 flex items-center gap-1 font-bold">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                Operational
              </span>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="text-slate-300 hover:text-white hover:bg-slate-800 gap-2 font-bold"
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
            >
              <Globe className="h-4 w-4" />
              {language === 'en' ? 'العربية' : 'English'}
            </Button>

            <Badge variant="outline" className="text-[10px] uppercase font-black px-2 py-0.5 border-slate-700 text-slate-400">
              V3.2.1-INDUSTRIAL
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-4 md:p-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          {/* Enhanced Navigation Bar */}
          <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto scrollbar-hide">
              <TabsList className="flex h-auto gap-1 bg-transparent p-0 min-w-max">
                {navigation.map((item) => (
                  <TabsTrigger
                    key={item.id}
                    value={item.id}
                    className="flex items-center gap-2 px-6 py-3 rounded-lg data-[state=active]:bg-slate-900 data-[state=active]:text-white transition-all font-bold text-sm text-slate-600"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </div>

          {/* Module Content Area */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm min-h-[600px]">
            <TabsContent value="analytics" className="mt-0">
              <GlobalMetrics />
            </TabsContent>

            <TabsContent value="reception" className="mt-0">
              <ReceptionDesk />
            </TabsContent>

            <TabsContent value="audit" className="mt-0">
              <AuditTrail />
            </TabsContent>

            <TabsContent value="laundry-orders" className="mt-0">
              <LaundryOrderManager />
            </TabsContent>

            <TabsContent value="laundry-crm" className="mt-0">
              <LaundryCustomerManager />
            </TabsContent>

            <TabsContent value="laundry-cs" className="mt-0">
              <LaundryTicketDashboard />
            </TabsContent>

            <TabsContent value="it-assets" className="mt-0">
              <AssetInventory />
            </TabsContent>

            <TabsContent value="it-infra" className="mt-0">
              <InfrastructureMonitor />
            </TabsContent>

            <TabsContent value="it-tickets" className="mt-0">
              <ITTicketDashboard />
            </TabsContent>

            <TabsContent value="it-vault" className="mt-0">
              <SecretVault />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Industrial Footer */}
      <footer className="mt-12 py-8 border-t border-slate-200 bg-white">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500 font-medium">
            © 2024 TSysLab Industrial Ecosystem. All systems active.
          </p>
          <div className="flex gap-4 text-[10px] uppercase font-bold tracking-widest text-slate-400">
            <span>Latency: 24ms</span>
            <span className="text-slate-300">|</span>
            <span>Uptime: 99.99%</span>
            <span className="text-slate-300">|</span>
            <span>Node: QA-DOH-01</span>
          </div>
        </div>
      </footer>
    </main>
  )
}
