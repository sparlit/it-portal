import { ITTicketDashboard } from '@/components/modules/it/ITTicketDashboard'
import { AssetInventory } from '@/components/modules/it/AssetInventory'
import { GlobalMetrics } from '@/components/modules/core/GlobalMetrics'
import { LaundryTicketDashboard } from '@/components/modules/laundry/LaundryTicketDashboard'
import { LaundryOrderManager } from '@/components/modules/laundry/LaundryOrderManager'
import { LaundryCustomerManager } from '@/components/modules/laundry/LaundryCustomerManager'
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

        <Tabs defaultValue="laundry-orders" className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="laundry-orders">Orders</TabsTrigger>
            <TabsTrigger value="laundry-crm">Customers</TabsTrigger>
            <TabsTrigger value="laundry-cs">Customer Service</TabsTrigger>
            <TabsTrigger value="it-assets">IT Assets</TabsTrigger>
            <TabsTrigger value="it-tickets">IT Support</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics">
            <GlobalMetrics />
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

          <TabsContent value="it-tickets">
            <ITTicketDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
