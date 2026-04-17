'use client';

import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  AlertCircle,
  CheckCircle2,
  BarChart3,
  Globe,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const ExecutiveDashboard = () => {
  const [metrics, setMetrics] = useState({
    totalRevenue: '458.2k',
    activeUsers: 142,
    systemUptime: '99.99%',
    operationalEfficiency: '88.4%',
    openTickets: 24,
    pendingProcurements: 12
  });

  return (
    <div className="space-y-8 p-1">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter italic flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            Executive Intelligence Overview
          </h2>
          <p className="text-slate-500 font-medium text-sm mt-1">Consolidated metrics from all industrial nodes</p>
        </div>
        <div className="flex items-center gap-2">
           <Badge className="bg-emerald-500 text-white border-none px-3 py-1 font-black text-[10px] tracking-widest uppercase">
              Global Status: Optimal
           </Badge>
           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last Sync: Just Now</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Consolidated Revenue" value={`$${metrics.totalRevenue}`} trend="+12.5%" icon={<DollarSign className="text-emerald-500" />} />
        <KpiCard title="Avg Operational OEE" value={metrics.operationalEfficiency} trend="+2.1%" icon={<Zap className="text-amber-500" />} />
        <KpiCard title="Active Workforce" value={metrics.activeUsers} trend="+8" icon={<Users className="text-blue-500" />} />
        <KpiCard title="Global Support Load" value={metrics.openTickets} trend="-4" icon={<Activity className="text-red-500" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-2 shadow-xl rounded-[40px] overflow-hidden">
          <CardHeader className="bg-slate-900 text-white p-8">
            <CardTitle className="flex items-center gap-3 text-2xl font-black italic uppercase tracking-tighter">
              <Activity className="h-6 w-6 text-blue-400" />
              Real-Time Performance Matrix
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-8">
              <PerformanceRow label="IT Infrastructure" value={98} color="bg-blue-500" />
              <PerformanceRow label="Laundry Production" value={82} color="bg-emerald-500" />
              <PerformanceRow label="Fleet Utilization" value={91} color="bg-amber-500" />
              <PerformanceRow label="Procurement Lifecycle" value={74} color="bg-indigo-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-xl rounded-[40px] overflow-hidden bg-slate-50">
          <CardHeader className="p-8">
            <CardTitle className="text-xl font-black uppercase tracking-tighter flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              System Integrity
            </CardTitle>
          </CardHeader>
          <CardContent className="px-8 pb-8 space-y-6">
             <StatusItem label="Encrypted Vault" status="Secure" icon={<ShieldCheck size={16} className="text-emerald-500" />} />
             <StatusItem label="PostgreSQL Nodes" status="Healthy" icon={<Activity size={16} className="text-emerald-500" />} />
             <StatusItem label="API Gateways" status="Active" icon={<Globe size={16} className="text-blue-500" />} />
             <StatusItem label="Audit Sentinel" status="Monitoring" icon={<Zap size={16} className="text-amber-500" />} />

             <div className="pt-6 border-t border-slate-200">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 text-center">
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Uptime Score</p>
                   <p className="text-4xl font-black text-slate-900 tracking-tighter italic">{metrics.systemUptime}</p>
                </div>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const KpiCard = ({ title, value, trend, icon }: any) => (
  <Card className="border-2 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-[35px] overflow-hidden group">
    <CardContent className="p-8">
      <div className="flex justify-between items-start mb-6">
        <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-slate-900 group-hover:text-white transition-all duration-500">
          {icon}
        </div>
        <Badge variant="secondary" className="text-[10px] font-black tracking-widest text-emerald-600 bg-emerald-50 border-emerald-100">
          {trend}
        </Badge>
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">{title}</p>
      <h3 className="text-3xl font-black text-slate-900 tracking-tighter italic">{value}</h3>
    </CardContent>
  </Card>
);

const PerformanceRow = ({ label, value, color }: any) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center px-1">
      <span className="text-sm font-black uppercase tracking-widest text-slate-700">{label}</span>
      <span className="text-sm font-black italic">{value}%</span>
    </div>
    <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200 p-0.5">
      <div
        className={`h-full rounded-full ${color} shadow-[0_0_10px_rgba(0,0,0,0.1)] transition-all duration-1000`}
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);

const StatusItem = ({ label, status, icon }: any) => (
  <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
    <div className="flex items-center gap-3">
      {icon}
      <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">{label}</span>
    </div>
    <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{status}</span>
  </div>
);
