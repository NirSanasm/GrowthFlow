'use client';

import { useState } from 'react';
import { useScheduler } from '@/hooks/useScheduler';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Sparkles, Clock, X, Check, Trash } from 'lucide-react';
import { Post, SocialPlatform, PostStatus } from '@/types';
import { formatDate } from '@/lib/utils';

export default function EditorialCalendar() {
  const { posts, loading, updatePost, deletePost } = useScheduler();

  // Calendar navigation state
  const [currentDate, setCurrentDate] = useState(new Date());

  // Slideout details drawer state
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [editStatus, setEditStatus] = useState<PostStatus>('scheduled');

  // Month navigation calculation
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Generate calendar days
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // First day of month
    const firstDay = new Date(year, month, 1);
    // Last day of month
    const lastDay = new Date(year, month + 1, 0);

    const days = [];

    // Prepend empty slots for padding
    const startPadding = firstDay.getDay(); // 0 is Sunday
    for (let i = startPadding - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({ date: prevDate, isCurrentMonth: false });
    }

    // Populate actual days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }

    return days;
  };

  const calendarDays = getDaysInMonth();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  // Filter posts belonging to a specific calendar day
  const getPostsForDay = (date: Date) => {
    return posts.filter((p) => {
      const pDate = new Date(p.scheduledDate);
      return (
        pDate.getFullYear() === date.getFullYear() &&
        pDate.getMonth() === date.getMonth() &&
        pDate.getDate() === date.getDate()
      );
    });
  };

  const handlePostClick = (post: Post, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedPost(post);
    setEditContent(post.content);
    setEditStatus(post.status);
    setIsEditing(false);
  };

  const handleSaveChanges = async () => {
    if (!selectedPost) return;
    await updatePost(selectedPost.id, {
      content: editContent,
      status: editStatus
    });
    setSelectedPost(null);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!selectedPost) return;
    await deletePost(selectedPost.id);
    setSelectedPost(null);
  };

  const PlatformBadge = ({ platform }: { platform: SocialPlatform }) => {
    switch (platform) {
      case 'linkedin':
        return <span className="text-[8px] bg-blue-500/10 text-blue-400 px-1 py-0.2 rounded border border-blue-500/20 leading-none">in</span>;
      case 'twitter':
        return <span className="text-[8px] bg-white/10 text-white px-1 py-0.2 rounded border border-white/15 leading-none">𝕏</span>;
      case 'instagram':
        return <span className="text-[8px] bg-purple-500/10 text-purple-400 px-1 py-0.2 rounded border border-purple-500/20 leading-none">📸</span>;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-12 relative">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <CalendarIcon className="h-6 w-6 text-indigo-400 animate-pulse" /> Editorial Calendar
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            View, reschedule, and manage scheduled drafts in a responsive monthly grid.
          </p>
        </div>

        {/* Month Selector Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto select-none">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-xl border border-slate-900 bg-slate-900/40 hover:bg-slate-900 text-slate-400 hover:text-white transition"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-xs font-bold text-white min-w-[120px] text-center uppercase tracking-wider">
            {monthName} {currentDate.getFullYear()}
          </span>
          <button
            onClick={handleNextMonth}
            className="p-2 rounded-xl border border-slate-900 bg-slate-900/40 hover:bg-slate-900 text-slate-400 hover:text-white transition"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* CALENDAR MONTH GRID */}
      <div className="rounded-2xl border border-white/5 bg-slate-900/10 backdrop-blur-md overflow-hidden shadow-2xl">
        {/* Days of Week Header */}
        <div className="grid grid-cols-7 border-b border-slate-900/80 bg-slate-950/40 py-3 text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 grid-rows-5 gap-px bg-slate-900/60 min-h-[500px]">
          {loading ? (
            <div className="col-span-7 row-span-5 flex items-center justify-center bg-slate-950/40">
              <div className="h-6 w-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            calendarDays.map(({ date, isCurrentMonth }, idx) => {
              const dayPosts = getPostsForDay(date);
              const isToday = new Date().toDateString() === date.toDateString();

              return (
                <div
                  key={idx}
                  className={`bg-[#060b13] p-2 flex flex-col gap-1.5 transition select-none relative min-h-[90px] ${
                    isCurrentMonth ? 'text-slate-200' : 'text-slate-600 opacity-20'
                  }`}
                >
                  {/* Day Number Label */}
                  <div className="flex justify-between items-center">
                    <span
                      className={`text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-md font-mono ${
                        isToday
                          ? 'bg-gradient-to-tr from-indigo-500 to-violet-600 text-white font-extrabold shadow-sm'
                          : ''
                      }`}
                    >
                      {date.getDate()}
                    </span>
                  </div>

                  {/* Day content list of scheduled post indicators */}
                  <div className="flex-1 flex flex-col gap-1 overflow-y-auto">
                    {dayPosts.map((post) => (
                      <div
                        key={post.id}
                        onClick={(e) => handlePostClick(post, e)}
                        className={`p-1.5 rounded-lg border text-left cursor-pointer flex flex-col gap-1 transition-all hover:scale-[0.98] ${
                          post.status === 'published'
                            ? 'bg-emerald-500/5 border-emerald-500/10 hover:border-emerald-500/20'
                            : 'bg-indigo-500/5 border-indigo-500/10 hover:border-indigo-500/20'
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          {post.platforms.map((plat) => (
                            <PlatformBadge key={plat} platform={plat} />
                          ))}
                          <span className="text-[7.5px] font-bold text-slate-400 capitalize truncate max-w-[45px]">
                            {post.topic}
                          </span>
                        </div>
                        <p className="text-[8px] text-slate-500 line-clamp-2 leading-normal">
                          {post.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* DRAWER POPUP FOR VIEWING/EDITING DETAILS */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-end p-4 sm:p-6">
          {/* Backdrop blur */}
          <div
            onClick={() => setSelectedPost(null)}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
          />

          {/* Slideout Container */}
          <div className="relative w-full max-w-md h-full max-h-[600px] sm:max-h-none rounded-2xl sm:rounded-none sm:h-screen sm:fixed sm:top-0 sm:right-0 bg-slate-950 border border-white/5 sm:border-l sm:border-t-0 p-6 flex flex-col gap-6 shadow-2xl overflow-y-auto animate-slide-up">
            <div className="flex items-center justify-between border-b border-slate-900 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-indigo-400" /> Post Inspector
              </h3>
              <button
                onClick={() => setSelectedPost(null)}
                className="p-1 rounded-lg hover:bg-slate-900 text-slate-400 hover:text-white transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Post Metadata Card */}
            <div className="p-4 rounded-xl border border-white/5 bg-slate-900/40 flex flex-col gap-2">
              <div className="flex items-center justify-between text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                <span>Created On</span>
                <span>{new Date(selectedPost.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between text-[9px] font-bold text-slate-500 uppercase tracking-widest border-t border-slate-900/50 pt-2">
                <span>Platforms</span>
                <div className="flex gap-1">
                  {selectedPost.platforms.map((p) => (
                    <span key={p} className="text-[8px] bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 capitalize text-slate-300">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between text-[9px] font-bold text-slate-500 uppercase tracking-widest border-t border-slate-900/50 pt-2">
                <span>Scheduled Time</span>
                <span className="text-slate-300 font-mono">{formatDate(selectedPost.scheduledDate)}</span>
              </div>
            </div>

            {/* Editing Box */}
            <div className="flex-1 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Content Caption</label>
                {isEditing ? (
                  <textarea
                    rows={8}
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full bg-slate-900/60 border border-slate-800 focus:border-indigo-500/50 rounded-xl p-3 text-xs text-slate-200 focus:outline-none transition leading-relaxed resize-none font-light"
                  />
                ) : (
                  <div className="p-3.5 rounded-xl border border-slate-900 bg-slate-950 font-mono text-[10.5px] text-slate-400 leading-relaxed max-h-[220px] overflow-y-auto whitespace-pre-wrap select-all">
                    {selectedPost.content}
                  </div>
                )}
              </div>

              {/* Status Override */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Publication Status</label>
                {isEditing ? (
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as PostStatus)}
                    className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none cursor-pointer"
                  >
                    <option value="scheduled">Scheduled (In Queue)</option>
                    <option value="draft">Draft (Suspended)</option>
                    <option value="published">Published (Manual Force)</option>
                  </select>
                ) : (
                  <span className={`self-start text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                    selectedPost.status === 'published'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}>
                    {selectedPost.status}
                  </span>
                )}
              </div>
            </div>

            {/* Action Row */}
            <div className="flex gap-2 border-t border-slate-900 pt-4 mt-auto">
              <button
                onClick={() => {
                  void handleDelete();
                }}
                className="py-2.5 px-3.5 rounded-xl border border-red-500/10 hover:border-red-500/20 bg-slate-950 hover:bg-red-500/5 text-red-400 hover:text-red-300 transition flex items-center justify-center"
                title="Delete Post"
              >
                <Trash className="h-4 w-4" />
              </button>

              {isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-800 bg-slate-900/30 hover:bg-slate-900 text-xs font-semibold text-slate-400 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      void handleSaveChanges();
                    }}
                    className="flex-2 glow-btn px-6 py-2.5 rounded-xl text-xs font-bold text-white transition flex items-center justify-center gap-1.5 shadow-md shadow-indigo-500/20"
                  >
                    <Check className="h-4 w-4" /> Save Updates
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 glow-btn py-2.5 rounded-xl text-xs font-bold text-white transition flex items-center justify-center gap-1.5 shadow-md shadow-indigo-500/20"
                >
                  Modify Post Content
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
