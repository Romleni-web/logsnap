import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import client from '../api/client';
import { Users, Activity, TrendingUp, ShieldCheck, Loader2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function Admin() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const res = await client.get('/api/admin/stats');
        setStats(res.data);
      } catch (err) {
        console.error("Access Denied: Admin privileges required.");
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, []);

  if (loading) return (
    <Layout>
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    </Layout>
  );

  const cards = [
    { label: 'Total Users', value: stats?.total_users, icon: Users, color: 'text-blue-600' },
    { label: 'System Runs', value: stats?.total_runs, icon: Activity, color: 'text-emerald-600' },
    { label: 'Pro Members', value: stats?.pro_users, icon: ShieldCheck, color: 'text-amber-600' },
    { label: 'Conversion', value: `${stats?.conversion_rate}%`, icon: TrendingUp, color: 'text-purple-600' },
  ];

  return (
    <Layout>
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-black">Site Administration</h2>
        <p className="text-gray-500 text-xs font-medium uppercase tracking-widest mt-1">Platform-wide Insights & Monitoring</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card, idx) => (
          <div key={idx} className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{card.label}</span>
              <card.icon className={card.color} size={18} />
            </div>
            <p className="text-2xl font-bold text-black">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
          <h3 className="text-sm font-bold text-black mb-6 uppercase tracking-wider">Debug Activity (Last 7 Days)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.daily_activity}>
                <defs>
                  <linearGradient id="colorRuns" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{fontSize: 10, fill: '#9ca3af'}}
                    dy={10}
                />
                <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{fontSize: 10, fill: '#9ca3af'}}
                />
                <Tooltip
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="runs" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorRuns)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
          <h3 className="text-sm font-bold text-black mb-6 uppercase tracking-wider">Recent Users</h3>
          <div className="space-y-4">
            {stats?.users_list?.map((u) => (
              <div key={u.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-black truncate">{u.email}</p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-tighter">{u.plan} plan</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-gray-900">{u.usage_count} runs</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
