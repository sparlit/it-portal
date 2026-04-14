import { ITTicketDashboard } from '@/components/modules/it/ITTicketDashboard'
import { LaundryTicketDashboard } from '@/components/modules/laundry/LaundryTicketDashboard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function Home() {
  return (
    <main className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col gap-8">
        <header className="border-b pb-4">
          <h1 className="text-4xl font-extrabold tracking-tight">TSysLab Industrial Ecosystem</h1>
          <p className="text-xl text-muted-foreground mt-2">Unified IT & Laundry Management Portal</p>
        </header>

        <Tabs defaultValue="it" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="it">IT Management</TabsTrigger>
            <TabsTrigger value="laundry">Laundry Management</TabsTrigger>
          </TabsList>

          <TabsContent value="it">
            <ITTicketDashboard />
          </TabsContent>

          <TabsContent value="laundry">
            <LaundryTicketDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
