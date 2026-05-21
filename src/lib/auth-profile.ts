import type { SupabaseClient } from "@supabase/supabase-js";
import {
  resolveAvailableUsername,
  suggestUsernameFromMetadata,
} from "@/lib/username";

export interface UsernameSetupState {
  needsSetup: boolean;
  suggestedUsername: string;
}

export async function ensureUserProfileWithClient(
  supabase: SupabaseClient
): Promise<void> {
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

export async function getUsernameSetupStateWithClient(
  supabase: SupabaseClient
): Promise<UsernameSetupState | null> {
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
