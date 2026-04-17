'use client';

import React from 'react';
import { Navigation, MapPin, Truck, Phone, CheckCircle, AlertCircle } from 'lucide-react';

export default function DriverApp() {
  const currentTrip = {
    id: 'TRIP-772',
    from: 'Central Warehouse',
    to: 'Retail Outlet #09',
    cargo: 'Clean Linen - 200KG',
    status: 'en_route'
  };

  return (
    <div className="min-h-screen bg-emerald-50 text-slate-900 pb-20 font-sans">
      <header className="bg-emerald-600 text-white p-8 rounded-b-[50px] shadow-xl">
        <div className="flex justify-between items-start mb-6">
           <div>
             <h1 className="text-2xl font-black italic tracking-tighter uppercase">Logistics Live</h1>
             <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Operator: Mike Ross</p>
           </div>
           <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <Truck size={24} />
           </div>
        </div>

        <div className="bg-white/10 p-4 rounded-2xl border border-white/20 backdrop-blur-sm">
           <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest mb-2">
              <span>Current Task</span>
              <span className="text-emerald-300"># {currentTrip.id}</span>
           </div>
           <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
              <p className="font-bold">{currentTrip.to}</p>
           </div>
        </div>
      </header>

      <main className="p-6 space-y-6 -mt-6">
        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-emerald-100 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 bg-emerald-500 text-white rounded-bl-3xl">
              <Navigation size={20} />
           </div>

           <div className="space-y-6">
              <div className="flex gap-4">
                 <div className="flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full border-2 border-slate-300" />
                    <div className="w-0.5 h-12 bg-slate-200 border-dashed" />
                    <MapPin size={16} className="text-emerald-500" />
                 </div>
                 <div className="flex flex-col justify-between py-0.5">
                    <p className="text-[10px] font-black uppercase text-slate-400">Pickup</p>
                    <p className="text-sm font-bold">{currentTrip.from}</p>
                    <p className="text-[10px] font-black uppercase text-slate-400 mt-4">Destination</p>
                    <p className="text-sm font-bold">{currentTrip.to}</p>
                 </div>
              </div>
           </div>

           <div className="mt-8 flex gap-3">
              <button className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2">
                 <Phone size={14} /> Call Manager
              </button>
              <button className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2">
                 <CheckCircle size={14} /> Delivered
              </button>
           </div>
        </div>

        <button className="w-full p-6 bg-amber-500 rounded-[30px] flex items-center justify-between text-white font-black uppercase tracking-widest text-[10px] shadow-lg">
           <span>Report Vehicle Issue</span>
           <AlertCircle size={20} />
        </button>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-6 flex justify-around items-center">
         <Navigation size={24} className="text-emerald-600" />
         <Truck size={24} className="text-slate-300" />
         <CheckCircle size={24} className="text-slate-300" />
      </nav>
    </div>
  );
}
