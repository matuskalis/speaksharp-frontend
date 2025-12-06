import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useGamification } from "@/contexts/GamificationContext";
import { apiClient } from "@/lib/api-client";
import { UserProfileResponse } from "@/lib/types";

export function useUserProfile() {
  const { user: authUser, loading: authLoading } = useAuth();
  const { syncXPFromBackend } = useGamification();
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!authUser) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const profileData = await apiClient.getCurrentUser();
        setProfile(profileData);

        // Sync XP from backend (authoritative source)
        if (profileData.total_xp !== undefined) {
          syncXPFromBackend(profileData.total_xp);
        }
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
        setError(err instanceof Error ? err : new Error("Failed to fetch profile"));
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [authUser, authLoading, syncXPFromBackend]);

  return { profile, loading: authLoading || loading, error };
}
