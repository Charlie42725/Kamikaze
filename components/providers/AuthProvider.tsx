'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useSupabase } from './SupabaseProvider';
import type { User } from '@supabase/supabase-js';
import type { Profile } from '@/lib/types/database';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = useSupabase();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        const currentUser = session?.user ?? null;
        if (!mounted) return;
        setUser(currentUser);

        if (currentUser) {
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentUser.id)
            .single();
          if (!mounted) return;
          if (data) setProfile(data as unknown as Profile);
        }
      } catch (e) {
        console.error('Auth init error:', e);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        try {
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentUser.id)
            .single();
          if (mounted && data) setProfile(data as unknown as Profile);
        } catch (e) {
          console.error('Profile fetch error:', e);
        }
      } else {
        setProfile(null);
      }

      if (mounted) setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
