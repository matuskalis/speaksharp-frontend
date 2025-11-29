"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useTrialStatus } from "@/hooks/useTrialStatus";
import { AppShell } from "@/components/app-shell";
import { Paywall } from "@/components/paywall";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { useUserProfile } from "@/hooks/useUserProfile";
import { LearnPageSkeleton } from "@/components/loading-skeleton";
import {
  Flame,
  Target,
  Mic,
  MessageSquare,
  BookOpen,
  Dumbbell,
  Bot,
  RotateCcw,
  ArrowRight,
  TrendingUp,
  Clock
} from "lucide-react";

interface UserStats {
  currentStreak: number;
  longestStreak: number;
  minutesCompletedToday: number;
  dailyGoalMinutes: number;
}

interface PracticeCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  duration: string;
  href: string;
  variant?: "featured" | "default";
}

function PracticeCard({ title, description, icon, duration, href, variant = "default" }: PracticeCardProps) {
  const router = useRouter();

  if (variant === "featured") {
    return (
      <button
        onClick={() => router.push(href)}
        className="w-full bg-gradient-to-br from-electric-600 to-electric-500 rounded-2xl p-8 text-left hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] group border-2 border-electric-400"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-electric-600">
            {icon}
          </div>
          <div className="flex items-center gap-2 bg-white/20 text-white px-3 py-1.5 rounded-lg text-sm font-mono">
            <Clock className="w-3.5 h-3.5" />
            <span>{duration}</span>
          </div>
        </div>

        <h3 className="text-2xl font-serif font-semibold text-white mb-3">
          {title}
        </h3>

        <p className="text-white/90 mb-6 leading-relaxed">
          {description}
        </p>

        <div className="inline-flex items-center gap-2 text-white font-semibold group-hover:gap-3 transition-all">
          <span>Start Practice</span>
          <ArrowRight className="w-5 h-5" />
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={() => router.push(href)}
      className="w-full bg-white border-2 border-neutral-200 rounded-xl p-6 text-left hover:border-electric-400 transition-all duration-300 hover:shadow-lg group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-electric-50 rounded-lg flex items-center justify-center text-electric-600 group-hover:bg-electric-500 group-hover:text-white transition-all">
          {icon}
        </div>
        <div className="flex items-center gap-1.5 bg-neutral-100 text-neutral-600 px-3 py-1.5 rounded-lg text-sm font-mono">
          <Clock className="w-3.5 h-3.5" />
          <span>{duration}</span>
        </div>
      </div>

      <h3 className="text-lg font-serif font-semibold text-neutral-900 mb-2">
        {title}
      </h3>

      <p className="text-neutral-600 text-sm mb-4 leading-relaxed">
        {description}
      </p>

      <div className="inline-flex items-center gap-2 text-electric-600 font-semibold text-sm group-hover:gap-3 transition-all">
        <span>Start</span>
        <ArrowRight className="w-4 h-4" />
      </div>
    </button>
  );
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

  useEffect(() => {
    if (!loading && profile && !profile.onboarding_completed) {
      router.push("/get-started");
    }
  }, [profile, loading, router]);

  useEffect(() => {
    if (profile) {
      const fetchStats = async () => {
        try {
          setIsLoadingStats(true);
          const streakData = await apiClient.getStreak();

          setUserStats({
            currentStreak: streakData.current_streak,
            longestStreak: streakData.longest_streak,
            minutesCompletedToday: 0,
            dailyGoalMinutes: profile.daily_time_goal || 15,
          });
        } catch (error) {
          console.error("Failed to fetch stats:", error);
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

    const defaults: Record<string, string> = {
      scenarios: "Practice real-world conversations in different situations",
      vocabulary: "Learn new words and phrases for everyday use",
      drills: "Sharpen your grammar skills with focused exercises",
    };
    return defaults[type] || "";
  };

  if (loading || isLoadingStats) {
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

  const progress = Math.min((userStats.minutesCompletedToday / userStats.dailyGoalMinutes) * 100, 100);
  const isGoalComplete = userStats.minutesCompletedToday >= userStats.dailyGoalMinutes;

  return (
    <AppShell>
      <div className="min-h-screen bg-neutral-50">
        <div className="max-w-6xl mx-auto px-8 py-12">
          {/* Welcome Header */}
          <div className="mb-12">
            <h1 className="text-5xl font-serif font-bold text-neutral-900 mb-3">
              Welcome back{profile.full_name ? `, ${profile.full_name.split(' ')[0]}` : ""}!
            </h1>
            <p className="text-xl text-neutral-600">
              {getPersonalizedGreeting()}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* Daily Goal Card */}
            <div className="bg-white border-2 border-neutral-200 rounded-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-electric-50 rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-electric-600" />
                  </div>
                  <h3 className="text-xl font-serif font-semibold text-neutral-900">
                    Daily Goal
                  </h3>
                </div>
                {isGoalComplete && (
                  <span className="text-2xl">✓</span>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-baseline mb-3">
                    <span className="text-4xl font-serif font-bold text-neutral-900">
                      {userStats.minutesCompletedToday} <span className="text-2xl text-neutral-600">min</span>
                    </span>
                    <span className="text-sm text-neutral-600 font-mono">
                      of {userStats.dailyGoalMinutes} min
                    </span>
                  </div>

                  <div className="w-full bg-neutral-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${
                        isGoalComplete ? "bg-green-500" : "bg-electric-500"
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {isGoalComplete ? (
                  <div className="flex items-center gap-2 text-green-600 font-medium">
                    <TrendingUp className="w-4 h-4" />
                    <span>Goal completed! Great work!</span>
                  </div>
                ) : (
                  <div className="text-neutral-600">
                    {userStats.dailyGoalMinutes - userStats.minutesCompletedToday} min remaining today
                  </div>
                )}
              </div>
            </div>

            {/* Streak Card */}
            <div className="bg-white border-2 border-neutral-200 rounded-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                    <Flame className="w-6 h-6 text-orange-500" />
                  </div>
                  <h3 className="text-xl font-serif font-semibold text-neutral-900">
                    Daily Streak
                  </h3>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-5xl font-serif font-bold text-neutral-900 mb-2">
                    {userStats.currentStreak}
                  </div>
                  <div className="text-neutral-600">
                    {userStats.currentStreak === 1 ? "day" : "days"} in a row
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-200">
                  <div className="text-sm text-neutral-600 mb-1">Your longest streak</div>
                  <div className="text-2xl font-serif font-semibold text-neutral-900">
                    {userStats.longestStreak} {userStats.longestStreak === 1 ? "day" : "days"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Today's Featured Lesson */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <div className="text-sm font-mono text-electric-600 bg-electric-50 px-3 py-1.5 rounded-lg uppercase tracking-wider">
                Featured
              </div>
              <h2 className="text-3xl font-serif font-bold text-neutral-900">
                Today's Practice
              </h2>
            </div>

            <PracticeCard
              title="Real-time Speaking Practice"
              description="Get instant feedback on your pronunciation and grammar as you speak. Our AI analyzes your speech in real-time using advanced phonetic analysis."
              icon={<Mic className="w-7 h-7" />}
              duration="10 min"
              href="/voice"
              variant="featured"
            />
          </div>

          {/* Quick Practice Options */}
          <div className="mb-12">
            <h2 className="text-3xl font-serif font-bold text-neutral-900 mb-6">
              Quick Practice
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <PracticeCard
                title="Conversation Scenarios"
                description={getPersonalizedDescription("scenarios")}
                icon={<MessageSquare className="w-6 h-6" />}
                duration="5 min"
                href="/scenarios"
              />
              <PracticeCard
                title="Grammar Drills"
                description={getPersonalizedDescription("drills")}
                icon={<Dumbbell className="w-6 h-6" />}
                duration="5 min"
                href="/drills"
              />
              <PracticeCard
                title="Vocabulary Builder"
                description={getPersonalizedDescription("vocabulary")}
                icon={<BookOpen className="w-6 h-6" />}
                duration="5 min"
                href="/lessons"
              />
            </div>
          </div>

          {/* Additional Resources */}
          <div>
            <h2 className="text-3xl font-serif font-bold text-neutral-900 mb-6">
              More Practice
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PracticeCard
                title="AI Tutor Chat"
                description="Have a natural conversation with your personal AI English tutor. Get corrections and explanations in real-time."
                icon={<Bot className="w-6 h-6" />}
                duration="10 min"
                href="/tutor"
              />
              <PracticeCard
                title="Review Mistakes"
                description="Learn from your past errors with spaced repetition. Track improvement and master your weak points."
                icon={<RotateCcw className="w-6 h-6" />}
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
