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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-blue-600 font-bold text-[10px] tracking-wider uppercase mb-1">
            <Cpu size={12} />
            System Status: Operational
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-black">
            Operations Dashboard
          </h2>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <Plus size={18} />
          <span>Initialize Debug</span>
        </button>
      </div>

      <StatsCards stats={stats} />

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-gray-400 font-bold tracking-wider text-[10px] uppercase">
          <div className="w-4 h-[1px] bg-gray-300"></div>
          Mission Logs
        </div>
        <HistoryTable history={history} loading={loading} />
      </div>

      {/* Debug Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-3">
                <Sparkles className="text-blue-600" size={20} />
                <h3 className="text-lg font-bold text-black">AI Analytics Engine</h3>
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-black">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleDebug} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Repository URL</label>
                  <input
                    type="text"
                    required
                    placeholder="https://github.com/user/repo"
                    className="w-full input-field"
                    value={debugData.repo_url}
                    onChange={e => setDebugData({...debugData, repo_url: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">File Path</label>
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

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Error Data</label>
                <textarea
                  required
                  rows="3"
                  className="w-full input-field font-mono text-xs"
                  value={debugData.log}
                  onChange={e => setDebugData({...debugData, log: e.target.value})}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Context Code</label>
                <textarea
                  required
                  rows="4"
                  className="w-full input-field font-mono text-xs"
                  value={debugData.code}
                  onChange={e => setDebugData({...debugData, code: e.target.value})}
                />
              </div>

              <div className="pt-2 flex flex-col items-center gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary py-3 flex items-center justify-center gap-2 text-base"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} />
                      <span>Execute Auto-Fix</span>
                    </>
                  )}
                </button>
                <p className="text-[10px] text-gray-400 font-medium">
                  LogSnap AI // Debugging Interface v27.5
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
