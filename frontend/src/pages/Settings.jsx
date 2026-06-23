import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import client from '../api/client';
import { Github, Save, Shield, Database, CreditCard, Sparkles, Loader2 } from 'lucide-react';
import SubscriptionCard from '../components/SubscriptionCard';

export default function Settings() {
  const [githubToken, setGithubToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await client.get('/api/dashboard/stats');
      setStats(res.data);
    } catch (err) {
      console.error("Failed to fetch stats", err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Simulation for MVP
      setTimeout(() => {
        alert("Configuration Uplink Successful: GitHub Token Stored.");
        setLoading(false);
      }, 1000);
    } catch (err) {
      alert("Uplink Failed.");
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-5xl space-y-12">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-blue-500 font-display font-black tracking-widest text-xs">
            <Shield size={14} />
            SECURITY PROTOCOLS // SYSTEM CONFIG
          </div>
          <h2 className="text-5xl font-display font-black tracking-tighter text-white italic uppercase">
            CONTROL <span className="text-blue-500 underline decoration-4 underline-offset-8">PANEL</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            {/* GitHub Section */}
            <div className="glass-card p-10 rounded-3xl border-l-4 border-l-blue-600 relative overflow-hidden">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-blue-600/10 rounded-xl">
                  <Github className="text-blue-500" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-display font-black text-white uppercase tracking-tight">GitHub Integration</h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Repository Access Uplink</p>
                </div>
              </div>

              <form onSubmit={handleSave} className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 tracking-widest uppercase ml-1">Personal Access Token</label>
                  <input
                    type="password"
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                    className="w-full input-field py-4"
                    value={githubToken}
                    onChange={e => setGithubToken(e.target.value)}
                  />
                  <div className="flex items-center gap-2 px-4 py-3 bg-slate-900/50 rounded-xl border border-slate-800/50">
                    <Database size={14} className="text-blue-500" />
                    <p className="text-[10px] text-slate-400 font-medium">
                      LogSnap requires the 'repo' scope to generate fixes and open Pull Requests.
                    </p>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary py-4 px-10 rounded-xl flex items-center gap-3 group"
                  >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    <span>SAVE CONFIGURATION</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Profile Section Placeholder */}
            <div className="glass-card p-10 rounded-3xl border-slate-800 opacity-50 cursor-not-allowed">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-800 rounded-xl">
                        <Sparkles className="text-slate-500" size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-display font-black text-slate-400 uppercase tracking-tight">Advanced AI Tuning</h3>
                        <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest underline decoration-red-500">Feature Locked // Pro Tier Required</p>
                    </div>
                </div>
            </div>
          </div>

          <div className="space-y-8">
             <div className="flex items-center gap-2 text-slate-500 font-display font-bold tracking-[0.3em] text-[10px] ml-1">
                <CreditCard size={14} className="text-[#d4af37]" />
                BILLING CENTER
             </div>
             <SubscriptionCard stats={stats} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
