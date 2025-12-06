"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useTrialStatus } from "@/hooks/useTrialStatus";
import { useGamification } from "@/contexts/GamificationContext";
import { MobileAppShell } from "@/components/mobile-app-shell";
import { apiClient } from "@/lib/api-client";
import { Achievement, WeakSkill } from "@/lib/types";
import {
  User,
  Mail,
  Calendar,
  Crown,
  LogOut,
  ChevronRight,
  Settings,
  Bell,
  HelpCircle,
  Shield,
  Flame,
  Zap,
  Star,
  Trophy,
  Target,
  BookOpen,
  Clock,
  Award,
  TrendingUp,
  Edit2,
  Lock,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { ShareButton } from "@/components/social/ShareButton";
import { generateStatsShareText } from "@/lib/share-utils";

export default function ProfilePage() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { profile } = useUserProfile();
  const { trialDaysRemaining, isSubscriptionActive, isTester } = useTrialStatus();
  const { xp, streak, longestStreak } = useGamification();
  const [signingOut, setSigningOut] = useState(false);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [weakSkills, setWeakSkills] = useState<WeakSkill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const [achievementsData, skillsData] = await Promise.all([
          apiClient.getMyAchievements(),
          apiClient.getWeakSkills(4),
        ]);
        setAchievements(achievementsData.achievements);
        setWeakSkills(skillsData.skills);
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfileData();
    }
  }, [user]);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
      router.push("/");
    } finally {
      setSigningOut(false);
    }
  };

  if (!user) {
    router.push("/get-started");
    return null;
  }

  const memberSince = user.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Unknown";

  const getInitials = (name: string | null, email: string | undefined) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return email?.charAt(0).toUpperCase() || "U";
  };

  const getCEFRLevel = (level: string | undefined) => {
    if (!level) return "A1";
    return level.toUpperCase();
  };

  const getSkillIcon = (skillCategory: string) => {
    const category = skillCategory.toLowerCase();
    if (category.includes("grammar")) return BookOpen;
    if (category.includes("vocab")) return Target;
    if (category.includes("fluency")) return Zap;
    if (category.includes("pronunciation")) return Star;
    return Target;
  };

  const getSkillColor = (masteryScore: number) => {
    if (masteryScore >= 80) return "from-green-500 to-emerald-500";
    if (masteryScore >= 60) return "from-yellow-500 to-orange-500";
    if (masteryScore >= 40) return "from-orange-500 to-red-500";
    return "from-red-500 to-pink-500";
  };

  // Calculate stats
  const totalXP = xp.total;
  const currentLevel = xp.level;
  const currentStreak = streak;
  const longestStreakValue = longestStreak;

  // Mock data for features not yet in backend
  const totalStudyTime = 0; // In minutes
  const exercisesCompleted = 0;
  const lessonsCompleted = 0;

  // Journey milestones
  const journeyMilestones = [
    {
      id: 1,
      title: "Joined Vorex",
      date: memberSince,
      icon: Star,
      color: "text-blue-400",
    },
    ...(currentStreak >= 7
      ? [
          {
            id: 2,
            title: "7 Day Streak",
            date: "Recent",
            icon: Flame,
            color: "text-orange-400",
          },
        ]
      : []),
    ...(currentLevel >= 3
      ? [
          {
            id: 3,
            title: `Reached Level ${currentLevel}`,
            date: "Recent",
            icon: Zap,
            color: "text-purple-400",
          },
        ]
      : []),
  ];

  return (
    <MobileAppShell>
      <div className="min-h-screen bg-dark pb-8">
        {/* Profile Header */}
        <div className="relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-gradient-radial from-accent-purple/30 via-transparent to-transparent blur-3xl" />
            <div className="absolute top-10 right-0 w-[300px] h-[300px] bg-gradient-radial from-accent-pink/20 via-transparent to-transparent blur-3xl" />
          </div>

          <div className="relative px-4 pt-8 pb-12">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="relative inline-block">
                {/* Avatar with initials */}
                <div className="w-24 h-24 bg-gradient-brand rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-btn-glow">
                  <span className="text-3xl font-bold text-white">
                    {getInitials(profile?.full_name || null, user.email)}
                  </span>
                </div>
                {/* CEFR Level Badge */}
                <div className="absolute -bottom-1 -right-1 px-2.5 py-1 bg-dark-100 rounded-full flex items-center justify-center border-2 border-dark shadow-lg">
                  <span className="text-xs font-bold text-accent-purple">
                    {getCEFRLevel(profile?.level)}
                  </span>
                </div>
              </div>
              <h1 className="text-2xl font-bold text-text-primary mb-1">
                {profile?.full_name || user.email?.split("@")[0] || "User"}
              </h1>
              <p className="text-text-muted text-sm mb-3">{user.email}</p>
              <div className="flex items-center justify-center gap-3 text-xs text-text-muted">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Joined {memberSince}</span>
                </div>
              </div>
              {/* Edit Profile Button */}
              <button
                onClick={() => router.push("/settings/profile")}
                className="mt-4 px-4 py-2 bg-dark-300 hover:bg-dark-400 rounded-xl text-text-primary text-sm font-medium transition-colors flex items-center gap-2 mx-auto"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </button>
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 -mt-4 space-y-4">
          {/* Stats Overview Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass gradient-border rounded-2xl p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wide">
                Progress Stats
              </h3>
              <ShareButton
                title="My Vorex Progress"
                text={generateStatsShareText({
                  type: 'xp',
                  value: totalXP,
                  context: `Level ${currentLevel} | ${currentStreak} day streak`
                })}
                variant="icon"
                onShare={(platform) => {
                  console.log(`Shared stats on ${platform}`);
                }}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {/* Total XP */}
              <div className="bg-dark-200/50 rounded-xl p-4 border border-white/[0.05]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                    <Star className="w-4 h-4 text-yellow-400" />
                  </div>
                  <span className="text-xs text-text-muted">Total XP</span>
                </div>
                <div className="text-2xl font-bold text-text-primary">{totalXP}</div>
              </div>

              {/* Current Level */}
              <div className="bg-dark-200/50 rounded-xl p-4 border border-white/[0.05]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-accent-purple/20 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-accent-purple" />
                  </div>
                  <span className="text-xs text-text-muted">Level</span>
                </div>
                <div className="text-2xl font-bold text-text-primary">{currentLevel}</div>
              </div>

              {/* Current Streak */}
              <div className="bg-dark-200/50 rounded-xl p-4 border border-white/[0.05]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                    <Flame className="w-4 h-4 text-orange-400" />
                  </div>
                  <span className="text-xs text-text-muted">Streak</span>
                </div>
                <div className="text-2xl font-bold text-text-primary">
                  {currentStreak}
                  <span className="text-sm text-text-muted ml-1">/ {longestStreakValue}</span>
                </div>
              </div>

              {/* Total Study Time */}
              <div className="bg-dark-200/50 rounded-xl p-4 border border-white/[0.05]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="text-xs text-text-muted">Study Time</span>
                </div>
                <div className="text-2xl font-bold text-text-primary">
                  {totalStudyTime}
                  <span className="text-sm text-text-muted ml-1">min</span>
                </div>
              </div>

              {/* Exercises Completed */}
              <div className="bg-dark-200/50 rounded-xl p-4 border border-white/[0.05]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <Target className="w-4 h-4 text-green-400" />
                  </div>
                  <span className="text-xs text-text-muted">Exercises</span>
                </div>
                <div className="text-2xl font-bold text-text-primary">{exercisesCompleted}</div>
              </div>

              {/* Lessons Completed */}
              <div className="bg-dark-200/50 rounded-xl p-4 border border-white/[0.05]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-pink-400" />
                  </div>
                  <span className="text-xs text-text-muted">Lessons</span>
                </div>
                <div className="text-2xl font-bold text-text-primary">{lessonsCompleted}</div>
              </div>
            </div>
          </motion.div>

          {/* Achievement Showcase */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass gradient-border rounded-2xl p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wide">
                Recent Achievements
              </h3>
              <button
                onClick={() => router.push("/achievements")}
                className="text-xs text-accent-purple hover:text-accent-blue transition-colors flex items-center gap-1"
              >
                View All
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            {loading ? (
              <div className="text-center py-8 text-text-muted text-sm">Loading...</div>
            ) : achievements.length > 0 ? (
              <div className="grid grid-cols-1 gap-3">
                {achievements.slice(0, 3).map((achievement) => (
                  <div
                    key={achievement.achievement_id}
                    className="bg-dark-200/50 rounded-xl p-3 border border-white/[0.05] flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 flex items-center justify-center flex-shrink-0">
                      <Trophy className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-text-primary truncate">
                        {achievement.title}
                      </h4>
                      <p className="text-xs text-text-muted truncate">{achievement.description}</p>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-400 text-xs font-semibold flex-shrink-0">
                      <Star className="w-3 h-3" />
                      {achievement.points}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Lock className="w-12 h-12 text-text-muted/30 mx-auto mb-2" />
                <p className="text-text-muted text-sm">No achievements unlocked yet</p>
                <p className="text-text-dim text-xs mt-1">Keep learning to unlock achievements!</p>
              </div>
            )}
          </motion.div>

          {/* Learning Journey Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass gradient-border rounded-2xl p-5"
          >
            <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-4">
              Learning Journey
            </h3>
            <div className="space-y-4">
              {journeyMilestones.map((milestone, index) => {
                const Icon = milestone.icon;
                return (
                  <div key={milestone.id} className="flex items-start gap-3">
                    <div className="relative flex-shrink-0">
                      <div className={`w-10 h-10 rounded-lg bg-dark-200/50 border border-white/[0.05] flex items-center justify-center ${milestone.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      {index < journeyMilestones.length - 1 && (
                        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-white/[0.05]" />
                      )}
                    </div>
                    <div className="flex-1 pt-2">
                      <h4 className="font-semibold text-sm text-text-primary">
                        {milestone.title}
                      </h4>
                      <p className="text-xs text-text-muted">{milestone.date}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Skills Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass gradient-border rounded-2xl p-5"
          >
            <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-4">
              Skills to Improve
            </h3>
            {loading ? (
              <div className="text-center py-8 text-text-muted text-sm">Loading...</div>
            ) : weakSkills.length > 0 ? (
              <div className="space-y-4">
                {weakSkills.map((skill) => {
                  const Icon = getSkillIcon(skill.skill_category);
                  const colorClass = getSkillColor(skill.mastery_score);
                  return (
                    <div key={skill.skill_key}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-text-muted" />
                          <span className="text-sm font-medium text-text-primary capitalize">
                            {skill.skill_category}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-text-primary">
                          {Math.round(skill.mastery_score)}%
                        </span>
                      </div>
                      <div className="h-2 bg-dark-300 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${colorClass} transition-all duration-500`}
                          style={{ width: `${skill.mastery_score}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <TrendingUp className="w-12 h-12 text-text-muted/30 mx-auto mb-2" />
                <p className="text-text-muted text-sm">No skill data available yet</p>
                <p className="text-text-dim text-xs mt-1">Complete more exercises to see your progress!</p>
              </div>
            )}
          </motion.div>

          {/* Subscription Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass gradient-border rounded-2xl p-5"
          >
            <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-4">
              Subscription
            </h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl ${
                  isSubscriptionActive ? "bg-yellow-500/20" : "bg-dark-300"
                } flex items-center justify-center`}>
                  {isSubscriptionActive ? (
                    <Crown className="w-6 h-6 text-yellow-400" />
                  ) : isTester ? (
                    <Star className="w-6 h-6 text-blue-400" />
                  ) : (
                    <Zap className="w-6 h-6 text-accent-purple" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-text-primary">
                    {isSubscriptionActive ? "Premium" : isTester ? "Tester" : "Free Plan"}
                  </p>
                  {!isSubscriptionActive && !isTester && trialDaysRemaining !== null && (
                    <p className="text-xs text-text-muted">
                      {trialDaysRemaining > 0
                        ? `Trial: ${trialDaysRemaining} days left`
                        : "Trial expired"}
                    </p>
                  )}
                  {isSubscriptionActive && (
                    <p className="text-xs text-text-muted">Active subscription</p>
                  )}
                </div>
              </div>
              {!isSubscriptionActive && !isTester && (
                <button
                  onClick={() => router.push("/subscribe")}
                  className="px-4 py-2 bg-gradient-brand text-white rounded-xl font-medium text-sm shadow-btn-glow hover:shadow-btn-glow-hover transition-all"
                >
                  Upgrade
                </button>
              )}
            </div>
          </motion.div>

          {/* Settings Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass gradient-border rounded-2xl overflow-hidden"
          >
            <div className="p-4 border-b border-white/[0.06]">
              <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wide">
                Settings
              </h3>
            </div>
            <div>
              <SettingsRow icon={Settings} label="Preferences" onClick={() => router.push("/settings")} />
              <SettingsRow icon={Bell} label="Notifications" onClick={() => router.push("/settings")} />
              <SettingsRow icon={Shield} label="Privacy" onClick={() => router.push("/settings")} />
              <SettingsRow icon={HelpCircle} label="Help & Support" />
            </div>
          </motion.div>

          {/* Sign Out */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className="w-full p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center justify-center gap-2 text-red-400 font-medium hover:bg-red-500/20 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              {signingOut ? "Signing out..." : "Sign Out"}
            </button>
          </motion.div>
        </div>
      </div>
    </MobileAppShell>
  );
}

function SettingsRow({
  icon: Icon,
  label,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-white/[0.02] transition-colors border-b border-white/[0.04] last:border-b-0"
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-dark-300 flex items-center justify-center">
          <Icon className="w-5 h-5 text-text-muted" />
        </div>
        <span className="text-text-primary">{label}</span>
      </div>
      <ChevronRight className="w-5 h-5 text-text-muted" />
    </button>
  );
}
