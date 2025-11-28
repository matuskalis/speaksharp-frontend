"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useTrialStatus } from "@/hooks/useTrialStatus";
import { AppShell } from "@/components/app-shell";
import { Paywall } from "@/components/paywall";
import StreakCounter from "../components/StreakCounter";
import DailyGoalProgress from "../components/DailyGoalProgress";
import QuickPracticeCard from "../components/QuickPracticeCard";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { useUserProfile } from "@/hooks/useUserProfile";

interface UserStats {
  currentStreak: number;
  longestStreak: number;
  minutesCompletedToday: number;
  dailyGoalMinutes: number;
}

interface PracticeOption {
  title: string;
  description: string;
  emoji: string;
  duration: string;
  href: string;
}

export default function LearnPage() {
  const { user } = useAuth();
  const { profile, loading } = useUserProfile();
  const { hasAccess } = useTrialStatus();
  const router = useRouter();
  const [userStats, setUserStats] = useState<UserStats>({
    currentStreak: 0,
    longestStreak: 0,
    minutesCompletedToday: 0,
    dailyGoalMinutes: 15,
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/get-started");
    }
  }, [user, loading, router]);

  // Redirect to onboarding if user hasn't completed it
  useEffect(() => {
    if (!loading && profile && !profile.onboarding_completed) {
      router.push("/get-started");
    }
  }, [profile, loading, router]);

  // Fetch real user stats from API
  useEffect(() => {
    if (profile) {
      const fetchStats = async () => {
        try {
          setIsLoadingStats(true);
          const streakData = await apiClient.getStreak();

          setUserStats({
            currentStreak: streakData.current_streak,
            longestStreak: streakData.longest_streak,
            minutesCompletedToday: 0, // TODO: Add API endpoint for daily minutes
            dailyGoalMinutes: profile.daily_time_goal || 15,
          });
        } catch (error) {
          console.error("Failed to fetch stats:", error);
          // Fallback to defaults
          setUserStats({
            currentStreak: 0,
            longestStreak: 0,
            minutesCompletedToday: 0,
            dailyGoalMinutes: profile.daily_time_goal || 15,
          });
        } finally {
          setIsLoadingStats(false);
        }
      };

      fetchStats();
    }
  }, [profile]);

  // Personalize practice options based on user's goals and interests
  const getPersonalizedDescription = (type: string): string => {
    const interests = profile?.interests || [];
    const goals = profile?.goals || [];

    if (type === "scenarios" && goals.includes("travel")) {
      return "Practice travel conversations and real-world situations";
    }
    if (type === "scenarios" && goals.includes("career")) {
      return "Practice professional conversations and workplace scenarios";
    }
    if (type === "vocabulary" && interests.includes("business")) {
      return "Expand your business and professional vocabulary";
    }
    if (type === "vocabulary" && interests.includes("technology")) {
      return "Learn tech-related words and modern terminology";
    }

    // Default descriptions
    const defaults: Record<string, string> = {
      scenarios: "Practice real-world conversations in different situations",
      vocabulary: "Learn new words and phrases for everyday use",
      drills: "Sharpen your grammar skills with focused exercises",
    };
    return defaults[type] || "";
  };

  if (loading || isLoadingStats) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-lg text-neutral-600">Loading...</div>
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  // Show paywall if user doesn't have access (trial expired and no subscription)
  if (!hasAccess) {
    return (
      <AppShell>
        <Paywall />
      </AppShell>
    );
  }

  // Personalized greeting based on user's goals
  const getPersonalizedGreeting = (): string => {
    const goals = profile.goals || [];
    if (goals.includes("career")) {
      return "Level up your professional English skills";
    }
    if (goals.includes("travel")) {
      return "Get ready for your next adventure";
    }
    if (goals.includes("school")) {
      return "Master English for academic success";
    }
    return "Keep up the great work with your English learning";
  };

  return (
    <AppShell>
      <div className="min-h-screen bg-neutral-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-neutral-900 mb-2">
              Welcome back{profile.full_name ? `, ${profile.full_name.split(' ')[0]}` : ""}!
            </h1>
            <p className="text-lg text-neutral-600">
              {getPersonalizedGreeting()}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <DailyGoalProgress
              minutesCompleted={userStats.minutesCompletedToday}
              dailyGoalMinutes={userStats.dailyGoalMinutes}
            />
            <StreakCounter
              currentStreak={userStats.currentStreak}
              longestStreak={userStats.longestStreak}
            />
          </div>

          {/* Today's Lesson - Featured */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              Today's Lesson
            </h2>
            <QuickPracticeCard
              title="Real-time Speaking Practice"
              description="Get instant feedback on your pronunciation and grammar as you speak"
              emoji="🎤"
              duration="10 min"
              href="/voice"
              variant="primary"
            />
          </div>

          {/* Quick Practice Options */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              Quick Practice
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <QuickPracticeCard
                title="Conversation Scenarios"
                description={getPersonalizedDescription("scenarios")}
                emoji="💬"
                duration="5 min"
                href="/scenarios"
              />
              <QuickPracticeCard
                title="Grammar Drills"
                description={getPersonalizedDescription("drills")}
                emoji="📝"
                duration="5 min"
                href="/drills"
              />
              <QuickPracticeCard
                title="Vocabulary Builder"
                description={getPersonalizedDescription("vocabulary")}
                emoji="📚"
                duration="5 min"
                href="/lessons"
              />
            </div>
          </div>

          {/* Additional Resources */}
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              More Practice
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <QuickPracticeCard
                title="AI Tutor Chat"
                description="Have a conversation with your personal AI English tutor"
                emoji="🤖"
                duration="10 min"
                href="/tutor"
              />
              <QuickPracticeCard
                title="Review Mistakes"
                description="Learn from your past errors and track improvement"
                emoji="🔍"
                duration="5 min"
                href="/review"
              />
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
