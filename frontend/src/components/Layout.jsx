import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LayoutDashboard, Settings, LogOut, Zap, ChevronRight, BarChart3, Menu, X } from 'lucide-react';
import { clsx } from 'clsx';

export default function Layout({ children }) {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  // Logic check: if VITE_ADMIN_EMAIL is not set, we use a fallback to ensure you can see it while debugging
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
  const isAdmin = user?.email && adminEmail && user.email.toLowerCase() === adminEmail.toLowerCase();

  const navItems = [
    { label: 'DASHBOARD', icon: LayoutDashboard, path: '/' },
    { label: 'SETTINGS', icon: Settings, path: '/settings' },
    ...(isAdmin ? [{ label: 'ADMIN', icon: BarChart3, path: '/admin' }] : []),
  ];

  const SidebarContent = () => (
    <>
      <div className="p-8 flex flex-col items-start">
        <Link to="/" className="flex items-center gap-2 mb-8 group" onClick={() => setIsMobileMenuOpen(false)}>
          <Zap className="text-blue-600 fill-blue-600" size={24} />
          <h1 className="text-xl font-bold tracking-tighter text-black">
            LOG<span className="text-blue-600">SNAP</span>
          </h1>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={clsx(
                "flex items-center justify-between px-4 py-3 rounded-md transition-all duration-200",
                isActive
                  ? "bg-blue-50 text-blue-600 font-semibold"
                  : "text-gray-600 hover:bg-gray-50 hover:text-black"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon size={18} />
                <span className="text-sm">{item.label}</span>
              </div>
              {isActive && <ChevronRight size={14} />}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-md bg-blue-600 flex items-center justify-center text-xs font-bold text-white">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">OPERATOR</p>
            <p className="text-xs font-medium text-black truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-2 w-full text-left rounded-md text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200 text-sm font-medium"
        >
          <LogOut size={16} />
          Log Out
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-white text-black w-full overflow-hidden font-sans relative">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-gray-200 flex-col z-20">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside className={clsx(
        "fixed inset-y-0 left-0 w-64 bg-white shadow-2xl z-40 lg:hidden transition-transform duration-300 flex flex-col",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <SidebarContent />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 z-10">
          <Link to="/" className="flex items-center gap-2">
            <Zap className="text-blue-600 fill-blue-600" size={20} />
            <span className="font-bold text-lg tracking-tighter">LOGSNAP</span>
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-gray-500 hover:text-black transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-auto relative bg-gray-50/50">
          <div className="max-w-6xl mx-auto p-6 md:p-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
