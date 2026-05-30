import Link from 'next/link';
import { Sparkles, Calendar, BarChart3, ShieldCheck, ArrowRight, Zap, RefreshCw, Send, Check } from 'lucide-react';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-slate-950 overflow-hidden">
      {/* Decorative Radial Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            GrowthFlow<span className="text-indigo-400">.ai</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login" className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition">
            Sign In
          </Link>
          <Link href="/login" className="glow-btn px-4 py-2 rounded-xl text-sm font-semibold text-white flex items-center gap-1.5">
            Launch Demo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-24 text-center">
        {/* Banner Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-6 animate-pulse-glow">
          <Zap className="h-3 w-3" /> Next-Gen AI Social Orchestration
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400 max-w-4xl mx-auto leading-tight md:leading-[1.1] mb-6">
          Automate Your Organic Growth with Elite AI
        </h1>

        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed mb-10">
          Generate structured post frameworks and Twitter threads in seconds. Plan, edit, and orchestrate visual content streams with zero friction.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <Link href="/login" className="glow-btn px-8 py-4 rounded-xl text-base font-semibold text-white flex items-center gap-2 w-full sm:w-auto justify-center">
            Get Started For Free <ArrowRight className="h-5 w-5" />
          </Link>
          <a href="#features" className="px-8 py-4 rounded-xl text-base font-semibold border border-slate-800 bg-slate-900/50 hover:bg-slate-900 text-slate-300 hover:text-white transition w-full sm:w-auto justify-center flex items-center">
            Explore Features
          </a>
        </div>

        {/* Interactive App Mockup Preview */}
        <div className="relative max-w-5xl mx-auto rounded-2xl border border-white/10 bg-slate-900/30 backdrop-blur-md p-3 shadow-2xl shadow-indigo-500/5 group">
          <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 opacity-20 blur-lg group-hover:opacity-30 transition-opacity pointer-events-none" />

          <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 p-4 md:p-6 flex flex-col gap-6 text-left">
            {/* Mock Dashboard Window Header */}
            <div className="flex items-center justify-between border-b border-slate-900 pb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <div className="px-4 py-1 rounded-lg bg-slate-900 text-xs font-mono text-slate-500 border border-slate-850">
                dashboard.growthflow.ai/planner
              </div>
              <div className="w-12" />
            </div>

            {/* Mock Layout Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Sidebar Mock */}
              <div className="hidden md:flex flex-col gap-4 border-r border-slate-900 pr-6">
                <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-900/50 border border-slate-800/50">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-xs">GF</div>
                  <div>
                    <h4 className="text-xs font-bold text-white">GrowthFlow Inc.</h4>
                    <p className="text-[10px] text-slate-500">Workspace Standard</p>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 mt-2">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-500/10 text-indigo-400 text-xs font-semibold border border-indigo-500/20">
                    <BarChart3 className="h-4 w-4" /> Overview Dashboard
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-slate-200 text-xs font-medium transition">
                    <Sparkles className="h-4 w-4" /> AI Content Generator
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-slate-200 text-xs font-medium transition">
                    <Calendar className="h-4 w-4" /> Editorial Calendar
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-slate-200 text-xs font-medium transition">
                    <RefreshCw className="h-4 w-4" /> Library Archive
                  </div>
                </div>
              </div>

              {/* Main Canvas Mock */}
              <div className="md:col-span-2 flex flex-col gap-6">
                {/* Stats row */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-900 flex flex-col gap-1">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Total Impressions</span>
                    <span className="text-xl font-bold text-white">48,205</span>
                    <span className="text-[9px] font-semibold text-emerald-400 flex items-center gap-0.5 mt-1">
                      +14.8% <span className="text-[8px] text-slate-500">this week</span>
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-900 flex flex-col gap-1">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Avg. Engagement</span>
                    <span className="text-xl font-bold text-white">6.2%</span>
                    <span className="text-[9px] font-semibold text-indigo-400 flex items-center gap-0.5 mt-1">
                      +1.2% <span className="text-[8px] text-slate-500">vs industry</span>
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-900 flex flex-col gap-1 col-span-2 sm:col-span-1">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Scheduled Queue</span>
                    <span className="text-xl font-bold text-white">3 Posts</span>
                    <span className="text-[9px] font-semibold text-amber-400 flex items-center gap-0.5 mt-1 animate-pulse">
                      ● Active <span className="text-[8px] text-slate-500">sync</span>
                    </span>
                  </div>
                </div>

                {/* Simulated Generator output card */}
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col gap-3 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-indigo-500/5 blur-xl pointer-events-none" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-indigo-400 animate-spin" style={{ animationDuration: '6s' }} />
                      <span className="text-xs font-bold text-slate-200">AI LinkedIn Generator</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[9px] font-medium uppercase">LinkedIn Draft</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-900 font-mono text-[10px] text-slate-400 leading-relaxed">
                    🚀 **Scaling leverages asynchronous alignment**<br />
                    Many founders associate expansion with headcount. High headcount adds overhead. True leverage means refining core developer velocity. Build standard operating procedures first, then automate.
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                    <span>Topic: Operational Velocity</span>
                    <span className="flex items-center gap-1 text-slate-400 font-semibold cursor-pointer hover:text-white transition">
                      Schedule on Calendar <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Grid */}
      <section id="features" className="relative z-10 border-t border-slate-900 bg-slate-950/50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4">
              Everything you need to orchestrate organic growth
            </h2>
            <p className="text-slate-400 font-light leading-relaxed">
              Designed with full local storage syncing for instant testing. Structured cleanly so developers can add production databases in minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-900 flex flex-col gap-4 glass-panel-hover">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-inner">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Dynamic AI Writer</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Generate highly persuasive content calibrated for specific industries (Tech, Finance, Marketing, Productivity) and platform formats.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-900 flex flex-col gap-4 glass-panel-hover">
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 shadow-inner">
                <Calendar className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Visual Editorial Grid</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Organize monthly content calendars. View dates, status indicators, and Platform logos immediately inside a fully responsive grid.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-900 flex flex-col gap-4 glass-panel-hover">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-inner">
                <BarChart3 className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Real-Time Mock Analytics</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Simulate business conversions. Track total impressions, growth percentages, and platform performance over active scheduling loops.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing / Fiverr Portfolio Pitch */}
      <section className="relative z-10 py-20 border-t border-slate-900 bg-slate-950">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="p-8 md:p-12 rounded-3xl border border-white/5 bg-slate-900/20 backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 rounded-full bg-violet-500/5 blur-2xl pointer-events-none" />
            <h2 className="text-3xl font-bold text-white mb-4">Looking to build a custom AI App or SaaS?</h2>
            <p className="text-slate-400 font-light mb-8 max-w-xl mx-auto">
              This application showcases fully responsive premium Tailwind UI/UX engineering, complex client-side state engines, and multi-turn AI generators.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login" className="glow-btn px-6 py-3 rounded-xl text-sm font-bold text-white flex items-center gap-1.5 w-full sm:w-auto justify-center">
                Launch App Demo <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="https://github.com/NirSanasm/growth-flow" target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-xl text-sm font-semibold border border-slate-800 bg-slate-900/50 hover:bg-slate-900 text-slate-300 hover:text-white transition w-full sm:w-auto justify-center flex items-center">
                View Source Code
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-900/50 py-8 text-center text-xs text-slate-600">
        <p>© 2026 GrowthFlow AI. Built with ❤️ for marketers</p>
      </footer>
    </div>
  );
}
