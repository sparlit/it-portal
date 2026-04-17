'use client';

import React, { useState } from 'react';
import { Camera, CheckSquare, AlertTriangle, Hammer, ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

export default function TechMobileView() {
  const [checks, setChecks] = useState([
    { id: 1, label: 'Electrical Insulation Test', status: false },
    { id: 2, label: 'Mechanical Alignment', status: false },
    { id: 3, label: 'Lubrication Level Check', status: false },
    { id: 4, label: 'Safety Guard Integrity', status: false },
  ]);

  const toggleCheck = (id: number) => {
    setChecks(checks.map(c => c.id === id ? { ...c, status: !c.status } : c));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 font-sans">
      <header className="bg-slate-900 text-white p-6 sticky top-0 z-50 flex items-center justify-between">
        <Link href="/portal/maintenance" className="p-2 -ml-2">
           <ArrowLeft size={24} />
        </Link>
        <div className="text-center">
           <h1 className="text-sm font-black uppercase tracking-widest text-blue-400">WO-2024-889</h1>
           <p className="text-[10px] font-bold text-slate-400">BOILER #01 SERVICE</p>
        </div>
        <div className="w-10" />
      </header>

      <main className="p-6 space-y-8">
        <section>
          <h2 className="text-xs font-black uppercase tracking-tighter text-slate-400 mb-4 flex items-center gap-2">
            <CheckSquare size={14} /> Service Checklist
          </h2>
          <div className="space-y-3">
            {checks.map(check => (
              <button
                key={check.id}
                onClick={() => toggleCheck(check.id)}
                className={`w-full p-5 rounded-3xl border-2 text-left flex items-center justify-between transition-all ${
                  check.status ? 'bg-emerald-500 border-emerald-400 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-700'
                }`}
              >
                <span className="font-bold">{check.label}</span>
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                  check.status ? 'bg-white text-emerald-500 border-white' : 'border-slate-200'
                }`}>
                   {check.status && <CheckSquare size={20} />}
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-2 gap-4">
          <button className="flex flex-col items-center justify-center gap-3 bg-white p-8 rounded-[40px] border-2 border-slate-200 text-slate-500 font-bold active:scale-95 transition-transform">
             <Camera size={32} />
             <span className="text-[10px] uppercase">Attach Photo</span>
          </button>
          <button className="flex flex-col items-center justify-center gap-3 bg-amber-500 p-8 rounded-[40px] text-white font-bold active:scale-95 transition-transform">
             <AlertTriangle size={32} />
             <span className="text-[10px] uppercase text-amber-900">Log Hazard</span>
          </button>
        </section>

        <section>
           <textarea
             placeholder="Field observations / Parts used..."
             className="w-full p-6 rounded-[30px] border-2 border-slate-200 focus:border-blue-500 outline-none h-40 text-sm font-medium"
           />
        </section>
      </main>

      <div className="fixed bottom-6 left-6 right-6">
         <button className="w-full py-6 bg-slate-900 text-white rounded-[30px] font-black uppercase tracking-[0.2em] shadow-2xl flex items-center justify-center gap-3">
            <Save size={20} className="text-blue-500" />
            Complete Task
         </button>
      </div>
    </div>
  );
}
