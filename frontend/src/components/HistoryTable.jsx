import React from 'react';
import { CheckCircle2, AlertCircle, Zap, ArrowRight, Github, Activity } from 'lucide-react';

export default function HistoryTable({ history, loading }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-500 text-[10px] uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">
              <th className="px-6 py-4 font-bold">Timestamp</th>
              <th className="px-6 py-4 font-bold">Error Signature</th>
              <th className="px-6 py-4 font-bold text-center">Efficiency</th>
              <th className="px-6 py-4 font-bold">Resolution</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {history.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <p className="text-xs font-semibold text-black">
                    {new Date(item.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {new Date(item.created_at).toLocaleTimeString()}
                  </p>
                </td>
                <td className="px-6 py-4 max-w-xs md:max-w-md">
                   <div className="flex items-start gap-2">
                      <div className="mt-1 flex-shrink-0">
                         {item.status === 'success' ? (
                            <CheckCircle2 size={14} className="text-blue-600" />
                         ) : (
                            <AlertCircle size={14} className="text-red-500" />
                         )}
                      </div>
                      <p className="text-xs font-mono text-gray-600 truncate">
                        {item.log_snippet}
                      </p>
                   </div>
                </td>
                <td className="px-6 py-4 text-center">
                  {item.cached ? (
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100 text-[9px] font-bold uppercase">
                      <Zap size={10} className="fill-blue-600" /> Cached
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-100 text-gray-500 text-[9px] font-bold uppercase">
                      AI Live
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  {item.pr_url ? (
                    <a
                      href={item.pr_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors text-xs font-semibold"
                    >
                      <Github size={14} />
                      PR
                      <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                    </a>
                  ) : (
                    <span className="text-[10px] text-gray-400 font-medium uppercase">Pending</span>
                  )}
                </td>
              </tr>
            ))}
            {history.length === 0 && !loading && (
              <tr>
                <td colSpan="4" className="px-6 py-16 text-center">
                   <div className="flex flex-col items-center gap-3">
                      <Activity className="text-gray-200" size={32} />
                      <div>
                        <p className="text-gray-500 font-bold text-sm">No activity recorded</p>
                        <p className="text-xs text-gray-400">Run an AI debug session to get started.</p>
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
