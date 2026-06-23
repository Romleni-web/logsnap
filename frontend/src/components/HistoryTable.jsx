import React from 'react';
import { ExternalLink, CheckCircle2, AlertCircle, Zap, ArrowRight, Github, Activity } from 'lucide-react';

export default function HistoryTable({ history, loading }) {
  return (
    <div className="glass-card rounded-[2rem] overflow-hidden border-slate-800/50">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-slate-500 text-[10px] uppercase tracking-[0.2em] border-b border-slate-800/50 bg-slate-900/20">
              <th className="px-8 py-5 font-black">Timestamp</th>
              <th className="px-8 py-5 font-black">Error Signature</th>
              <th className="px-8 py-5 font-black text-center">Efficiency</th>
              <th className="px-8 py-5 font-black">Resolution</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {history.map((item) => (
              <tr key={item.id} className="hover:bg-slate-800/30 transition-all duration-200 group">
                <td className="px-8 py-6">
                  <p className="text-xs font-bold text-slate-300">
                    {new Date(item.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium mt-1">
                    {new Date(item.created_at).toLocaleTimeString()}
                  </p>
                </td>
                <td className="px-8 py-6 max-w-md">
                   <div className="flex items-start gap-3">
                      <div className="mt-1">
                         {item.status === 'success' ? (
                            <CheckCircle2 size={16} className="text-emerald-500" />
                         ) : (
                            <AlertCircle size={16} className="text-red-500" />
                         )}
                      </div>
                      <p className="text-xs font-mono text-slate-400 truncate group-hover:text-slate-200 transition-colors">
                        {item.log_snippet}
                      </p>
                   </div>
                </td>
                <td className="px-8 py-6 text-center">
                  {item.cached ? (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-black uppercase">
                      <Zap size={10} className="fill-blue-400" /> Cached
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-slate-500 text-[10px] font-black uppercase">
                      AI Live
                    </div>
                  )}
                </td>
                <td className="px-8 py-6">
                  {item.pr_url ? (
                    <a
                      href={item.pr_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all text-xs font-bold"
                    >
                      <Github size={14} />
                      View PR
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                  ) : (
                    <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">No PR Linked</span>
                  )}
                </td>
              </tr>
            ))}
            {history.length === 0 && !loading && (
              <tr>
                <td colSpan="4" className="px-8 py-20 text-center">
                   <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800">
                         <Activity className="text-slate-700" size={32} />
                      </div>
                      <div>
                        <p className="text-slate-400 font-bold">No debugging activity yet</p>
                        <p className="text-sm text-slate-600">Run your first AI debug session to see stats here.</p>
                      </div>
                   </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
