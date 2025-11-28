"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { AppShell } from "@/components/app-shell";
import DailySession from "./components/DailySession";

export default function Home() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile();

  useEffect(() => {
    // Redirect authenticated users who have completed onboarding to /learn
    if (!authLoading && !profileLoading && user && profile?.onboarding_completed) {
      router.push("/learn");
    }
  }, [user, profile, authLoading, profileLoading, router]);

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-lg text-neutral-600">Loading...</div>
      </div>
    );
  }

  return (
    <AppShell>
      <DailySession />
    </AppShell>
  );
}
