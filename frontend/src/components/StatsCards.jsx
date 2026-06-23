import React from 'react';
import { Activity, ShieldCheck, Clock, CreditCard } from 'lucide-react';

export default function StatsCards({ stats }) {
  const cards = [
    {
      label: 'Total Debug Runs',
      value: stats?.total_runs || 0,
      icon: Activity,
      color: 'from-blue-600/20 to-blue-600/5',
      iconColor: 'text-blue-500'
    },
    {
      label: 'Cached Hits',
      value: `${stats?.cached_hits || 0}%`,
      icon: ShieldCheck,
      color: 'from-emerald-600/20 to-emerald-600/5',
      iconColor: 'text-emerald-500'
    },
    {
      label: 'Remaining Runs',
      value: stats?.remaining_runs || 0,
      icon: Clock,
      color: 'from-amber-600/20 to-amber-600/5',
      iconColor: 'text-amber-500'
    },
    {
      label: 'Current Plan',
      value: stats?.plan?.toUpperCase() || 'FREE',
      icon: CreditCard,
      color: 'from-purple-600/20 to-purple-600/5',
      iconColor: 'text-purple-500'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      {cards.map((card, idx) => (
        <div key={idx} className="glass-card p-6 rounded-2xl group hover:border-slate-700 transition-all duration-300">
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${card.color}`}>
              <card.icon className={card.iconColor} size={24} />
            </div>
          </div>
          <p className="text-slate-400 text-sm font-medium mb-1">{card.label}</p>
          <p className="text-3xl font-bold tracking-tight">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
