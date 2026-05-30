'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import {
  ArrowRight,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  User as UserIcon,
  Building2,
} from 'lucide-react';

type AuthView = 'signup' | 'signin';

export default function Login() {
  const router = useRouter();
  const { authMode, loading, loginDemo, signIn, signUp, user } = useAuth();
  const [authView, setAuthView] = useState<AuthView>('signup');
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    if (!loading && user && authMode !== 'guest') {
      router.replace('/dashboard');
    }
  }, [authMode, loading, router, user]);

  const handleDemoLogin = async () => {
    setIsDemoLoading(true);
    setErrorMessage('');
    setStatusMessage('');

    try {
      await loginDemo();
      router.push('/dashboard');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to start demo mode.');
    } finally {
      setIsDemoLoading(false);
    }
  };

  const handleAuthSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setStatusMessage('');

    try {
      if (authView === 'signup') {
        const result = await signUp({
          email,
          password,
          name,
          companyName,
        });

        if (result.needsEmailVerification) {
          setStatusMessage('Check your inbox to confirm your account, then sign in.');
          setAuthView('signin');
        } else {
          router.push('/dashboard');
        }
      } else {
        await signIn({
          email,
          password,
        });
        router.push('/dashboard');
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Authentication failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 overflow-hidden">
      <div className="absolute top-[20%] left-[20%] w-[350px] h-[350px] rounded-full bg-indigo-500/10 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[20%] w-[350px] h-[350px] rounded-full bg-violet-600/10 blur-[80px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b10_1px,transparent_1px),linear-gradient(to_bottom,#1e293b10_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            GrowthFlow<span className="text-indigo-400">.ai</span>
          </span>
        </div>

        <div className="rounded-2xl border border-white/5 bg-slate-900/40 backdrop-blur-md p-8 shadow-2xl">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-white tracking-tight">Access Your Workspace</h1>
            <p className="text-slate-400 text-xs mt-1">
              Real sign-up, secure sessions, and live Gemini generation for production accounts.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5 mb-6 text-left flex flex-col gap-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-12 h-12 rounded-full bg-indigo-500/10 blur-md pointer-events-none" />
            <div>
              <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-indigo-400" /> Instant Demo Mode
              </h4>
              <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">
                Explore the scheduler and analytics with seeded content. Demo mode keeps the mock generator so live LLM usage stays tied to real accounts.
              </p>
            </div>
            <button
              onClick={handleDemoLogin}
              disabled={isDemoLoading || isSubmitting}
              className="w-full py-2.5 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-xs font-bold text-white transition flex items-center justify-center gap-1.5 shadow-md shadow-indigo-500/20 disabled:opacity-60"
            >
              {isDemoLoading ? (
                <>
                  <div className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Starting Demo Workspace...
                </>
              ) : (
                <>
                  One-Click Demo Login <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </div>

          <div className="relative flex items-center justify-center my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <span className="relative z-10 px-3 bg-[#0a0f1d] text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
              Production Access
            </span>
          </div>

          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950/50 border border-slate-800 mb-5">
            <button
              onClick={() => setAuthView('signup')}
              className={`flex-1 rounded-lg py-2 text-[10px] font-bold transition ${
                authView === 'signup' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Create Account
            </button>
            <button
              onClick={() => setAuthView('signin')}
              className={`flex-1 rounded-lg py-2 text-[10px] font-bold transition ${
                authView === 'signin' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Sign In
            </button>
          </div>

          <form onSubmit={handleAuthSubmit} className="flex flex-col gap-4">
            {authView === 'signup' && (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Company</label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      value={companyName}
                      onChange={(event) => setCompanyName(event.target.value)}
                      placeholder="e.g. GrowthFlow AI"
                      className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Business Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="sarah@growthflow.io"
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition"
                />
              </div>
            </div>

            {errorMessage && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-2 text-[10px] text-red-300">
                {errorMessage}
              </div>
            )}

            {statusMessage && (
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-[10px] text-emerald-300">
                {statusMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isDemoLoading || isSubmitting}
              className="w-full py-2.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/50 hover:bg-slate-900 text-sm font-semibold text-slate-200 hover:text-white transition flex items-center justify-center gap-1.5 mt-2 disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                  Processing Account...
                </>
              ) : (
                <>
                  {authView === 'signup' ? 'Create Workspace' : 'Sign In'} <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-8 flex items-center justify-center gap-6 text-[10px] text-slate-500">
          <div className="flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-indigo-500" /> Supabase Auth
          </div>
          <div className="flex items-center gap-1">
            <Lock className="h-3.5 w-3.5 text-indigo-500" /> Server-side Gemini
          </div>
        </div>
      </div>
    </div>
  );
}
