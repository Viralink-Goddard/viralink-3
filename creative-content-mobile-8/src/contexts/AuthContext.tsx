import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, UserProfile, isDemoMode } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
  demoLogin: () => void;
  resendVerificationEmail: () => Promise<void>;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for demo user in localStorage
    const demoUser = localStorage.getItem('demo_user');
    if (demoUser) {
      const parsedUser = JSON.parse(demoUser);
      setUser(parsedUser as any);
      setProfile(JSON.parse(localStorage.getItem('demo_profile') || '{}'));
      setLoading(false);
      return;
    }

    if (isDemoMode) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        setProfile({
          id: userId,
          email: user?.email || '',
          tier: 'free',
          created_at: new Date().toISOString(),
          entries_today: 0
        });
      } else {
        setProfile(data);
      }
    } catch (error) {
      setProfile({
        id: userId,
        email: user?.email || '',
        tier: 'free',
        created_at: new Date().toISOString(),
        entries_today: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = () => {
    const demoUser = {
      id: 'demo-user-123',
      email: 'demo@viralink.pro',
      created_at: new Date().toISOString()
    };
    const demoProfile: UserProfile = {
      id: 'demo-user-123',
      email: 'demo@viralink.pro',
      tier: 'pro',
      created_at: new Date().toISOString(),
      entries_today: 0
    };
    localStorage.setItem('demo_user', JSON.stringify(demoUser));
    localStorage.setItem('demo_profile', JSON.stringify(demoProfile));
    setUser(demoUser as any);
    setProfile(demoProfile);
  };

  const signUp = async (email: string, password: string) => {
    if (isDemoMode) {
      throw new Error('Demo mode: Please configure Supabase to use real authentication');
    }
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  };

  const signIn = async (email: string, password: string) => {
    if (isDemoMode) {
      throw new Error('Demo mode: Please configure Supabase or use "Try Demo" button');
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signOut = async () => {
    localStorage.removeItem('demo_user');
    localStorage.removeItem('demo_profile');
    if (!isDemoMode) {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    }
    setUser(null);
    setProfile(null);
  };

  const resetPassword = async (email: string) => {
    if (isDemoMode) {
      throw new Error('Demo mode: Please configure Supabase to use password reset');
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  };

  const refreshProfile = async () => {
    if (user) await fetchProfile(user.id);
  };

  const resendVerificationEmail = async () => {
    if (isDemoMode) {
      throw new Error('Demo mode: Email verification not available');
    }
    if (!user?.email) {
      throw new Error('No user email found');
    }
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: user.email,
    });
    if (error) throw error;
  };



  return (
    <AuthContext.Provider value={{ user, session, profile, loading, signUp, signIn, signOut, resetPassword, refreshProfile, demoLogin, resendVerificationEmail }}>
      {children}
    </AuthContext.Provider>
  );
}


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
