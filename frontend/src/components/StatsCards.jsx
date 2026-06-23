import React from 'react';
import { Activity, ShieldCheck, Clock, CreditCard } from 'lucide-react';

export default function StatsCards({ stats }) {
  const cards = [
    {
      label: 'TOTAL DEBUG RUNS',
      value: stats?.total_runs || 0,
      icon: Activity,
      color: 'border-blue-500/30',
      iconColor: 'text-blue-500',
      bg: 'bg-blue-500/5'
    },
    {
      label: 'CACHED HITS',
      value: `${stats?.cached_hits || 0}%`,
      icon: ShieldCheck,
      color: 'border-emerald-500/30',
      iconColor: 'text-emerald-500',
      bg: 'bg-emerald-500/5'
    },
    {
      label: 'REMAINING RUNS',
      value: stats?.remaining_runs || 0,
      icon: Clock,
      color: 'border-amber-500/30',
      iconColor: 'text-amber-500',
      bg: 'bg-amber-500/5'
    },
    {
      label: 'CURRENT PLAN',
      value: stats?.plan?.toUpperCase() || 'FREE',
      icon: CreditCard,
      color: 'border-[#d4af37]/30',
      iconColor: 'text-[#d4af37]',
      bg: 'bg-[#d4af37]/5'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {cards.map((card, idx) => (
        <div key={idx} className={`glass-card p-6 rounded-2xl border-b-4 ${card.color} relative group overflow-hidden`}>
          <div className="flex items-center justify-between mb-6">
            <span className="text-[10px] font-black tracking-[0.2em] text-slate-500 group-hover:text-slate-300 transition-colors">{card.label}</span>
            <card.icon className={card.iconColor} size={18} />
          </div>
          <div className="flex items-end gap-2">
            <p className="text-4xl font-display font-black text-white">{card.value}</p>
          </div>
          <div className={`absolute bottom-0 right-0 w-24 h-24 ${card.bg} blur-3xl -mb-12 -mr-12 rounded-full pointer-events-none opacity-50`}></div>
        </div>
      ))}
    </div>
  );
}
