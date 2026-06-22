import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import StatsCards from '../components/StatsCards';
import HistoryTable from '../components/HistoryTable';
import client from '../api/client';
import { ExternalLink, Terminal, Code } from 'lucide-react';

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
      fetchData();
    } catch (err) {
      alert(err.response?.data?.detail || "Debug failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold">Welcome Back</h2>
          <p className="text-slate-400">Here's what's happening with your projects.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Debug Now
        </button>
      </div>

      <StatsCards stats={stats} />

      <HistoryTable history={history} loading={loading} />

      {/* Debug Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-700 flex justify-between items-center">
              <h3 className="text-xl font-bold">New Debug Session</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">&times;</button>
            </div>
            <form onSubmit={handleDebug} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-400">Repo URL</label>
                  <input
                    type="text"
                    required
                    placeholder="https://github.com/user/repo"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={debugData.repo_url}
                    onChange={e => setDebugData({...debugData, repo_url: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-400">File Path</label>
                  <input
                    type="text"
                    required
                    placeholder="src/main.py"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={debugData.file_path}
                    onChange={e => setDebugData({...debugData, file_path: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                  <Terminal size={14} /> Error Log
                </label>
                <textarea
                  required
                  rows="4"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={debugData.log}
                  onChange={e => setDebugData({...debugData, log: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                  <Code size={14} /> Source Code
                </label>
                <textarea
                  required
                  rows="6"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={debugData.code}
                  onChange={e => setDebugData({...debugData, code: e.target.value})}
                />
              </div>
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50"
                >
                  {loading ? 'Analyzing & Fixing...' : 'Generate Fix & PR'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
