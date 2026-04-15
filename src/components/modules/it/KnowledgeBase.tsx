"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, BookOpen, ExternalLink, Hash, Plus } from 'lucide-react'

export function KnowledgeBase() {
  const [search, setSearch] = useState('')

  const articles = [
    { id: '1', title: 'VPN Connection Guide', category: 'Network', tags: ['remote', 'security'] },
    { id: '2', title: 'Printer Troubleshooting', category: 'Hardware', tags: ['office', 'print'] },
    { id: '3', title: 'ERP Password Reset', category: 'Software', tags: ['account', 'auth'] },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search documentation..."
            className="pl-10"
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          />
        </div>
        <Button className="bg-slate-900 text-white gap-2">
           <Plus className="h-4 w-4" /> New Article
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map(article => (
          <Card key={article.id} className="hover:border-blue-500 transition-colors cursor-pointer group">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 px-2 py-0.5 bg-blue-50 rounded">
                  {article.category}
                </span>
                <ExternalLink className="h-4 w-4 text-slate-300 group-hover:text-blue-500" />
              </div>
              <CardTitle className="text-lg pt-2">{article.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 flex-wrap">
                {article.tags.map(tag => (
                  <span key={tag} className="flex items-center gap-1 text-xs text-slate-500">
                    <Hash className="h-3 w-3" /> {tag}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-slate-50 border-dashed border-2">
        <CardContent className="flex flex-col items-center justify-center py-12">
           <BookOpen className="h-12 w-12 text-slate-300 mb-4" />
           <p className="text-slate-500 font-medium">Need more help? Check our <span className="text-blue-600 underline">Internal Wiki</span></p>
        </CardContent>
      </Card>
    </div>
  )
}
