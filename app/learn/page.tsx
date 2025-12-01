"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useTrialStatus } from "@/hooks/useTrialStatus";
import { useUserProfile } from "@/hooks/useUserProfile";
import { AppShell } from "@/components/app-shell";
import { Paywall } from "@/components/paywall";
import { LearnPageSkeleton } from "@/components/loading-skeleton";
import { apiClient } from "@/lib/api-client";
import { LearningDashboardResponse } from "@/lib/types";
import TodayFocus from "@/app/components/dashboard/TodayFocus";
import QuickActions from "@/app/components/dashboard/QuickActions";
import SkillBreakdown from "@/app/components/dashboard/SkillBreakdown";
import ProgressPath from "@/app/components/dashboard/ProgressPath";
import RecentGrowth from "@/app/components/dashboard/RecentGrowth";

export default function LearnPage() {
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile();
  const { hasAccess } = useTrialStatus();
  const router = useRouter();
  const [dashboardData, setDashboardData] =
    useState<LearningDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!profileLoading && !user) {
      router.push("/get-started");
    }
  }, [user, profileLoading, router]);

  useEffect(() => {
    if (!profileLoading && profile && !profile.onboarding_completed) {
      router.push("/get-started");
    }
  }, [profile, profileLoading, router]);

  useEffect(() => {
    if (profile && user) {
      const fetchDashboard = async () => {
        try {
          setLoading(true);
          const data = await apiClient.getLearningDashboard();
          setDashboardData(data);
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "Failed to load dashboard"
          );
        } finally {
          setLoading(false);
        }
      };

      fetchDashboard();
    }
  }, [profile, user]);

  if (profileLoading || loading) {
    return (
      <AppShell>
        <LearnPageSkeleton />
      </AppShell>
    );
  }

  if (!user || !profile) {
    return null;
  }

  if (!hasAccess) {
    return (
      <AppShell>
        <Paywall />
      </AppShell>
    );
  }

  if (error || !dashboardData) {
    return (
      <AppShell>
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
          <div className="max-w-md w-full bg-white border-2 border-red-200 rounded-lg p-8">
            <div className="text-center">
              <div className="text-5xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                Unable to Load Dashboard
              </h2>
              <p className="text-neutral-600 mb-6">
                {error || "An unexpected error occurred"}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-neutral-900 text-white rounded-lg font-semibold hover:bg-neutral-800 transition-all"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="min-h-screen bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-4xl font-bold text-neutral-900">
                Your Learning Dashboard
              </h1>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-sm text-neutral-600">Today</div>
                  <div className="text-2xl font-bold text-electric-600">
                    {dashboardData.minutesStudiedToday} min
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-neutral-600">Streak</div>
                  <div className="text-2xl font-bold text-orange-500">
                    {dashboardData.currentStreak} days
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-neutral-600">Goal</div>
                  <div className="text-2xl font-bold text-neutral-900">
                    {dashboardData.dailyGoal} min
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${Math.min(
                    (dashboardData.minutesStudiedToday /
                      dashboardData.dailyGoal) *
                      100,
                    100
                  )}%`,
                }}
                transition={{ duration: 1, delay: 0.3 }}
                className="h-2 bg-electric-500 rounded-full"
              />
            </div>
          </motion.div>

          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <TodayFocus tasks={dashboardData.todayFocus} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <QuickActions />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <SkillBreakdown scores={dashboardData.skillScores} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <ProgressPath progressPath={dashboardData.progressPath} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <RecentGrowth sessions={dashboardData.recentGrowth} />
            </motion.div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
