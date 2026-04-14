import { ITTicketDashboard } from '@/components/modules/it/ITTicketDashboard'
import { AssetInventory } from '@/components/modules/it/AssetInventory'
import { InfrastructureMonitor } from '@/components/modules/it/InfrastructureMonitor'
import { SecretVault } from '@/components/modules/it/SecretVault'
import { GlobalMetrics } from '@/components/modules/core/GlobalMetrics'
import { ReceptionDesk } from '@/components/modules/core/ReceptionDesk'
import { LaundryTicketDashboard } from '@/components/modules/laundry/LaundryTicketDashboard'
import { LaundryOrderManager } from '@/components/modules/laundry/LaundryOrderManager'
import { LaundryCustomerManager } from '@/components/modules/laundry/LaundryCustomerManager'
import { ServicePricing } from '@/components/modules/laundry/ServicePricing'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'

export default function Home() {
  return (
    <main className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col gap-8">
        <header className="border-b pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">TSysLab Industrial Ecosystem</h1>
            <p className="text-xl text-muted-foreground mt-2">Unified IT & Laundry Management Portal</p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-xs uppercase tracking-wider px-3 py-1 bg-blue-50 text-blue-700 border-blue-200">
              Enterprise v1.1
            </Badge>
          </div>
        </header>

        <Tabs defaultValue="analytics" className="w-full">
          <TabsList className="flex flex-wrap h-auto gap-2 bg-transparent p-0 mb-8">
            <TabsTrigger value="analytics" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white border">Analytics</TabsTrigger>
            <TabsTrigger value="reception" className="border">Reception</TabsTrigger>
            <TabsTrigger value="laundry-orders" className="border">Orders</TabsTrigger>
            <TabsTrigger value="laundry-crm" className="border">Customers</TabsTrigger>
            <TabsTrigger value="laundry-pricing" className="border">Pricing</TabsTrigger>
            <TabsTrigger value="laundry-cs" className="border">Customer Service</TabsTrigger>
            <TabsTrigger value="it-assets" className="border">IT Assets</TabsTrigger>
            <TabsTrigger value="it-infra" className="border">Infrastructure</TabsTrigger>
            <TabsTrigger value="it-tickets" className="border">IT Support</TabsTrigger>
            <TabsTrigger value="it-vault" className="border">Vault</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics">
            <GlobalMetrics />
          </TabsContent>

          <TabsContent value="reception">
            <ReceptionDesk />
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
