import React from 'react';
import { Activity, ShieldCheck, Clock, CreditCard } from 'lucide-react';

export default function StatsCards({ stats }) {
  const cards = [
    {
      label: 'TOTAL DEBUG RUNS',
      value: stats?.total_runs || 0,
      icon: Activity,
    },
    {
      label: 'CACHED HITS',
      value: `${stats?.cached_hits || 0}%`,
      icon: ShieldCheck,
    },
    {
      label: 'REMAINING RUNS',
      value: stats?.remaining_runs || 0,
      icon: Clock,
    },
    {
      label: 'CURRENT PLAN',
      value: stats?.plan?.toUpperCase() || 'FREE',
      icon: CreditCard,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, idx) => (
        <div key={idx} className="bg-white border border-gray-200 p-5 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold tracking-wider text-gray-500">{card.label}</span>
            <card.icon className="text-blue-600" size={16} />
          </div>
          <div className="flex items-end gap-2">
            <p className="text-2xl font-bold text-black">{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
