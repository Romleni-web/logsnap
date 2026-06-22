import React from 'react';
import { ExternalLink } from 'lucide-react';

export default function HistoryTable({ history, loading }) {
  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-700 bg-slate-800/50">
        <h3 className="font-semibold">Recent Debug History</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-slate-400 text-sm border-b border-slate-700">
              <th className="px-6 py-4 font-medium">Time</th>
              <th className="px-6 py-4 font-medium">Log Snippet</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">PR Link</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {history.map((item) => (
              <tr key={item.id} className="hover:bg-slate-700/30 transition-colors">
                <td className="px-6 py-4 text-sm">
                  {new Date(item.created_at).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm font-mono text-slate-300">
                  {item.log_snippet.substring(0, 50)}...
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.status === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                  }`}>
                    {item.status}
                  </span>
                  {item.cached && (
                    <span className="ml-2 px-2 py-1 rounded-full text-xs bg-blue-500/10 text-blue-400 font-medium">
                      Cached
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm">
                  {item.pr_url ? (
                    <a
                      href={item.pr_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                    >
                      View PR <ExternalLink size={14} />
                    </a>
                  ) : '-'}
                </td>
              </tr>
            ))}
            {history.length === 0 && !loading && (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                  No history found. Start by debugging an error!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
