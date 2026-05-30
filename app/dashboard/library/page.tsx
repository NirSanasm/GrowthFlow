'use client';

import { useState } from 'react';
import { useScheduler } from '@/hooks/useScheduler';
import { RefreshCw, Search, Calendar, Check, Trash2, SlidersHorizontal, AlertCircle, FileText, Send, HelpCircle } from 'lucide-react';
import { Post, PostStatus } from '@/types';
import { formatDate } from '@/lib/utils';

export default function ContentLibrary() {
  const { posts, loading, updatePost, deletePost } = useScheduler();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | PostStatus>('all');

  // Quick Action Toggles
  const handleToggleStatus = async (id: string, currentStatus: PostStatus) => {
    const nextStatusMap: Record<PostStatus, PostStatus> = {
      draft: 'scheduled',
      scheduled: 'published',
      published: 'draft',
    };
    await updatePost(id, { status: nextStatusMap[currentStatus] });
  };

  // Filter posts based on searches & tab filters
  const filteredPosts = posts
    .filter((post) => {
      const matchesSearch =
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.industry.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesTab = activeTab === 'all' || post.status === activeTab;

      return matchesSearch && matchesTab;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const TabBadgeCount = ({ status }: { status: 'all' | PostStatus }) => {
    const count = status === 'all'
      ? posts.length
      : posts.filter(p => p.status === status).length;

    return (
      <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-slate-950/60 border border-slate-900 text-[8.5px] font-mono text-slate-400">
        {count}
      </span>
    );
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <RefreshCw className="h-6 w-6 text-indigo-400 animate-spin" style={{ animationDuration: '8s' }} /> Content Library
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Search, filter, delete, and quick-toggle publication states inside your active index database.
          </p>
        </div>
      </div>

      {/* FILTER CONTROLS (Search Bar & Tabs) */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Tab Filters */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/20 border border-white/5 w-full md:w-auto overflow-x-auto select-none">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition flex items-center whitespace-nowrap ${
              activeTab === 'all'
                ? 'bg-slate-900 text-white shadow-sm border border-slate-800'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            All Archive <TabBadgeCount status="all" />
          </button>
          <button
            onClick={() => setActiveTab('scheduled')}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition flex items-center whitespace-nowrap ${
              activeTab === 'scheduled'
                ? 'bg-slate-900 text-white shadow-sm border border-slate-800'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Scheduled <TabBadgeCount status="scheduled" />
          </button>
          <button
            onClick={() => setActiveTab('published')}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition flex items-center whitespace-nowrap ${
              activeTab === 'published'
                ? 'bg-slate-900 text-white shadow-sm border border-slate-800'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Published <TabBadgeCount status="published" />
          </button>
          <button
            onClick={() => setActiveTab('draft')}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition flex items-center whitespace-nowrap ${
              activeTab === 'draft'
                ? 'bg-slate-900 text-white shadow-sm border border-slate-800'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Drafts <TabBadgeCount status="draft" />
          </button>
        </div>

        {/* Search Input Box */}
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search topic or captions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/30 backdrop-blur-md border border-slate-900/80 rounded-xl py-2 pl-10 pr-4 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/30 transition"
          />
        </div>
      </div>

      {/* ARCHIVE LISTINGS */}
      <div className="flex flex-col gap-4">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="h-6 w-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center p-12 border border-dashed border-slate-900 rounded-2xl bg-slate-900/10">
            <FileText className="h-9 w-9 text-slate-600 mb-2" />
            <h4 className="text-xs font-bold text-slate-400">No Posts Located</h4>
            <p className="text-[10px] text-slate-500 mt-1 max-w-[220px]">
              Try adjusting your tab search terms, or trigger a custom post creation.
            </p>
          </div>
        ) : (
          filteredPosts.map((post) => {
            return (
              <div
                key={post.id}
                className="p-5 rounded-2xl border border-white/5 bg-slate-900/10 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-5 transition hover:border-slate-800"
              >
                {/* Lefthand post details */}
                <div className="flex-1 flex flex-col gap-3 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Platform labels */}
                    {post.platforms.map((p) => (
                      <span
                        key={p}
                        className={`text-[8px] font-bold px-2 py-0.5 rounded border capitalize ${
                          p === 'linkedin'
                            ? 'bg-blue-600/10 text-blue-400 border-blue-500/20'
                            : p === 'twitter'
                            ? 'bg-white/5 text-white border-white/10'
                            : 'bg-purple-600/10 text-purple-400 border-purple-500/20'
                        }`}
                      >
                        {p}
                      </span>
                    ))}

                    <span className="text-[10px] font-bold text-slate-200 capitalize truncate max-w-[140px]">
                      {post.topic}
                    </span>

                    <span className="text-[8px] font-mono text-slate-500">
                      • Updated {new Date(post.updatedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 font-light leading-relaxed whitespace-pre-wrap select-all">
                    {post.content}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-[9px] text-slate-500 border-t border-slate-900/60 pt-3">
                    <span className="flex items-center gap-1 font-semibold">
                      <SlidersHorizontal className="h-3.5 w-3.5 text-indigo-400" /> Tone: {post.tone}
                    </span>
                    <span className="flex items-center gap-1 font-semibold">
                      <Calendar className="h-3.5 w-3.5 text-indigo-400" /> Scheduled: {formatDate(post.scheduledDate)}
                    </span>
                  </div>
                </div>

                {/* Righthand actions block */}
                <div className="flex md:flex-col items-center justify-end gap-2 shrink-0 border-t md:border-t-0 border-slate-900/60 pt-3 md:pt-0">
                  {/* Status Toggle control button */}
                  <button
                    onClick={() => {
                      void handleToggleStatus(post.id, post.status);
                    }}
                    className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold transition flex items-center gap-1.5 ${
                      post.status === 'published'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                        : post.status === 'scheduled'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20'
                        : 'bg-slate-900/50 text-slate-400 border-slate-800 hover:bg-slate-850'
                    }`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
                    <span>State: {post.status}</span>
                  </button>

                  {/* Trash button */}
                  <button
                    onClick={() => {
                      void deletePost(post.id);
                    }}
                    className="p-2 rounded-lg border border-red-500/10 hover:border-red-500/20 bg-slate-950 hover:bg-red-500/5 text-red-400 hover:text-red-300 transition"
                    title="Delete Permanently"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
