'use client';

import { createContext, useEffect, useState } from 'react';
import type { AuthChangeEvent, Session, User as SupabaseUser } from '@supabase/supabase-js';
import { createSupabaseBrowserClient, isSupabaseConfigured } from '@/lib/supabase/browser';
import {
  clearDemoStorage,
  createAvatarUrl,
  getDemoUser,
  loadDemoUser,
  persistDemoUser,
  removeDemoSessionCookie,
  seedDemoPosts,
  setDemoSessionCookie,
} from '@/lib/demo';
import { AuthMode, AuthSignUpResult, User } from '@/types';

interface SignUpInput {
  email: string;
  password: string;
  name: string;
  companyName?: string;
}

interface SignInInput {
  email: string;
  password: string;
}

interface ProfileRow {
  full_name: string | null;
  company_name: string | null;
  avatar_url: string | null;
}

function isMissingTableError(error: { code?: string; message?: string } | null, tableName: string) {
  return (
    error?.code === 'PGRST205' &&
    typeof error.message === 'string' &&
    error.message.includes(`'public.${tableName}'`)
  );
}

interface AuthContextValue {
  authMode: AuthMode;
  isDemo: boolean;
  user: User | null;
  loading: boolean;
  loginDemo: () => Promise<User>;
  signUp: (input: SignUpInput) => Promise<AuthSignUpResult>;
  signIn: (input: SignInInput) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function buildUserFromSupabase(authUser: SupabaseUser, profile?: ProfileRow | null): User {
  const metadata = authUser.user_metadata ?? {};
  const name =
    profile?.full_name ||
    metadata.full_name ||
    metadata.name ||
    authUser.email?.split('@')[0] ||
    'GrowthFlow Member';

  return {
    id: authUser.id,
    email: authUser.email ?? '',
    name,
    companyName: profile?.company_name || metadata.company_name || undefined,
    avatarUrl: profile?.avatar_url || createAvatarUrl(name),
  };
}

async function loadProfile(userId: string): Promise<ProfileRow | null> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('full_name, company_name, avatar_url')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    if (isMissingTableError(error, 'profiles')) {
      return null;
    }

    console.error('Failed to load profile', error);
    return null;
  }

  return data;
}

async function resolveAuthenticatedUser(authUser: SupabaseUser): Promise<User> {
  const profile = await loadProfile(authUser.id);
  return buildUserFromSupabase(authUser, profile);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode>('guest');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      const demoUser = loadDemoUser();
      setUser(demoUser);
      setAuthMode(demoUser ? 'demo' : 'guest');
      setLoading(false);
      return;
    }

    let cancelled = false;
    const supabase = createSupabaseBrowserClient();

    const syncSession = async (sessionFromEvent?: Session | null, event?: AuthChangeEvent) => {
      const sessionResult = sessionFromEvent
        ? { data: { session: sessionFromEvent }, error: null }
        : await supabase.auth.getSession();

      if (cancelled) {
        return;
      }

      if (sessionResult.error) {
        console.error('Failed to load auth session', sessionResult.error);
      }

      const authUser = sessionResult.data.session?.user ?? null;

      if (authUser) {
        const mappedUser = await resolveAuthenticatedUser(authUser);
        if (cancelled) {
          return;
        }

        clearDemoStorage();
        void removeDemoSessionCookie();
        setUser(mappedUser);
        setAuthMode('authenticated');
        setLoading(false);
        return;
      }

      if (event === 'SIGNED_OUT') {
        clearDemoStorage();
        void removeDemoSessionCookie();
      }

      const demoUser = loadDemoUser();
      if (demoUser) {
        setUser(demoUser);
        setAuthMode('demo');
      } else {
        setUser(null);
        setAuthMode('guest');
      }
      setLoading(false);
    };

    void syncSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      void syncSession(session, event);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const loginDemo = async () => {
    if (isSupabaseConfigured()) {
      const supabase = createSupabaseBrowserClient();
      await supabase.auth.signOut();
    }

    const demoUser = getDemoUser();
    persistDemoUser(demoUser);
    seedDemoPosts();
    await setDemoSessionCookie();

    setUser(demoUser);
    setAuthMode('demo');
    setLoading(false);

    return demoUser;
  };

  const signUp = async ({ email, password, name, companyName }: SignUpInput) => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured. Add the required environment variables first.');
    }

    const supabase = createSupabaseBrowserClient();
    const redirectTo = `${window.location.origin}/auth/confirm?next=/dashboard`;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectTo,
        data: {
          full_name: name,
          company_name: companyName,
          avatar_url: createAvatarUrl(name),
        },
      },
    });

    if (error) {
      throw error;
    }

    clearDemoStorage();
    await removeDemoSessionCookie();

    if (data.session && data.user) {
      setUser(await resolveAuthenticatedUser(data.user));
      setAuthMode('authenticated');
    }

    return { needsEmailVerification: !data.session };
  };

  const signIn = async ({ email, password }: SignInInput) => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured. Add the required environment variables first.');
    }

    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    clearDemoStorage();
    await removeDemoSessionCookie();

    if (data.user) {
      setUser(await resolveAuthenticatedUser(data.user));
      setAuthMode('authenticated');
    }
  };

  const logout = async () => {
    if (authMode === 'demo') {
      clearDemoStorage();
      await removeDemoSessionCookie();
      setUser(null);
      setAuthMode('guest');
      return;
    }

    if (!isSupabaseConfigured()) {
      setUser(null);
      setAuthMode('guest');
      return;
    }

    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }

    setUser(null);
    setAuthMode('guest');
  };

  return (
    <AuthContext.Provider
      value={{
        authMode,
        isDemo: authMode === 'demo',
        user,
        loading,
        loginDemo,
        signUp,
        signIn,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
