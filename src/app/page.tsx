"use client"

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useI18n } from '@/lib/i18n/context'
import {
  Truck,
  ShieldCheck,
  Globe,
  Cpu,
  Waves,
  ChevronRight,
  Activity,
  Lock,
  Zap,
  Star,
  Mail,
  Phone,
  MapPin
} from 'lucide-react'
import landingContent from '@/lib/landing_content.json'

export default function LandingPage() {
  const { t, language, setLanguage } = useI18n()

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu': return <Cpu className="h-8 w-8" />
      case 'Waves': return <Waves className="h-8 w-8" />
      default: return <Zap className="h-8 w-8" />
    }
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 dark:bg-slate-950 dark:text-slate-100">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg shadow-lg shadow-blue-500/20">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase dark:text-white">Al Rayes</span>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="font-bold flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
            >
              <Globe className="h-4 w-4" />
              {language === 'en' ? 'العربية' : 'English'}
            </Button>
            <Link href="/login">
              <Button className="bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold px-6 hover:opacity-90 transition-opacity">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-24 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 overflow-hidden relative">
        <div className="absolute top-0 right-0 -mt-24 -mr-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="container mx-auto px-4 text-center max-w-4xl relative z-10">
          <Badge variant="outline" className="mb-8 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800 font-bold tracking-wider">
            {language === 'en' ? 'INDUSTRIAL STACK V1.4' : 'المنظومة الصناعية الإصدار 1.4'}
          </Badge>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-tight mb-8 bg-clip-text text-transparent bg-gradient-to-br from-slate-900 to-slate-500 dark:from-white dark:to-slate-400">
            {landingContent.hero.title}
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-12 leading-relaxed font-medium max-w-2xl mx-auto">
            {landingContent.hero.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/portal/laundry">
              <Button className="h-16 px-10 bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold w-full sm:w-auto shadow-2xl shadow-blue-500/20 transform hover:-translate-y-1 transition-all">
                {language === 'en' ? 'Laundry Operations' : 'عمليات المغاسل'} <ChevronRight className="ml-2 h-6 w-6" />
              </Button>
            </Link>
            <Link href="/portal/it">
              <Button variant="outline" className="h-16 px-10 text-xl font-bold w-full sm:w-auto border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transform hover:-translate-y-1 transition-all">
                {language === 'en' ? 'IT Infrastructure' : 'البنية التحتية'}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Portal Gateway Cards */}
      <section className="py-24 container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-10">
          {landingContent.portals.map((portal) => (
            <Card key={portal.name} className="group overflow-hidden border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-400 transition-all shadow-2xl hover:shadow-blue-500/10">
              <CardHeader className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/10 transition-colors py-10 px-10">
                <div className="flex justify-between items-start mb-8">
                  <div className={`p-5 rounded-2xl ${portal.name.includes('IT') ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'bg-blue-600 text-white'} shadow-xl`}>
                    {getIcon(portal.icon)}
                  </div>
                  <Badge variant="secondary" className="font-bold px-3 py-1 bg-white dark:bg-slate-800 shadow-sm">Enterprise Active</Badge>
                </div>
                <CardTitle className="text-4xl font-black tracking-tight dark:text-white">{portal.name}</CardTitle>
                <CardDescription className="text-xl font-medium mt-4 leading-relaxed text-slate-600 dark:text-slate-400">
                  {portal.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-10">
                <Link href={portal.link}>
                  <Button className="w-full h-14 text-lg font-bold group-hover:bg-blue-600 dark:group-hover:bg-blue-500 group-hover:text-white transition-all shadow-lg">
                    {language === 'en' ? 'Authorize & Access' : 'تفويض ودخول'}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Trust Signal / Feature Strip */}
      <section className="py-24 bg-slate-900 dark:bg-black text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-16 text-center">
            {landingContent.features.map((feature, idx) => (
              <div key={idx} className="space-y-6 group">
                <div className="mx-auto w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center mb-8 border border-blue-600/20 group-hover:scale-110 transition-transform">
                  {idx === 0 ? <Lock className="h-8 w-8 text-blue-400" /> : idx === 1 ? <Truck className="h-8 w-8 text-blue-400" /> : <Activity className="h-8 w-8 text-blue-400" />}
                </div>
                <h3 className="text-3xl font-bold tracking-tight">{feature.title}</h3>
                <p className="text-slate-400 text-lg font-medium leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-24 container mx-auto px-4 bg-white dark:bg-slate-950">
        <div className="max-w-4xl mx-auto text-center">
          <Star className="h-12 w-12 text-yellow-500 mx-auto mb-10 fill-current" />
          <div className="italic text-3xl md:text-4xl font-black text-slate-800 dark:text-slate-200 leading-tight mb-10">
            &quot;{landingContent.testimonials[0].quote}&quot;
          </div>
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800" />
            <div className="text-left">
              <div className="font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">{landingContent.testimonials[0].author}</div>
              <div className="text-slate-500 dark:text-slate-500 font-bold text-sm">Industrial Compliance Dept</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Map Strip */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/30 border-y border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-12 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start gap-4">
            <Mail className="h-6 w-6 text-blue-600" />
            <h4 className="font-bold uppercase tracking-widest text-xs text-slate-500">Global Support</h4>
            <p className="font-black text-lg">{landingContent.contact.email}</p>
          </div>
          <div className="flex flex-col items-center md:items-start gap-4">
            <Phone className="h-6 w-6 text-blue-600" />
            <h4 className="font-bold uppercase tracking-widest text-xs text-slate-500">Contact Line</h4>
            <p className="font-black text-lg">{landingContent.contact.phone}</p>
          </div>
          <div className="flex flex-col items-center md:items-start gap-4">
            <MapPin className="h-6 w-6 text-blue-600" />
            <h4 className="font-bold uppercase tracking-widest text-xs text-slate-500">Regional Node</h4>
            <p className="font-black text-lg">{landingContent.contact.address}</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 dark:bg-slate-950">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-blue-600" />
            <span className="font-black tracking-tighter uppercase">TSysLab Industrial</span>
          </div>
          <p className="text-slate-500 text-sm font-bold order-3 md:order-2">© 2024 Al Rayes Laundry & Dry Cleaning. Qatar.</p>
          <div className="flex gap-10 order-2 md:order-3">
            <Link href="#" className="text-sm font-bold hover:text-blue-600 transition-colors">Infrastructure Status</Link>
            <Link href="#" className="text-sm font-bold hover:text-blue-600 transition-colors">Governance</Link>
            <Link href="#" className="text-sm font-bold hover:text-blue-600 transition-colors">Compliance</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
