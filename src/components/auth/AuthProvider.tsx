"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { User } from "@/lib/types";
import { suggestUsernameFromMetadata } from "@/lib/username";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  configured: boolean;
  signInWithGoogle: (nextPath?: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function fetchProfile(userId: string): Promise<User | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  return (data as User | null) ?? null;
}

function profileFromAuthUser(authUser: {
  id: string;
  email?: string;
  created_at?: string;
  user_metadata?: Record<string, string>;
}): User {
  return {
    id: authUser.id,
    email: authUser.email ?? "",
    username: suggestUsernameFromMetadata({
      username: authUser.user_metadata?.username,
      full_name: authUser.user_metadata?.full_name,
      name: authUser.user_metadata?.name,
      email: authUser.email,
    }),
    avatar_url:
      authUser.user_metadata?.avatar_url ??
      authUser.user_metadata?.picture ??
      null,
    bio: null,
    created_at: authUser.created_at ?? new Date().toISOString(),
    username_confirmed: false,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const configured = isSupabaseConfigured();

  const refreshProfile = useCallback(async () => {
    if (!configured) {
      setUser(null);
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) {
      setUser(null);
      setLoading(false);
      return;
    }

    const profile = await fetchProfile(authUser.id);
    setUser(profile ?? profileFromAuthUser(authUser));
    setLoading(false);
  }, [configured]);

  useEffect(() => {
    refreshProfile();

    if (!configured) return;

    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      refreshProfile();
    });

    return () => subscription.unsubscribe();
  }, [configured, refreshProfile]);

  const signInWithGoogle = useCallback(
    async (nextPath = "/") => {
      if (!configured) return;

      window.location.assign(
        `/api/auth/google?next=${encodeURIComponent(nextPath)}`
      );
    },
    [configured]
  );

  const signOut = useCallback(async () => {
    if (!configured) return;

    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
  }, [configured]);

  const value = useMemo(
    () => ({
      user,
      loading,
      configured,
      signInWithGoogle,
      signOut,
      refreshProfile,
    }),
    [user, loading, configured, signInWithGoogle, signOut, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
