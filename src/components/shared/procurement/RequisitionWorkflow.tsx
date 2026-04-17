'use client';

import React from 'react';
import { Shield, Package, ShoppingCart, CreditCard, XCircle, CheckCircle2 } from 'lucide-react';

const steps = [
  { id: 'pending', label: 'Dept Head', icon: Shield },
  { id: 'dept_approved', label: 'Stores', icon: Package },
  { id: 'stores_approved', label: 'Purchase', icon: ShoppingCart },
  { id: 'purchase_approved', label: 'Finance', icon: CreditCard },
  { id: 'finance_approved', label: 'Issued', icon: CheckCircle2 },
];

export const RequisitionWorkflow = ({ currentStatus }: { currentStatus: string }) => {
  if (currentStatus === 'rejected') {
    return (
      <div className="flex items-center gap-2 p-3 bg-red-500/10 text-red-500 rounded-xl border border-red-500/20">
        <XCircle size={18} />
        <span className="text-[10px] font-black uppercase tracking-widest">Requisition Rejected</span>
      </div>
    );
  }

  const activeIndex = steps.findIndex(s => s.id === currentStatus);

  return (
    <div className="flex items-center gap-1">
      {steps.map((step, idx) => {
        const Icon = step.icon;
        const isPassed = activeIndex >= idx;
        const isCurrent = activeIndex === idx;

        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center gap-1 group relative">
               <div className={`p-1.5 rounded-lg border transition-all ${
                 isCurrent ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_10px_rgba(37,99,235,0.4)]' :
                 isPassed ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' :
                 'bg-slate-900 border-slate-800 text-slate-600'
               }`}>
                  <Icon size={14} />
               </div>
               {/* Tooltip */}
               <div className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity bg-white text-slate-900 text-[8px] px-1.5 py-0.5 rounded font-black uppercase whitespace-nowrap z-10">
                  {step.label}
               </div>
            </div>
            {idx < steps.length - 1 && (
              <div className={`w-3 h-[2px] ${isPassed ? 'bg-emerald-500/30' : 'bg-slate-800'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
