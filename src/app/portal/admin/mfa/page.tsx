'use client';

import React, { useState } from 'react';
import { ShieldCheck, Copy, Check, RefreshCw } from 'lucide-react';

export default function MFASetup() {
  const [secret, setSecret] = useState('JBSWY3DPEHPK3PXP'); // Mock secret
  const [qrCode, setQrCode] = useState('');
  const [step, setStep] = useState(1);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    // In a real implementation, this calls MFAService via an API route
    setQrCode('https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/Artemis:Admin?secret=' + secret);
    setStep(2);
  };

  return (
    <div className="max-w-xl mx-auto p-12 bg-white rounded-[40px] shadow-2xl border border-slate-100">
      <div className="text-center mb-10">
         <div className="w-20 h-20 bg-blue-600 text-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <ShieldCheck size={40} />
         </div>
         <h1 className="text-3xl font-black italic uppercase tracking-tighter">Secure Your Identity</h1>
         <p className="text-slate-500 font-medium">Multi-Factor Authentication (MFA)</p>
      </div>

      {step === 1 ? (
        <div className="space-y-6 text-center">
           <p className="text-sm text-slate-600 leading-relaxed">
             Adding a second layer of security ensures that your industrial credentials remain protected even if your password is compromised.
           </p>
           <button
             onClick={handleGenerate}
             className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg flex items-center justify-center gap-3"
           >
             <RefreshCw size={20} />
             Setup Authenticator
           </button>
        </div>
      ) : (
        <div className="space-y-8 flex flex-col items-center">
           <div className="p-4 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
              {qrCode ? <img src={qrCode} alt="QR Code" className="w-48 h-48" /> : <div className="w-48 h-48 bg-slate-100 animate-pulse rounded-2xl" />}
           </div>

           <div className="w-full">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Manual Entry Key</label>
              <div className="flex items-center gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                 <code className="flex-1 font-mono font-bold text-blue-600">{secret}</code>
                 <button
                   onClick={() => { navigator.clipboard.writeText(secret); setCopied(true); }}
                   className="p-2 text-slate-400 hover:text-blue-600"
                 >
                    {copied ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
                 </button>
              </div>
           </div>

           <div className="w-full space-y-4">
              <input
                type="text"
                placeholder="000 000"
                className="w-full p-5 text-center text-4xl font-black tracking-[0.5em] rounded-2xl border-2 border-slate-200 focus:border-blue-500 outline-none"
              />
              <button className="w-full py-5 bg-blue-600 text-white rounded-3xl font-black uppercase tracking-widest shadow-xl">
                 Verify & Activate
              </button>
           </div>
        </div>
      )}
    </div>
  );
}
