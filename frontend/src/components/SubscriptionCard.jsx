import React from 'react';
import client from '../api/client';
import { CreditCard, Zap, Crown, CheckCircle2 } from 'lucide-react';

export default function SubscriptionCard({ user, stats }) {
  const isFree = !stats?.plan || stats?.plan === 'free';

  const handleUpgrade = async () => {
    try {
      const response = await client.post('/api/auth/create-checkout', { user_id: user?.id });
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (err) {
      alert("Terminal Error: Checkout uplink failed. Contact system administrator.");
    }
  };

  return (
    <div className="glass-card rounded-[2rem] overflow-hidden border-b-4 border-[#d4af37]/30 relative group">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
        <Crown size={80} className="text-[#d4af37]" />
      </div>

      <div className="p-8 relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-[#d4af37]/10 rounded-lg">
            <CreditCard className="text-[#d4af37]" size={20} />
          </div>
          <span className="text-[10px] font-black tracking-[0.3em] text-slate-500 uppercase">Subscription Status</span>
        </div>

        <h3 className="text-3xl font-display font-black text-white italic mb-2 tracking-tighter uppercase">
          {isFree ? 'FREE' : 'PRO'}<span className="text-[#d4af37]"> TIER</span>
        </h3>

        <p className="text-xs font-bold text-slate-400 mb-8 leading-relaxed">
          {isFree
            ? `${stats?.remaining_runs || 0} debug cycles remaining in current window.`
            : 'Unlimited AI processing cycles active. System peak performance enabled.'}
        </p>

        <div className="space-y-4 mb-8">
           <div className="flex items-center gap-3 text-[10px] font-black text-slate-300 tracking-widest uppercase">
              <CheckCircle2 size={14} className="text-emerald-500" />
              {isFree ? 'BASIC AI ANALYTICS' : 'ELITE NEURAL PROCESSING'}
           </div>
           <div className="flex items-center gap-3 text-[10px] font-black text-slate-300 tracking-widest uppercase">
              <CheckCircle2 size={14} className="text-emerald-500" />
              {isFree ? 'PUBLIC REPO ACCESS' : 'FULL PRIVATE REPOSITORY UPLINK'}
           </div>
        </div>

        {isFree ? (
          <button
            onClick={handleUpgrade}
            className="w-full btn-primary py-4 rounded-xl flex items-center justify-center gap-3 group/btn relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[#d4af37] opacity-0 group-hover/btn:opacity-10 transition-opacity"></div>
            <Zap size={18} className="fill-white" />
            <span className="text-sm">UPGRADE TO PRO</span>
          </button>
        ) : (
          <div className="w-full py-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex items-center justify-center gap-3 text-emerald-500 font-display font-black text-[10px] tracking-widest">
            <Crown size={16} />
            PREMIUM ACCESS ACTIVE
          </div>
        )}
      </div>

      <div className="px-8 py-4 bg-white/5 border-t border-white/5 flex items-center justify-between">
        <span className="text-[9px] font-bold text-slate-600 tracking-widest">LOGSNAP SUBSCRIPTION ENGINE</span>
        <span className="text-[9px] font-black text-slate-500">v27.5</span>
      </div>
    </div>
  );
}
