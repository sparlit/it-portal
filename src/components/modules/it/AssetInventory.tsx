"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Plus,
  Monitor,
  Server,
  Printer,
  Wifi,
  Search,
  History,
  AlertCircle
} from 'lucide-react'

interface Asset {
  id: string;
  name: string;
  type: string;
  model: string;
  serialNumber: string;
  location: string;
  ipAddress?: string;
  status: string;
  assignedTo?: string;
}

export function AssetInventory() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAssets() {
      try {
        const response = await fetch('/api/it/assets')
        const data = await response.json()
        if (Array.isArray(data)) {
          setAssets(data)
        }
      } catch (error) {
        console.error('Failed to fetch assets:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchAssets()
  }, [])

  const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'computer': return <Monitor className="h-4 w-4" />;
      case 'server': return <Server className="h-4 w-4" />;
      case 'printer': return <Printer className="h-4 w-4" />;
      case 'network': return <Wifi className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">IT Asset Inventory</h2>
          <p className="text-muted-foreground">Manage and track company hardware and infrastructure.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Asset
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <Monitor className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assets.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Infrastructure</CardTitle>
            <Server className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {assets.filter(a => a.type === 'server').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" /> Registered Hardware
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? (
              <p>Loading inventory...</p>
            ) : assets.length === 0 ? (
              <p className="text-center text-muted-foreground py-10">No assets registered.</p>
            ) : (
              <div className="rounded-md border overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b">
                    <tr>
                      <th className="text-left p-3 font-medium">Asset</th>
                      <th className="text-left p-3 font-medium">Type</th>
                      <th className="text-left p-3 font-medium">Serial / IP</th>
                      <th className="text-left p-3 font-medium">Location</th>
                      <th className="text-left p-3 font-medium">Status</th>
                      <th className="text-right p-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {assets.map((asset) => (
                      <tr key={asset.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3">
                          <div className="font-medium">{asset.name}</div>
                          <div className="text-xs text-muted-foreground">{asset.model}</div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            {getIcon(asset.type)}
                            <span className="capitalize">{asset.type}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="font-mono text-xs">{asset.serialNumber}</div>
                          {asset.ipAddress && <div className="text-xs text-blue-600 font-mono">{asset.ipAddress}</div>}
                        </td>
                        <td className="p-3">{asset.location}</td>
                        <td className="p-3">
                          <Badge variant={asset.status === 'active' ? 'success' : 'destructive'}>
                            {asset.status}
                          </Badge>
                        </td>
                        <td className="p-3 text-right">
                          <Button variant="ghost" size="icon">
                            <History className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
