"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useTrialStatus } from "@/hooks/useTrialStatus";
import { useUserProfile } from "@/hooks/useUserProfile";
import { MobileAppShell } from "@/components/mobile-app-shell";
import { Paywall } from "@/components/paywall";
import { DailyChallenge } from "@/components/DailyChallenge";
import { apiClient } from "@/lib/api-client";
import { GuidedLearningResponse, ProgressSummaryResponse, GuidedSkill } from "@/lib/types";
import {
  Flame,
  Target,
  TrendingUp,
  ChevronRight,
  Zap,
  BookOpen,
  MessageCircle,
  Mic,
  PenLine,
  Brain,
  Play,
  AlertCircle,
  CheckCircle,
  Sparkles,
} from "lucide-react";

export default function LearnPage() {
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile();
  const { hasAccess } = useTrialStatus();
  const router = useRouter();
  const [guidedData, setGuidedData] = useState<GuidedLearningResponse | null>(null);
  const [progressData, setProgressData] = useState<ProgressSummaryResponse | null>(null);
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
      const fetchData = async () => {
        try {
          setLoading(true);
          setError(null);

          // Fetch guided learning and progress data in parallel
          const [guided, progress] = await Promise.all([
            apiClient.getGuidedLearning(),
            apiClient.getProgressSummary(),
          ]);

          // If user hasn't completed diagnostic, redirect
          if (!guided.has_diagnostic) {
            router.push("/diagnostic");
            return;
          }

          setGuidedData(guided);
          setProgressData(progress);
        } catch (err) {
          console.error("Guided mode fetch error:", err);
          setError(err instanceof Error ? err.message : "Failed to load learning data");
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [profile, user, router]);

  if (profileLoading || loading) {
    return (
      <MobileAppShell>
        <div className="p-4 space-y-4">
          <div className="glass rounded-2xl p-6 animate-pulse">
            <div className="h-8 bg-dark-200 rounded-lg w-2/3 mb-2" />
            <div className="h-4 bg-dark-300 rounded-lg w-1/2" />
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass rounded-2xl p-6 animate-pulse">
              <div className="h-6 bg-dark-200 rounded-lg w-1/3 mb-4" />
              <div className="h-20 bg-dark-300 rounded-xl" />
            </div>
          ))}
        </div>
      </MobileAppShell>
    );
  }

  if (!user || !profile) {
    return null;
  }

  if (!hasAccess) {
    return (
      <MobileAppShell hideNav>
        <Paywall />
      </MobileAppShell>
    );
  }

  if (error) {
    return (
      <MobileAppShell>
        <div className="min-h-screen bg-dark flex items-center justify-center p-4">
          <div className="glass gradient-border rounded-2xl p-8 text-center max-w-sm">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-text-primary mb-2">Something went wrong</h2>
            <p className="text-text-secondary text-sm mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-brand text-white rounded-xl font-semibold"
            >
              Try Again
            </button>
          </div>
        </div>
      </MobileAppShell>
    );
  }

  const userLevel = guidedData?.user_level || "A1";
  const masteryPct = progressData?.mastery_percentage || 0;

  return (
    <MobileAppShell>
      <div className="min-h-screen bg-dark">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-gradient-radial from-accent-purple/20 via-transparent to-transparent blur-3xl" />
            <div className="absolute top-20 right-0 w-[300px] h-[300px] bg-gradient-radial from-accent-pink/15 via-transparent to-transparent blur-3xl" />
          </div>

          <div className="relative px-4 pt-6 pb-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-2xl font-bold text-text-primary mb-1">
                {getGreeting()}, {profile.full_name?.split(" ")[0] || "Learner"}!
              </h1>
              <p className="text-text-secondary text-sm">
                Your AI-powered learning continues
              </p>
            </motion.div>

            {/* Level & Progress Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-5 glass gradient-border rounded-2xl p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-gradient-brand flex items-center justify-center shadow-btn-glow">
                    <span className="text-2xl font-bold text-white">{userLevel}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-text-primary">Your Level</span>
                    <p className="text-xs text-text-muted">
                      {masteryPct}% mastered
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-accent-purple" />
                  <span className="text-sm text-text-secondary">AI Calibrated</span>
                </div>
              </div>

              {/* Level breakdown bars */}
              {progressData && (
                <div className="space-y-2">
                  {(["A1", "A2", "B1"] as const).map((level) => {
                    const levelData = progressData.by_level[level];
                    const pct = levelData?.mastery_percentage || 0;
                    return (
                      <div key={level} className="flex items-center gap-3">
                        <span className="text-xs text-text-muted w-6">{level}</span>
                        <div className="flex-1 h-2 bg-dark-300 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className={`h-full rounded-full ${
                              level === "A1"
                                ? "bg-gradient-to-r from-green-500 to-emerald-400"
                                : level === "A2"
                                ? "bg-gradient-to-r from-blue-500 to-cyan-400"
                                : "bg-gradient-to-r from-purple-500 to-violet-400"
                            }`}
                          />
                        </div>
                        <span className="text-xs font-medium text-text-secondary w-8 text-right">
                          {pct}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4 space-y-5 pb-8">
          {/* Daily Challenge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <DailyChallenge />
          </motion.div>

          {/* Focus Skills Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass gradient-border rounded-2xl p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-accent-purple" />
                <h2 className="font-bold text-text-primary text-lg">Focus Skills</h2>
              </div>
              <span className="text-xs bg-accent-purple/20 text-accent-purple px-2 py-1 rounded-full">
                AI Recommended
              </span>
            </div>

            {guidedData?.skills && guidedData.skills.length > 0 ? (
              <div className="space-y-3">
                {guidedData.skills.map((skill, idx) => (
                  <SkillCard key={skill.skill_key} skill={skill} index={idx} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                <p className="text-text-secondary">
                  Great job! You've mastered all skills at your level.
                </p>
              </div>
            )}
          </motion.div>

          {/* Featured Think Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <Link href="/think">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600/30 via-purple-500/20 to-pink-500/20 border border-purple-500/30 p-5 hover:border-purple-400/50 transition-all group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-purple-400/20 via-transparent to-transparent blur-2xl" />
                <div className="relative flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-105 transition-transform">
                    <Brain className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-text-primary text-lg">Think in English</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-300 font-medium">
                        AI Conversation
                      </span>
                    </div>
                    <p className="text-text-secondary text-sm">
                      Practice expressing your thoughts naturally with AI guidance
                    </p>
                  </div>
                  <ChevronRight className="w-6 h-6 text-purple-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Practice Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass gradient-border rounded-2xl p-5"
          >
            <h2 className="font-bold text-text-primary text-lg mb-4">
              Practice Modes
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <PracticeCard
                href="/voice"
                icon={Mic}
                title="Speaking"
                description="Pronunciation practice"
                color="green"
              />
              <PracticeCard
                href="/practice"
                icon={PenLine}
                title="Exercises"
                description="Grammar drills"
                color="blue"
              />
              <PracticeCard
                href="/review"
                icon={BookOpen}
                title="Review"
                description="Spaced repetition"
                color="orange"
              />
            </div>
          </motion.div>

          {/* Retake Diagnostic Option */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Link href="/diagnostic">
              <div className="glass rounded-xl p-4 flex items-center gap-3 hover:bg-dark-200/50 transition-all">
                <div className="w-10 h-10 rounded-lg bg-dark-300 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-text-muted" />
                </div>
                <div className="flex-1">
                  <span className="text-sm font-medium text-text-secondary">
                    Retake Diagnostic Test
                  </span>
                  <p className="text-xs text-text-muted">
                    Recalibrate your AI learning path
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-text-muted" />
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </MobileAppShell>
  );
}

// Skill Card Component
function SkillCard({ skill, index }: { skill: GuidedSkill; index: number }) {
  const masteryPct = Math.round(skill.p_learned * 100);
  const levelColors: Record<string, string> = {
    A1: "from-green-500 to-emerald-400",
    A2: "from-blue-500 to-cyan-400",
    B1: "from-purple-500 to-violet-400",
  };
  const gradientColor = levelColors[skill.level] || "from-purple-500 to-pink-400";

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 * index }}
      className="bg-dark-200/50 border border-white/[0.06] rounded-xl p-4"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs px-2 py-0.5 rounded-full bg-gradient-to-r ${gradientColor} text-white font-medium`}>
              {skill.level}
            </span>
            <span className="text-xs text-text-muted">{skill.domain}</span>
          </div>
          <h3 className="font-semibold text-text-primary">{skill.name}</h3>
        </div>
        <Link
          href={`/practice?skill=${encodeURIComponent(skill.skill_key)}&domain=${encodeURIComponent(skill.domain)}&level=${encodeURIComponent(skill.level)}&name=${encodeURIComponent(skill.name)}`}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-brand text-white text-sm font-medium rounded-lg shadow-btn-glow hover:shadow-btn-glow-hover transition-all"
        >
          <Play className="w-3.5 h-3.5" />
          Practice
        </Link>
      </div>

      {/* Mastery Bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-dark-300 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${masteryPct}%` }}
            transition={{ duration: 0.6, delay: 0.3 + 0.1 * index }}
            className={`h-full rounded-full bg-gradient-to-r ${gradientColor}`}
          />
        </div>
        <span className="text-xs font-medium text-text-secondary w-10 text-right">
          {masteryPct}%
        </span>
      </div>

      {/* Sample Exercise Preview */}
      {skill.sample_exercise && (
        <div className="mt-3 p-3 bg-dark-300/50 rounded-lg">
          <p className="text-xs text-text-muted mb-1">Sample question:</p>
          <p className="text-sm text-text-secondary line-clamp-2">
            {skill.sample_exercise.question}
          </p>
        </div>
      )}
    </motion.div>
  );
}

function PracticeCard({
  href,
  icon: Icon,
  title,
  description,
  color,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  color: "blue" | "green" | "purple" | "orange";
}) {
  const colorClasses = {
    blue: "from-blue-500/20 to-cyan-500/20 text-blue-400 group-hover:from-blue-500/30 group-hover:to-cyan-500/30",
    green: "from-green-500/20 to-emerald-500/20 text-green-400 group-hover:from-green-500/30 group-hover:to-emerald-500/30",
    purple: "from-purple-500/20 to-pink-500/20 text-purple-400 group-hover:from-purple-500/30 group-hover:to-pink-500/30",
    orange: "from-orange-500/20 to-amber-500/20 text-orange-400 group-hover:from-orange-500/30 group-hover:to-amber-500/30",
  };

  return (
    <Link href={href}>
      <div className="group p-4 rounded-xl bg-dark-200/50 border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 hover:bg-dark-200">
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center mb-3 transition-all`}>
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="font-semibold text-text-primary">{title}</h3>
        <p className="text-xs text-text-muted mt-0.5">{description}</p>
      </div>
    </Link>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}
