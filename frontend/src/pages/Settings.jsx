import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import client from '../api/client';
import { Github, Save } from 'lucide-react';

export default function Settings() {
  const [githubToken, setGithubToken] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch current settings if any
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // In a real app, send this to the backend to encrypt and store
      alert("Settings saved! (Token storage implementation required on backend)");
    } catch (err) {
      alert("Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl">
        <h2 className="text-3xl font-bold mb-8">Settings</h2>

        <div className="space-y-6">
          <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Github className="text-slate-400" />
              <h3 className="text-xl font-semibold">GitHub Integration</h3>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-400">Personal Access Token</label>
                <input
                  type="password"
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={githubToken}
                  onChange={e => setGithubToken(e.target.value)}
                />
                <p className="text-xs text-slate-500 mt-2">
                  Needed for LogSnap to create PRs on your behalf. Required scopes: 'repo'.
                </p>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  <Save size={18} />
                  Save Settings
                </button>
              </div>
            </form>
          </div>

          <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Subscription Plan</h3>
            <div className="flex items-center justify-between p-4 bg-slate-900 rounded-xl border border-slate-700">
              <div>
                <p className="font-bold text-lg">Hobby Plan</p>
                <p className="text-slate-400 text-sm">10 runs per month • Community support</p>
              </div>
              <button className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                Upgrade to Pro
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
