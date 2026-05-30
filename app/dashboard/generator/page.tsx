'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAI } from '@/hooks/useAI';
import { useAuth } from '@/hooks/useAuth';
import { useScheduler } from '@/hooks/useScheduler';
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  Check,
  Eye,
  Info,
  LayoutGrid,
  PenTool,
  Sparkles,
} from 'lucide-react';
import { GeneratedContentResult, SocialPlatform } from '@/types';

export default function PostGenerator() {
  const router = useRouter();
  const { isDemo, user } = useAuth();
  const { addPost } = useScheduler();
  const { generating, streamedText, streamedTweets, generateContent } = useAI();

  const [topic, setTopic] = useState('');
  const [industry, setIndustry] = useState('tech');
  const [tone, setTone] = useState('Professional');
  const [platform, setPlatform] = useState<SocialPlatform>('linkedin');
  const [isThread, setIsThread] = useState(false);
  const [scheduledDaysAhead, setScheduledDaysAhead] = useState(2);
  const [scheduledHour, setScheduledHour] = useState(10);
  const [generatedResult, setGeneratedResult] = useState<GeneratedContentResult | null>(null);
  const [scheduledSuccessfully, setScheduledSuccessfully] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const previewText = streamedText || generatedResult?.content || '';
  const previewTweets = streamedTweets.length > 0 ? streamedTweets : generatedResult?.thread || [];

  const handleGenerate = async () => {
    if (!topic.trim()) {
      return;
    }

    setErrorMessage('');
    setScheduledSuccessfully(false);

    try {
      const result = await generateContent({
        topic,
        industry,
        tone,
        platform,
        isThread: platform === 'twitter' && isThread,
      });

      setGeneratedResult(result);
    } catch (error) {
      setGeneratedResult(null);
      setErrorMessage(error instanceof Error ? error.message : 'Unable to generate content.');
    }
  };

  const handleSchedulePost = async () => {
    if (!generatedResult) {
      return;
    }

    setErrorMessage('');

    try {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + Number(scheduledDaysAhead));
      targetDate.setHours(Number(scheduledHour), 0, 0, 0);

      await addPost({
        content: generatedResult.content,
        threadTweets: generatedResult.thread,
        platforms: [platform],
        status: 'scheduled',
        scheduledDate: targetDate.toISOString(),
        topic: topic || 'Custom Post',
        industry,
        tone,
      });

      setScheduledSuccessfully(true);
      setTimeout(() => {
        router.push('/dashboard/calendar');
      }, 900);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to schedule the generated post.');
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in pb-16">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">AI Content Generator</h1>
        <p className="text-slate-400 text-xs mt-1">
          Generate platform-native posts with live Gemini output for real accounts and keep the demo sandbox intact.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 flex flex-col gap-5">
          <div className="rounded-2xl border border-white/5 bg-slate-900/30 backdrop-blur-md p-6 flex flex-col gap-5">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5 border-b border-slate-900 pb-3">
              <PenTool className="h-4 w-4 text-indigo-400" /> Generator Configuration
            </h3>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Target Channel</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'linkedin', label: 'LinkedIn', icon: 'in' },
                  { value: 'twitter', label: 'Twitter / X', icon: '𝕏' },
                  { value: 'instagram', label: 'Instagram', icon: '📸' },
                ].map((item) => (
                  <button
                    key={item.value}
                    onClick={() => {
                      setPlatform(item.value as SocialPlatform);
                      setIsThread(item.value === 'twitter' ? isThread : false);
                      if (item.value !== 'twitter') {
                        setIsThread(false);
                      }
                      setGeneratedResult(null);
                    }}
                    className={`py-2 rounded-xl text-[10px] font-bold border transition flex flex-col items-center gap-1 ${
                      platform === item.value
                        ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300 shadow-sm'
                        : 'border-slate-900 bg-slate-950/40 text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <span className="text-sm">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">What should the post be about?</label>
              <textarea
                rows={4}
                required
                value={topic}
                onChange={(event) => setTopic(event.target.value)}
                placeholder="e.g. Why async operations beat adding headcount for early-stage SaaS teams."
                className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500/50 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none transition leading-relaxed resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Industry</label>
                <select
                  value={industry}
                  onChange={(event) => setIndustry(event.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500/50 cursor-pointer"
                >
                  <option value="tech">Software & Tech</option>
                  <option value="marketing">Brand & Marketing</option>
                  <option value="finance">Finance & Bootstrapping</option>
                  <option value="productivity">Operations & Focus</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tone</label>
                <select
                  value={tone}
                  onChange={(event) => setTone(event.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500/50 cursor-pointer"
                >
                  <option value="Professional">Professional & Data</option>
                  <option value="Authoritative">Authoritative</option>
                  <option value="Witty">Witty</option>
                  <option value="Inspiring">Inspiring</option>
                </select>
              </div>
            </div>

            {platform === 'twitter' && (
              <div className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-slate-950/40">
                <div>
                  <h5 className="text-xs font-bold text-slate-200">Create a Multi-Tweet Thread</h5>
                  <p className="text-[9px] text-slate-500 mt-0.5">Generate a connected 5-part X thread.</p>
                </div>
                <button
                  onClick={() => {
                    setIsThread(!isThread);
                    setGeneratedResult(null);
                  }}
                  className={`w-9 h-5 rounded-full transition flex items-center p-0.5 ${
                    isThread ? 'bg-indigo-500 justify-end' : 'bg-slate-800 justify-start'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-white shadow-inner" />
                </button>
              </div>
            )}

            {errorMessage && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-[10px] text-red-300 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={generating || !topic.trim()}
              className="w-full glow-btn py-3 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:pointer-events-none"
            >
              {generating ? (
                <>
                  <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating Post...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" /> {isDemo ? 'Run Demo Generator' : 'Generate with Gemini'}
                </>
              )}
            </button>
          </div>

          <div className="rounded-2xl border border-white/5 bg-slate-900/30 backdrop-blur-md p-6 flex flex-col gap-3">
            <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Info className="h-3.5 w-3.5 text-indigo-400" />
              Generation Mode
            </h4>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              {isDemo
                ? 'Demo mode uses the preserved simulator so you can explore the UI without incurring live model usage.'
                : 'Authenticated accounts call Gemini server-side through a protected route. Your browser never sees the API key.'}
            </p>
          </div>
        </div>

        <div className="lg:col-span-7 flex flex-col gap-5">
          <div className="rounded-2xl border border-white/5 bg-slate-900/20 backdrop-blur-md p-6 flex flex-col gap-5 relative overflow-hidden min-h-[460px]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between border-b border-slate-900 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Eye className="h-4 w-4 text-indigo-400" /> Interactive Preview
              </h3>
              <span className="text-[9px] font-mono font-semibold text-slate-500 uppercase tracking-widest">
                {platform}
              </span>
            </div>

            <div className="flex-1 flex items-center justify-center p-2 sm:p-4 rounded-2xl bg-slate-950/40 border border-slate-900/60">
              {!generatedResult && !streamedText && streamedTweets.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-900 rounded-xl w-full max-w-sm h-64">
                  <LayoutGrid className="h-8 w-8 text-slate-600 mb-2 animate-pulse" />
                  <h4 className="text-xs font-bold text-slate-400">Preview Awaits Generation</h4>
                  <p className="text-[10px] text-slate-500 mt-1 max-w-[220px]">
                    Choose a platform, describe the topic, then generate to see a live preview.
                  </p>
                </div>
              ) : (
                <div className="w-full max-w-md animate-fade-in">
                  {platform === 'linkedin' && (
                    <div className="rounded-xl border border-slate-800 bg-[#0f172a] p-4 text-left shadow-2xl flex flex-col gap-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={user?.avatarUrl}
                          className="w-10 h-10 rounded-full object-cover border border-white/5"
                          alt={user?.name || 'User'}
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-extrabold text-slate-100">{user?.name || 'GrowthFlow User'}</h4>
                          <p className="text-[9px] text-slate-500 truncate">
                            Founder @ {user?.companyName || 'GrowthFlow AI'}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap select-all">{previewText}</p>
                    </div>
                  )}

                  {platform === 'twitter' && (
                    <div className="rounded-xl border border-slate-800 bg-[#0b1017] p-4 text-left shadow-2xl flex flex-col gap-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={user?.avatarUrl}
                          className="w-9 h-9 rounded-full object-cover border border-white/5"
                          alt={user?.name || 'User'}
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-slate-100">{user?.name || 'GrowthFlow User'}</h4>
                          <p className="text-[9px] text-slate-500">@growthflow_user</p>
                        </div>
                      </div>

                      {isThread ? (
                        <div className="flex flex-col gap-3">
                          {previewTweets.map((tweet, index) => (
                            <div key={index} className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
                              <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap select-all">
                                {tweet}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap select-all">{previewText}</p>
                      )}
                    </div>
                  )}

                  {platform === 'instagram' && (
                    <div className="rounded-xl border border-slate-800 bg-[#0b0c10] overflow-hidden text-left shadow-2xl flex flex-col w-full max-w-sm">
                      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-slate-900 bg-slate-950/20">
                        <img
                          src={user?.avatarUrl}
                          className="w-7 h-7 rounded-full object-cover border border-white/5"
                          alt={user?.name || 'User'}
                        />
                        <span className="text-[10px] font-bold text-slate-200">
                          {user?.companyName?.toLowerCase().replace(/\s+/g, '_') || 'growthflow_ai'}
                        </span>
                      </div>
                      <div className="aspect-square bg-slate-900 flex flex-col items-center justify-center p-6 border-b border-slate-900 text-center gap-2 select-none relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-600/5" />
                        <Sparkles className="h-7 w-7 text-indigo-400" />
                        <h4 className="text-xs font-bold text-slate-300">Creative Placeholder</h4>
                        <p className="text-[9px] text-slate-500 max-w-[180px]">Attach your image or asset in the production workflow.</p>
                      </div>
                      <div className="p-3.5">
                        <p className="text-[10px] text-slate-200 leading-relaxed whitespace-pre-wrap select-all">
                          <span className="font-bold text-slate-100 pr-1">growthflow_ai</span>
                          {previewText}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {generatedResult && !generating && (
              <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5 mt-auto flex flex-col gap-4 animate-slide-up">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">Ready to Schedule?</h4>
                    <p className="text-[9px] text-slate-400 mt-0.5">Choose a slot and send this post to your editorial calendar.</p>
                  </div>

                  <div className="flex items-center gap-2 select-none">
                    <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1.5">
                      <span className="text-[8px] font-bold text-slate-500 uppercase">Day</span>
                      <select
                        value={scheduledDaysAhead}
                        onChange={(event) => setScheduledDaysAhead(Number(event.target.value))}
                        className="bg-transparent text-[10px] font-semibold text-slate-300 focus:outline-none cursor-pointer"
                      >
                        <option value={1}>Tomorrow</option>
                        <option value={2}>In 2 days</option>
                        <option value={3}>In 3 days</option>
                        <option value={5}>In 5 days</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1.5">
                      <span className="text-[8px] font-bold text-slate-500 uppercase">Hour</span>
                      <select
                        value={scheduledHour}
                        onChange={(event) => setScheduledHour(Number(event.target.value))}
                        className="bg-transparent text-[10px] font-semibold text-slate-300 focus:outline-none cursor-pointer"
                      >
                        <option value={9}>09:00 AM</option>
                        <option value={10}>10:00 AM</option>
                        <option value={14}>02:00 PM</option>
                        <option value={16}>04:00 PM</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSchedulePost}
                  disabled={scheduledSuccessfully}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    scheduledSuccessfully ? 'bg-emerald-500 text-white' : 'glow-btn text-white'
                  }`}
                >
                  {scheduledSuccessfully ? (
                    <>
                      <Check className="h-4 w-4" /> Added to Editorial Calendar
                    </>
                  ) : (
                    <>
                      <Calendar className="h-4 w-4" /> Schedule This Post <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
