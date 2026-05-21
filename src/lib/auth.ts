import { createClient } from "@/lib/supabase/server";
import type { User } from "@/lib/types";
import {
  resolveAvailableUsername,
  suggestUsernameFromMetadata,
} from "@/lib/username";

function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

function userFromAuthUser(authUser: {
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

export async function ensureUserProfile(): Promise<void> {
  if (!isSupabaseConfigured()) return;

  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) return;

  const { data: existing } = await supabase
    .from("users")
    .select("id")
    .eq("id", authUser.id)
    .maybeSingle();

  if (existing) return;

  const isTaken = async (username: string) => {
    const { data } = await supabase
      .from("users")
      .select("id")
      .eq("username", username)
      .maybeSingle();
    return Boolean(data);
  };

  const username = await resolveAvailableUsername(
    suggestUsernameFromMetadata({
      username: authUser.user_metadata?.username,
      full_name: authUser.user_metadata?.full_name,
      name: authUser.user_metadata?.name,
      email: authUser.email,
    }),
    isTaken
  );

  await supabase.from("users").insert({
    id: authUser.id,
    email: authUser.email ?? "",
    username,
    avatar_url:
      authUser.user_metadata?.avatar_url ??
      authUser.user_metadata?.picture ??
      null,
    username_confirmed: false,
  });
}

export interface UsernameSetupState {
  needsSetup: boolean;
  suggestedUsername: string;
}

export async function getUsernameSetupState(): Promise<UsernameSetupState | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) return null;

  const { data: profile } = await supabase
    .from("users")
    .select("username, username_confirmed")
    .eq("id", authUser.id)
    .maybeSingle();

  const suggestedUsername = profile?.username
    ?? suggestUsernameFromMetadata({
      username: authUser.user_metadata?.username,
      full_name: authUser.user_metadata?.full_name,
      name: authUser.user_metadata?.name,
      email: authUser.email,
    });

  const needsSetup = profile ? profile.username_confirmed === false : true;

  return { needsSetup, suggestedUsername };
}

export async function getCurrentUser(): Promise<User | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) return null;

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", authUser.id)
    .maybeSingle();

  if (profile) return profile as User;

  return userFromAuthUser(authUser);
}

export async function requireCurrentUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Sign in required");
  }
  return user;
}
