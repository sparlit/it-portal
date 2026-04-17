'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Package, ShieldCheck, Truck } from 'lucide-react';

export default function SupplierLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would hit /api/core/auth/login with a 'supplier' role check
    if (email && password) {
       router.push('/portal/supplier');
    } else {
       setError('Please enter valid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-indigo-600 p-8 text-center text-white">
          <div className="inline-flex p-4 bg-white/10 rounded-full mb-4">
            <Truck size={40} />
          </div>
          <h1 className="text-2xl font-bold">Artemis Supplier Gateway</h1>
          <p className="text-indigo-100 mt-2">Industrial Procurement & Logistics</p>
        </div>

        <form onSubmit={handleLogin} className="p-8 space-y-6">
          {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Supplier ID / Email</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
              placeholder="VND-XXXX-YYYY"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Access Token</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
              placeholder="••••••••"
            />
          </div>

          <button className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transform hover:scale-[1.02] transition-all">
            Enter Gateway
          </button>

          <div className="pt-4 border-t flex items-center justify-center gap-4 text-gray-400">
             <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider">
               <ShieldCheck size={12} /> Secure Partner
             </div>
             <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider">
               <Package size={12} /> Stock Sync
             </div>
          </div>
        </form>
      </div>
    </div>
  );
}
