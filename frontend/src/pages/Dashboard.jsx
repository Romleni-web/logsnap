import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import StatsCards from '../components/StatsCards';
import HistoryTable from '../components/HistoryTable';
import client from '../api/client';
import { Terminal, Code, GitPullRequest, Plus, Sparkles, X, Link as LinkIcon, FileText } from 'lucide-react';

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
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-white mb-2">Systems Overview</h2>
          <p className="text-slate-400 font-medium">Monitor your AI debugging performance and history.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary py-3 px-8 rounded-2xl flex items-center gap-2 group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
          <span className="text-lg">Start Debug Session</span>
        </button>
      </div>

      <StatsCards stats={stats} />

      <div className="space-y-6">
        <div className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-widest text-xs ml-1">
          <Activity size={14} className="text-blue-500" />
          Recent Activity
        </div>
        <HistoryTable history={history} loading={loading} />
      </div>

      {/* Debug Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-[#020617]/80 backdrop-blur-md flex items-center justify-center p-6 z-50">
          <div className="glass-card w-full max-w-3xl rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_-12px_rgba(59,130,246,0.3)] animate-in fade-in zoom-in duration-300">
            <div className="p-8 border-b border-slate-800/50 flex justify-between items-center bg-slate-900/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600/20 rounded-lg">
                   <Sparkles className="text-blue-400" size={20} />
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-white">New AI Debug Session</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleDebug} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-300 flex items-center gap-2">
                    <LinkIcon size={14} className="text-blue-500" /> Repository URL
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="https://github.com/user/repo"
                    className="w-full input-field py-3"
                    value={debugData.repo_url}
                    onChange={e => setDebugData({...debugData, repo_url: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-300 flex items-center gap-2">
                    <FileText size={14} className="text-blue-500" /> File Path
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="src/services/auth.py"
                    className="w-full input-field py-3"
                    value={debugData.file_path}
                    onChange={e => setDebugData({...debugData, file_path: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-300 flex items-center gap-2">
                  <Terminal size={14} className="text-red-400" /> Error Log Snippet
                </label>
                <textarea
                  required
                  rows="3"
                  placeholder="Paste the traceback or error message here..."
                  className="w-full input-field py-3 font-mono text-xs resize-none"
                  value={debugData.log}
                  onChange={e => setDebugData({...debugData, log: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-300 flex items-center gap-2">
                  <Code size={14} className="text-emerald-400" /> Affected Source Code
                </label>
                <textarea
                  required
                  rows="5"
                  placeholder="Paste the relevant function or class..."
                  className="w-full input-field py-3 font-mono text-xs resize-none"
                  value={debugData.code}
                  onChange={e => setDebugData({...debugData, code: e.target.value})}
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary py-4 rounded-2xl flex items-center justify-center gap-3 shadow-blue-900/40"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={24} />
                      <span className="text-lg font-bold">AI Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={24} className="fill-white" />
                      <span className="text-lg font-bold">Generate Fix & Open PR</span>
                    </>
                  )}
                </button>
                <p className="text-center text-xs text-slate-500 mt-4 font-medium">
                  LogSnap AI will analyze the code, generate a fix, create a new branch, and open a PR.
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
