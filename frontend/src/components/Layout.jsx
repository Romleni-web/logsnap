import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LayoutDashboard, Settings, LogOut, Zap, ChevronRight, Activity } from 'lucide-react';
import { clsx } from 'clsx';

export default function Layout({ children }) {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const navItems = [
    { label: 'DASHBOARD', icon: LayoutDashboard, path: '/' },
    { label: 'SETTINGS', icon: Settings, path: '/settings' },
  ];

  return (
    <div className="flex h-screen bg-[#000] text-slate-100 w-full overflow-hidden font-sans selection:bg-blue-600 selection:text-white">
      {/* Sidebar - Matching efootball premium look */}
      <aside className="w-72 bg-[#0a0a0a] border-r border-white/5 flex flex-col z-20 shadow-[20px_0_40px_rgba(0,0,0,0.5)]">
        <div className="p-12 flex flex-col items-center">
          <div className="bg-blue-600 p-4 rounded-[1.5rem] shadow-[0_0_40px_rgba(59,130,246,0.3)] animate-glow mb-6 group cursor-pointer transition-transform hover:scale-110">
            <Zap className="text-white fill-white group-hover:animate-pulse" size={32} />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-display font-black tracking-tighter italic text-white leading-none">
              LOG<span className="text-blue-500">SNAP</span>
            </h1>
            <div className="h-1.5 w-16 bg-blue-600 mx-auto mt-3 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
          </div>
        </div>

        <nav className="flex-1 px-8 space-y-4 mt-6">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={clsx(
                  "flex items-center justify-between px-6 py-5 rounded-2xl transition-all duration-500 group relative overflow-hidden",
                  isActive
                    ? "bg-blue-600/10 text-white border-l-4 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.1)]"
                    : "text-slate-500 hover:text-white hover:bg-white/5"
                )}
              >
                <div className="flex items-center gap-5">
                  <item.icon size={22} className={clsx("transition-colors duration-300", isActive ? "text-blue-500" : "group-hover:text-blue-400")} />
                  <span className="font-display font-black text-xs tracking-[0.2em]">{item.label}</span>
                </div>
                {isActive && <ChevronRight size={18} className="text-blue-500 animate-in slide-in-from-left-2" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-10">
          <div className="bg-white/5 border border-white/5 rounded-3xl p-6 mb-8 backdrop-blur-md">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-lg font-black italic shadow-lg shadow-blue-500/20 text-white">
                  {user?.email?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black text-blue-500 tracking-[0.3em] uppercase mb-1">OPERATOR</p>
                  <p className="text-xs font-bold text-white truncate opacity-90">{user?.email}</p>
                </div>
             </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-4 px-6 py-4 w-full text-left rounded-2xl text-slate-500 hover:text-red-500 hover:bg-red-500/10 transition-all duration-300 font-display font-black text-[10px] tracking-[0.3em]"
          >
            <LogOut size={20} />
            LOG OUT TERMINAL
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative bg-[#000]">
        {/* Background Patterns - UEFA Stadium Glow style */}
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-blue-600/5 blur-[180px] rounded-full pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-[800px] h-[800px] bg-blue-900/5 blur-[150px] rounded-full pointer-events-none"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.05] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto p-16 relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}
