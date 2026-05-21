import { createClient } from "@/lib/supabase/server";
import type { User } from "@/lib/types";
import {
  ensureUserProfileWithClient,
  getUsernameSetupStateWithClient,
  type UsernameSetupState,
} from "@/lib/auth-profile";
import {
  suggestUsernameFromMetadata,
} from "@/lib/username";

export type { UsernameSetupState };
export { ensureUserProfileWithClient, getUsernameSetupStateWithClient };

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
  await ensureUserProfileWithClient(await createClient());
}

export async function getUsernameSetupState(): Promise<UsernameSetupState | null> {
  if (!isSupabaseConfigured()) return null;
  return getUsernameSetupStateWithClient(await createClient());
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
