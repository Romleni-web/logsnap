import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import StatsCards from '../components/StatsCards';
import HistoryTable from '../components/HistoryTable';
import client from '../api/client';
import { Terminal, Code, Plus, Sparkles, X, Link as LinkIcon, FileText, Loader2, Cpu } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [debugData, setDebugData] = useState({
    log: '',
    code: '',
    repo_url: '',
    file_path: ''
  });

  const fetchData = async () => {
    try {
      const [statsRes, historyRes] = await Promise.all([
        client.get('/api/dashboard/stats'),
        client.get('/api/dashboard/history')
      ]);
      setStats(statsRes.data);
      setHistory(historyRes.data);
    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDebug = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await client.post('/api/debug', debugData);
      setShowModal(false);
      setDebugData({ log: '', code: '', repo_url: '', file_path: '' });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.detail || "Debug failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-blue-500 font-display font-black tracking-widest text-xs">
            <Cpu size={14} className="animate-pulse" />
            SYSTEM STATUS: OPERATIONAL
          </div>
          <h2 className="text-5xl font-display font-black tracking-tighter text-white italic">
            OPERATIONS <span className="text-blue-500 underline decoration-4 underline-offset-8">HUB</span>
          </h2>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary py-4 px-10 rounded-xl flex items-center gap-3 group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
          <span>INITIALIZE DEBUG</span>
        </button>
      </div>

      <StatsCards stats={stats} />

      <div className="space-y-6">
        <div className="flex items-center justify-between ml-1">
          <div className="flex items-center gap-3 text-slate-500 font-display font-bold tracking-[0.3em] text-[10px]">
            <div className="w-8 h-[2px] bg-blue-600"></div>
            MISSION LOGS
          </div>
        </div>
        <HistoryTable history={history} loading={loading} />
      </div>

      {/* Debug Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-[#000]/90 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="glass-card w-full max-w-3xl rounded-3xl overflow-hidden border-2 border-slate-800 animate-in fade-in zoom-in duration-300">
            <div className="p-10 border-b border-slate-800 flex justify-between items-center bg-slate-900/40">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20">
                   <Sparkles className="text-white fill-white" size={24} />
                </div>
                <h3 className="text-3xl font-display font-black italic tracking-tighter text-white uppercase">AI ANALYTICS ENGINE</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-3 hover:bg-slate-800 rounded-full text-slate-500 hover:text-white transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleDebug} className="p-10 space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 tracking-widest uppercase flex items-center gap-2">
                    <LinkIcon size={12} className="text-blue-500" /> REPOSITORY URL
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="https://github.com/user/repo"
                    className="w-full input-field"
                    value={debugData.repo_url}
                    onChange={e => setDebugData({...debugData, repo_url: e.target.value})}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 tracking-widest uppercase flex items-center gap-2">
                    <FileText size={12} className="text-blue-500" /> FILE PATH
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="src/main.py"
                    className="w-full input-field"
                    value={debugData.file_path}
                    onChange={e => setDebugData({...debugData, file_path: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 tracking-widest uppercase flex items-center gap-2">
                  <Terminal size={12} className="text-red-500" /> ERROR DATA
                </label>
                <textarea
                  required
                  rows="3"
                  className="w-full input-field font-mono"
                  value={debugData.log}
                  onChange={e => setDebugData({...debugData, log: e.target.value})}
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 tracking-widest uppercase flex items-center gap-2">
                  <Code size={12} className="text-emerald-500" /> CONTEXT CODE
                </label>
                <textarea
                  required
                  rows="4"
                  className="w-full input-field font-mono"
                  value={debugData.code}
                  onChange={e => setDebugData({...debugData, code: e.target.value})}
                />
              </div>

              <div className="pt-4 flex flex-col items-center gap-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary py-5 rounded-2xl flex items-center justify-center gap-4 text-xl italic font-black shadow-blue-600/30"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={24} />
                      <span>ANALYZING...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={24} className="fill-white" />
                      <span>EXECUTE AUTO-FIX</span>
                    </>
                  )}
                </button>
                <p className="text-[10px] text-slate-600 font-black tracking-widest uppercase">
                  LogSnap v27.5 // AI-POWERED DEBUGGING INTERFACE
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
