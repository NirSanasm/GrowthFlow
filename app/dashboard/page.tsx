'use client';

import { useScheduler } from '@/hooks/useScheduler';
import { useAuth } from '@/hooks/useAuth';
import { BarChart3, Users, Zap, Clock, Calendar, Sparkles, RefreshCw, Plus, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatDate } from '@/lib/utils';

export default function DashboardOverview() {
  const router = useRouter();
  const { posts, loading, getAnalytics } = useScheduler();
  const { user } = useAuth();

  const stats = getAnalytics();

  // Find the next 3 scheduled posts
  const upcomingPosts = [...posts]
    .filter(p => p.status === 'scheduled')
    .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
    .slice(0, 3);

  // Platform icons mapper
  const PlatformIcon = ({ platform }: { platform: string }) => {
    switch (platform) {
      case 'linkedin':
        return (
          <span className="w-5 h-5 rounded-md bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-xs" title="LinkedIn">
            in
          </span>
        );
      case 'twitter':
        return (
          <span className="w-5 h-5 rounded-md bg-slate-900 border border-white/10 flex items-center justify-center text-white font-semibold text-[10px]" title="Twitter/X">
            𝕏
          </span>
        );
      case 'instagram':
        return (
          <span className="w-5 h-5 rounded-md bg-gradient-to-tr from-amber-500 via-red-500 to-purple-600 flex items-center justify-center text-white text-[9px] font-bold" title="Instagram">
            📸
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      {/* Header Overview Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Workspace Overview</h1>
          <p className="text-slate-400 text-xs mt-1">
            Welcome back, <span className="text-slate-200 font-semibold">{user?.name || 'Explorer'}</span>. Here is how your social pipeline is performing today.
          </p>
        </div>

        <button
          onClick={() => router.push('/dashboard/generator')}
          className="glow-btn px-4 py-2.5 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 self-start md:self-auto shadow-md"
        >
          <Plus className="h-4 w-4" /> Generate New Post
        </button>
      </div>

      {/* Grid Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Impressions */}
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-900 flex flex-col gap-3 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 rounded-full bg-indigo-500/5 blur-xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Impressions</span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <BarChart3 className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">{stats.totalImpressions.toLocaleString()}</span>
            <span className="text-[10px] font-bold text-emerald-400">+{stats.weeklyGrowth}%</span>
          </div>
          <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-900">
            <div className="bg-gradient-to-r from-indigo-500 to-violet-600 h-full rounded-full" style={{ width: `${stats.weeklyGrowth + 45}%` }} />
          </div>
          <p className="text-[9px] text-slate-500">Compounding growth metric mapped dynamically</p>
        </div>

        {/* Engagement */}
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-900 flex flex-col gap-3 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 rounded-full bg-violet-500/5 blur-xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Engagement Rate</span>
            <div className="p-2 rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/20">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">{stats.engagementRate}%</span>
            <span className="text-[10px] font-bold text-indigo-400">Peak Reach</span>
          </div>
          <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-900">
            <div className="bg-gradient-to-r from-violet-500 to-fuchsia-500 h-full rounded-full" style={{ width: `${stats.engagementRate * 10}%` }} />
          </div>
          <p className="text-[9px] text-slate-500">Average engagement across active posts</p>
        </div>

        {/* Scheduled Count */}
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-900 flex flex-col gap-3 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 rounded-full bg-amber-500/5 blur-xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Queue</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">{stats.scheduledCount} Posts</span>
            <span className="text-[9px] text-amber-500 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 animate-pulse">Syncing</span>
          </div>
          <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-900">
            <div className="bg-gradient-to-r from-amber-400 to-amber-600 h-full rounded-full" style={{ width: `${Math.min(100, stats.scheduledCount * 20)}%` }} />
          </div>
          <p className="text-[9px] text-slate-500">Posts lined up for automated delivery</p>
        </div>

        {/* Published count */}
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-900 flex flex-col gap-3 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 rounded-full bg-emerald-500/5 blur-xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Published</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Zap className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">{stats.publishedCount} Posts</span>
            <span className="text-[10px] font-bold text-emerald-400">100% Success</span>
          </div>
          <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-900">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full" style={{ width: `${Math.min(100, stats.publishedCount * 15)}%` }} />
          </div>
          <p className="text-[9px] text-slate-500">Successful pushes since initialization</p>
        </div>
      </div>

      {/* Analytics Graph & Scheduler List Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* GRAPH PANEL (Left 2/3) */}
        <div className="lg:col-span-2 rounded-2xl border border-white/5 bg-slate-900/20 backdrop-blur-md p-6 flex flex-col gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Pipeline Engagement Trends</h3>
              <p className="text-[10px] text-slate-500">Comparative representation over current workspace cycles</p>
            </div>
            <div className="flex items-center gap-4 text-[10px] text-slate-400 font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Impressions
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-violet-500" /> Engagement Ratio
              </div>
            </div>
          </div>

          {/* Core Graphic Mock representing data flows */}
          <div className="flex-1 h-60 w-full relative mt-4 flex items-end">
            <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="glow-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="glow-grad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line x1="0" y1="50" x2="500" y2="50" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="5,5" />
              <line x1="0" y1="100" x2="500" y2="100" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="5,5" />
              <line x1="0" y1="150" x2="500" y2="150" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="5,5" />

              {/* Area Under Curves */}
              <path d="M 0 160 Q 80 80, 160 110 T 320 60 T 480 40 L 500 40 L 500 200 L 0 200 Z" fill="url(#glow-grad)" />
              <path d="M 0 180 Q 80 140, 160 150 T 320 120 T 480 80 L 500 80 L 500 200 L 0 200 Z" fill="url(#glow-grad2)" />

              {/* Trend lines */}
              <path d="M 0 160 Q 80 80, 160 110 T 320 60 T 480 40 L 500 40" fill="none" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" />
              <path d="M 0 180 Q 80 140, 160 150 T 320 120 T 480 80 L 500 80" fill="none" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" />

              {/* Glowing Nodes */}
              <circle cx="160" cy="110" r="4.5" fill="#6366f1" stroke="#020617" strokeWidth="1.5" className="animate-pulse" />
              <circle cx="320" cy="60" r="4.5" fill="#6366f1" stroke="#020617" strokeWidth="1.5" />
              <circle cx="480" cy="40" r="4.5" fill="#8b5cf6" stroke="#020617" strokeWidth="1.5" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 backdrop-blur-[2px] transition duration-300 pointer-events-none">
              <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-indigo-500/30 text-indigo-400 text-xs font-bold font-mono">Hover node to inspect metrics</span>
            </div>
          </div>
          <div className="flex justify-between text-[8px] font-mono text-slate-600 uppercase tracking-widest pt-2 border-t border-slate-900">
            <span>May 20</span>
            <span>May 21</span>
            <span>May 22</span>
            <span>May 23</span>
            <span>May 24</span>
            <span>Today</span>
          </div>
        </div>

        {/* UPCOMING QUEUE PANEL (Right 1/3) */}
        <div className="rounded-2xl border border-white/5 bg-slate-900/20 backdrop-blur-md p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-900 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white">Upcoming Queue</h3>
              <p className="text-[10px] text-slate-500">Next scheduled post deliveries</p>
            </div>
            <button
              onClick={() => router.push('/dashboard/calendar')}
              className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold transition flex items-center gap-1"
            >
              See All <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="flex-1 flex flex-col gap-3">
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <div className="h-5 w-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : upcomingPosts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 border border-dashed border-slate-900 rounded-xl p-4 text-center">
                <Sparkles className="h-7 w-7 text-slate-600 mb-2" />
                <h4 className="text-xs font-bold text-slate-400">Queue is Empty</h4>
                <p className="text-[10px] text-slate-500 mt-1 max-w-[180px]">Generate high-value AI posts to populate your editorial timeline.</p>
                <button
                  onClick={() => router.push('/dashboard/generator')}
                  className="mt-4 py-1.5 px-3 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-850 text-[10px] font-bold text-slate-300 transition"
                >
                  Create Post
                </button>
              </div>
            ) : (
              upcomingPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => router.push('/dashboard/library')}
                  className="p-3.5 rounded-xl bg-slate-900/40 hover:bg-slate-900/70 border border-slate-900/60 hover:border-slate-800 cursor-pointer flex flex-col gap-2.5 transition group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {post.platforms.map((p) => (
                        <PlatformIcon key={p} platform={p} />
                      ))}
                      <span className="text-[9px] font-semibold text-slate-400 capitalize truncate max-w-[90px]">{post.topic}</span>
                    </div>

                    <span className="text-[8px] font-mono font-semibold text-amber-400 px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 flex items-center gap-1 group-hover:scale-95 transition">
                      <Clock className="h-2.5 w-2.5" /> {new Date(post.scheduledDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>

                  <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed font-light">
                    {post.content}
                  </p>

                  <div className="flex items-center justify-between text-[8px] text-slate-500 border-t border-slate-900/50 pt-2 font-semibold">
                    <span>Tone: {post.tone}</span>
                    <span className="text-slate-400 group-hover:text-indigo-400 transition flex items-center gap-0.5">
                      Configure <ArrowRight className="h-2 w-2" />
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
