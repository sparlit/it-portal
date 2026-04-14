"use client"

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useI18n } from '@/lib/i18n/context'
import {
  Truck,
  Settings,
  ShieldCheck,
  Globe,
  Cpu,
  Waves,
  ChevronRight,
  Activity,
  Lock,
  Zap
} from 'lucide-react'
import landingContent from '@/lib/landing_content.json'

export default function LandingPage() {
  const { t, language, setLanguage } = useI18n()

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase">Al Rayes</span>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="font-bold flex items-center gap-2"
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
            >
              <Globe className="h-4 w-4" />
              {language === 'en' ? 'العربية' : 'English'}
            </Button>
            <Link href="/login">
              <Button className="bg-slate-900 font-bold px-6">Login</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-slate-50">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <Badge variant="outline" className="mb-6 px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 border-blue-200 font-bold animate-fade-in">
            {language === 'en' ? 'INDUSTRIAL STACK V1.3' : 'المنظومة الصناعية الإصدار 1.3'}
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-br from-slate-900 to-slate-600">
            {landingContent.hero.title}
          </h1>
          <p className="text-xl text-slate-600 mb-10 leading-relaxed font-medium">
            {landingContent.hero.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/portal/laundry">
              <Button className="h-14 px-8 bg-blue-600 hover:bg-blue-700 text-lg font-bold w-full sm:w-auto shadow-lg shadow-blue-200">
                {language === 'en' ? 'Laundry Operations' : 'عمليات المغاسل'} <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/portal/it">
              <Button variant="outline" className="h-14 px-8 text-lg font-bold w-full sm:w-auto border-slate-300">
                {language === 'en' ? 'IT Infrastructure' : 'البنية التحتية'}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Portal Gateway Cards */}
      <section className="py-20 container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
          {landingContent.portals.map((portal) => (
            <Card key={portal.id} className="group overflow-hidden border-slate-200 hover:border-blue-500 transition-all shadow-xl hover:shadow-2xl">
              <CardHeader className="bg-slate-50 border-b group-hover:bg-blue-50 transition-colors py-8 px-8">
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-4 rounded-2xl ${portal.id === 'it' ? 'bg-slate-900 text-white' : 'bg-blue-600 text-white'} shadow-lg`}>
                    {portal.id === 'it' ? <Cpu className="h-8 w-8" /> : <Waves className="h-8 w-8" />}
                  </div>
                  <Badge variant="secondary" className="font-bold">Module Active</Badge>
                </div>
                <CardTitle className="text-3xl font-black tracking-tight">{portal.title}</CardTitle>
                <CardDescription className="text-lg font-medium mt-2">{portal.description}</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-4 mb-8">
                  {portal.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3 font-bold text-slate-700">
                      <Zap className="h-5 w-5 text-blue-500" /> {feature}
                    </div>
                  ))}
                </div>
                <Link href={portal.link}>
                  <Button className="w-full h-12 font-bold group-hover:bg-blue-600 group-hover:text-white transition-all">
                    Enter Portal
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            {landingContent.features.map((feature, idx) => (
              <div key={idx} className="space-y-4">
                <div className="mx-auto w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20">
                  {idx === 0 ? <Lock className="h-6 w-6" /> : idx === 1 ? <Truck className="h-6 w-6" /> : <Activity className="h-6 w-6" />}
                </div>
                <h3 className="text-2xl font-bold">{feature.title}</h3>
                <p className="text-slate-400 font-medium leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-20 container mx-auto px-4 text-center">
        <div className="max-w-2xl mx-auto italic text-2xl font-medium text-slate-700">
          "{landingContent.testimonials[0].quote}"
        </div>
        <div className="mt-4 font-black uppercase tracking-widest text-blue-600">
          - {landingContent.testimonials[0].author}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t bg-slate-50">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-blue-600" />
            <span className="font-bold">TSysLab Industrial Stack</span>
          </div>
          <p className="text-slate-500 text-sm font-bold">© 2024 Al Rayes Laundry & Dry Cleaning. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="text-sm font-bold hover:text-blue-600">Status</Link>
            <Link href="#" className="text-sm font-bold hover:text-blue-600">Legal</Link>
            <Link href="#" className="text-sm font-bold hover:text-blue-600">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
