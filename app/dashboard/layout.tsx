'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Sparkles, Calendar, BarChart3, RefreshCw, LogOut, ChevronRight, Menu, X, ArrowLeft } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !loading && !user) {
      router.push('/login');
    }
  }, [user, loading, mounted, router]);

  if (!mounted || loading || !user) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center animate-pulse">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <p className="text-slate-400 text-xs tracking-wider uppercase font-semibold animate-pulse">Synchronizing Workspace Session...</p>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const navItems = [
    {
      name: 'Overview Dashboard',
      href: '/dashboard',
      icon: BarChart3,
    },
    {
      name: 'AI Post Generator',
      href: '/dashboard/generator',
      icon: Sparkles,
    },
    {
      name: 'Scheduler Calendar',
      href: '/dashboard/calendar',
      icon: Calendar,
    },
    {
      name: 'Content Library',
      href: '/dashboard/library',
      icon: RefreshCw,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row relative">
      {/* Background Radial Glow */}
      <div className="absolute top-[5%] left-[5%] w-[400px] h-[400px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[5%] right-[5%] w-[400px] h-[400px] rounded-full bg-violet-600/5 blur-[120px] pointer-events-none" />

      {/* MOBILE HEADER */}
      <div className="md:hidden flex items-center justify-between px-6 py-4 border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-bold tracking-tight text-white">
            GrowthFlow<span className="text-indigo-400">.ai</span>
          </span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded-lg border border-slate-800 bg-slate-900/50 text-slate-300 hover:text-white"
        >
          {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {/* LEFT SIDEBAR (Desktop & Mobile drawer) */}
      <aside
        className={`fixed md:sticky top-0 z-30 h-full md:h-screen w-64 border-r border-slate-900/80 bg-slate-950/80 backdrop-blur-xl flex flex-col justify-between py-6 px-4 shrink-0 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } ${sidebarOpen ? 'left-0' : '-left-64 md:left-0'}`}
      >
        <div className="flex flex-col gap-8">
          {/* Logo & Close for Mobile */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-500/10">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold tracking-tight text-white text-base">
                GrowthFlow<span className="text-indigo-400">.ai</span>
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    setSidebarOpen(false);
                    router.push(item.href);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition group ${
                    isActive
                      ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-sm shadow-indigo-500/5'
                      : 'text-slate-400 hover:text-slate-200 border border-transparent hover:bg-slate-900/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`h-4.5 w-4.5 transition ${isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                    <span>{item.name}</span>
                  </div>
                  <ChevronRight className={`h-3.5 w-3.5 transition-transform ${isActive ? 'translate-x-0.5 text-indigo-400' : 'opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 text-slate-500'}`} />
                </button>
              );
            })}
          </nav>
        </div>

        {/* User profile & Logout */}
        <div className="flex flex-col gap-4 border-t border-slate-900 pt-6">
          {/* User profile details */}
          <div className="flex items-center gap-3 px-2">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-9 h-9 rounded-xl border border-white/5 object-cover"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-slate-200 truncate leading-tight">{user.name}</h4>
              <p className="text-[10px] text-slate-500 truncate mt-0.5">{user.companyName || 'Standard Member'}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => router.push('/')}
              className="flex-1 py-2 px-3 rounded-lg border border-slate-900/60 hover:border-slate-800 bg-slate-950 hover:bg-slate-900/40 text-[10px] font-semibold text-slate-400 hover:text-slate-200 flex items-center justify-center gap-1 transition"
            >
              <ArrowLeft className="h-3 w-3" /> Back to Landing
            </button>
            <button
              onClick={() => {
                void handleLogout();
              }}
              className="py-2 px-2.5 rounded-lg border border-red-500/10 hover:border-red-500/20 bg-slate-950 hover:bg-red-500/5 text-red-400 hover:text-red-300 flex items-center justify-center transition"
              title="Sign Out"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* OVERLAY FOR MOBILE SIDEBAR */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-20 bg-slate-950/60 backdrop-blur-sm md:hidden"
        />
      )}

      {/* MAIN MAIN CANVAS CONTAINER */}
      <main className="flex-1 min-w-0 overflow-y-auto px-6 py-8 md:px-10 md:py-10">
        {children}
      </main>
    </div>
  );
}
