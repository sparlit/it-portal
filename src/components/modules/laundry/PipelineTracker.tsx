'use client';

import React from 'react';
import { CheckCircle, Clock, PlayCircle } from 'lucide-react';

interface Stage {
  name: string;
  status: 'pending' | 'in_progress' | 'completed';
}

export const PipelineTracker = ({ stages }: { stages: Stage[] }) => {
  return (
    <div className="flex items-center justify-between w-full max-w-4xl mx-auto p-6 bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
      {stages.map((stage, idx) => (
        <React.Fragment key={stage.name}>
          <div className="flex flex-col items-center gap-2 group relative">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
              stage.status === 'completed' ? 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)]' :
              stage.status === 'in_progress' ? 'bg-blue-500 animate-pulse' : 'bg-slate-700 opacity-40'
            }`}>
              {stage.status === 'completed' ? <CheckCircle size={24} className="text-white" /> :
               stage.status === 'in_progress' ? <PlayCircle size={24} className="text-white" /> :
               <Clock size={24} className="text-white" />}
            </div>
            <span className={`text-[10px] font-black uppercase tracking-widest ${
              stage.status === 'pending' ? 'text-slate-500' : 'text-slate-200'
            }`}>{stage.name}</span>

            {/* Tooltip */}
            <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-white text-slate-900 text-[10px] px-2 py-1 rounded whitespace-nowrap font-bold">
               Status: {stage.status.replace('_', ' ')}
            </div>
          </div>

          {idx < stages.length - 1 && (
            <div className={`flex-1 h-1 mx-2 rounded-full ${
              stage.status === 'completed' ? 'bg-emerald-500/30' : 'bg-slate-800'
            }`}>
               <div className={`h-full rounded-full transition-all duration-1000 ${
                 stage.status === 'completed' ? 'w-full bg-emerald-500' : 'w-0'
               }`} />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
