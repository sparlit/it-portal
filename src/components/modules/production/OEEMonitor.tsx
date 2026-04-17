'use client';

import React from 'react';
import { Activity, Zap, Droplets, Target } from 'lucide-react';

export const OEEMonitor = ({ oee, power, water }: { oee: number, power?: number, water?: number }) => {
  const getOEEColor = (val: number) => {
    if (val >= 0.85) return 'text-emerald-500';
    if (val >= 0.65) return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-slate-950 p-8 rounded-3xl border border-slate-800 flex flex-col items-center justify-center text-center shadow-xl">
        <Target size={32} className="text-blue-500 mb-4" />
        <h3 className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] mb-2">Overall Effectiveness</h3>
        <div className={`text-6xl font-black italic tracking-tighter ${getOEEColor(oee)}`}>
          {(oee * 100).toFixed(1)}%
        </div>
        <p className="mt-4 text-[10px] text-slate-500 font-bold max-w-[200px]">World-class OEE is typically >85%</p>
      </div>

      <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800 flex flex-col justify-between">
         <div className="flex justify-between items-start">
            <Zap size={24} className="text-amber-500" />
            <div className="text-[10px] font-black bg-amber-500/10 text-amber-500 px-2 py-1 rounded">LIVE LOAD</div>
         </div>
         <div>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Energy Consumption</p>
            <div className="text-4xl font-black text-slate-100">{power || '42.5'} <span className="text-sm font-medium text-slate-500 italic">kWh</span></div>
         </div>
      </div>

      <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800 flex flex-col justify-between">
         <div className="flex justify-between items-start">
            <Droplets size={24} className="text-blue-400" />
            <div className="text-[10px] font-black bg-blue-500/10 text-blue-400 px-2 py-1 rounded">NOMINAL</div>
         </div>
         <div>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Water Utilization</p>
            <div className="text-4xl font-black text-slate-100">{water || '1.2k'} <span className="text-sm font-medium text-slate-500 italic">L</span></div>
         </div>
      </div>
    </div>
  );
};
