import React from 'react';
import { Activity, ShieldCheck, Clock, CreditCard } from 'lucide-react';

export default function StatsCards({ stats }) {
  const cards = [
    {
      label: 'Total Debug Runs',
      value: stats?.total_runs || 0,
      icon: Activity,
      color: 'text-blue-500'
    },
    {
      label: 'Cached Hits',
      value: `${stats?.cached_hits || 0}%`,
      icon: ShieldCheck,
      color: 'text-emerald-500'
    },
    {
      label: 'Remaining Runs',
      value: stats?.remaining_runs || 0,
      icon: Clock,
      color: 'text-amber-500'
    },
    {
      label: 'Current Plan',
      value: stats?.plan?.toUpperCase() || 'FREE',
      icon: CreditCard,
      color: 'text-purple-500'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, idx) => (
        <div key={idx} className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-slate-400 text-sm font-medium">{card.label}</p>
            <card.icon className={card.color} size={20} />
          </div>
          <p className="text-2xl font-bold">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
