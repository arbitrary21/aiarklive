"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { ProfileLoadingState } from "@/components/profile/ProfileView";
import { ProfilePageClient } from "@/components/profile/ProfilePageClient";

export default function MyProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login?next=/profile/me");
    }
  }, [loading, user, router]);

  if (loading) {
    return <ProfileLoadingState />;
  }

  if (!user) {
    return <ProfileLoadingState />;
  }

  return <ProfilePageClient profileId={user.id} />;
}
