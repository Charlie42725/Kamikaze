'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
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

const AUTH_TIMEOUT = 5000; // 5 seconds max for auth init

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = useSupabase();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const profileFetchedRef = useRef<string | null>(null);
  const loadingDoneRef = useRef(false);

  useEffect(() => {
    let mounted = true;

    const markDone = () => {
      if (mounted && !loadingDoneRef.current) {
        loadingDoneRef.current = true;
        setLoading(false);
      }
    };

    // Safety timeout — never stay loading forever
    const timeout = setTimeout(() => {
      console.warn('AuthProvider: timeout reached, forcing loading=false');
      markDone();
    }, AUTH_TIMEOUT);

    const init = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!mounted) return;

        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          profileFetchedRef.current = currentUser.id;
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentUser.id)
            .single();
          if (mounted && data) {
            setProfile(data as unknown as Profile);
          }
        }
      } catch (e) {
        console.error('Auth init error:', e);
      } finally {
        markDone();
        clearTimeout(timeout);
      }
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      if (event === 'INITIAL_SESSION') return;

      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        if (profileFetchedRef.current !== currentUser.id) {
          profileFetchedRef.current = currentUser.id;
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
        }
      } else {
        profileFetchedRef.current = null;
        setProfile(null);
      }
    });

    return () => {
      mounted = false;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, [supabase]);

  const signOut = async () => {
    profileFetchedRef.current = null;
    loadingDoneRef.current = false;
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
