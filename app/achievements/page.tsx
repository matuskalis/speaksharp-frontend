"use client";

import { useState, useEffect } from "react";
import { AppShell } from "@/components/app-shell";
import { apiClient } from "@/lib/api-client";
import { Achievement } from "@/lib/types";
import { Trophy, Lock, Star, Target, Flame, Award, Users } from "lucide-react";
import { ShareButton } from "@/components/social/ShareButton";
import { generateAchievementShareText, formatAchievementForShare } from "@/lib/share-utils";

type CategoryFilter = "all" | "milestone" | "streak" | "mastery" | "social";

export default function AchievementsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("all");

  const [allAchievements, setAllAchievements] = useState<Achievement[]>([]);
  const [myAchievements, setMyAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    loadAchievementsData();
  }, []);

  const loadAchievementsData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [all, mine] = await Promise.all([
        apiClient.getAchievements(),
        apiClient.getMyAchievements(),
      ]);

      setAllAchievements(all.achievements);
      setMyAchievements(mine.achievements);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load achievements");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AppShell>
        <div className="max-w-5xl mx-auto p-6 text-center">
          <div className="text-white/60">Loading achievements...</div>
        </div>
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="max-w-5xl mx-auto p-6">
          <div className="p-5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 backdrop-blur-sm">
            {error}
          </div>
        </div>
      </AppShell>
    );
  }

  // Create lookup map of unlocked achievements
  const unlockedMap = new Map(
    myAchievements.map((ach) => [ach.achievement_key, ach])
  );

  // Combine all achievements with unlock status
  const achievementsWithStatus = allAchievements.map((ach) => {
    const unlocked = unlockedMap.get(ach.achievement_key);
    return {
      ...ach,
      unlocked: !!unlocked,
      unlocked_at: unlocked?.unlocked_at,
      progress: unlocked?.progress,
    };
  });

  // Filter achievements by selected category
  const filteredAchievements = selectedCategory === "all"
    ? achievementsWithStatus
    : achievementsWithStatus.filter(a => a.category === selectedCategory);

  // Calculate stats
  const totalPoints = myAchievements.reduce((sum, ach) => sum + ach.points, 0);
  const unlockedCount = myAchievements.length;
  const totalCount = allAchievements.length;

  // Category configuration
  const categories: {
    key: CategoryFilter;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
  }[] = [
    { key: "all", label: "All", icon: Trophy, color: "text-white" },
    { key: "milestone", label: "Milestones", icon: Target, color: "text-blue-400" },
    { key: "streak", label: "Streaks", icon: Flame, color: "text-orange-400" },
    { key: "mastery", label: "Mastery", icon: Award, color: "text-purple-400" },
    { key: "social", label: "Social", icon: Users, color: "text-green-400" },
  ];

  // Tier badge styling
  const getTierBadge = (tier: string, isUnlocked: boolean) => {
    const styles = {
      bronze: "bg-amber-900/30 border-amber-600/40 text-amber-300",
      silver: "bg-gray-600/30 border-gray-400/40 text-gray-200",
      gold: "bg-yellow-600/30 border-yellow-500/40 text-yellow-300",
      platinum: "bg-cyan-600/30 border-cyan-400/40 text-cyan-200",
    };

    const lockedStyles = {
      bronze: "bg-white/5 border-white/10 text-white/30",
      silver: "bg-white/5 border-white/10 text-white/30",
      gold: "bg-white/5 border-white/10 text-white/30",
      platinum: "bg-white/5 border-white/10 text-white/30",
    };

    const emojis = {
      bronze: "🥉",
      silver: "🥈",
      gold: "🥇",
      platinum: "💎",
    };

    const styleMap = isUnlocked ? styles : lockedStyles;

    return (
      <div className={`px-3 py-1 rounded-lg text-xs font-semibold border ${styleMap[tier as keyof typeof styleMap] || styleMap.bronze}`}>
        <span className="mr-1 opacity-70">{emojis[tier as keyof typeof emojis] || "🏆"}</span>
        {tier.charAt(0).toUpperCase() + tier.slice(1)}
      </div>
    );
  };

  // Get category icon
  const getCategoryIcon = (category: string) => {
    const categoryConfig = categories.find(c => c.key === category);
    return categoryConfig ? categoryConfig.icon : Trophy;
  };

  // Get category color
  const getCategoryColor = (category: string) => {
    const categoryConfig = categories.find(c => c.key === category);
    return categoryConfig ? categoryConfig.color : "text-white";
  };

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-white/90 to-purple-300 mb-3">
            Achievements
          </h2>
          <p className="text-white/50 text-lg">Track your learning milestones</p>
        </div>

        {/* Stats Overview */}
        <div className="bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] p-7">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Points */}
            <div className="text-center p-5 bg-white/[0.03] rounded-xl border border-white/[0.08]">
              <div className="text-4xl mb-2">
                <Star className="w-12 h-12 mx-auto text-yellow-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">{totalPoints}</div>
              <div className="text-sm text-white/60">Total Points</div>
            </div>

            {/* Unlocked Count */}
            <div className="text-center p-5 bg-white/[0.03] rounded-xl border border-white/[0.08]">
              <div className="text-4xl mb-2">
                <Trophy className="w-12 h-12 mx-auto text-amber-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {unlockedCount}/{totalCount}
              </div>
              <div className="text-sm text-white/60">Achievements Unlocked</div>
            </div>

            {/* Completion Rate */}
            <div className="text-center p-5 bg-white/[0.03] rounded-xl border border-white/[0.08]">
              <div className="text-4xl mb-2">📊</div>
              <div className="text-3xl font-bold text-white mb-1">
                {totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0}%
              </div>
              <div className="text-sm text-white/60">Completion Rate</div>
            </div>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] p-2">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = selectedCategory === category.key;

              return (
                <button
                  key={category.key}
                  onClick={() => setSelectedCategory(category.key)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 text-white shadow-lg"
                      : "bg-white/[0.03] border border-white/[0.08] text-white/60 hover:bg-white/[0.08] hover:text-white/80"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? category.color : "text-white/40"}`} />
                  <span>{category.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Achievements Grid */}
        {filteredAchievements.length > 0 ? (
          <div className="bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] p-7">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
              {filteredAchievements.map((achievement) => {
                const isUnlocked = achievement.unlocked;
                const CategoryIcon = getCategoryIcon(achievement.category);
                const categoryColor = getCategoryColor(achievement.category);

                return (
                  <div
                    key={achievement.achievement_id}
                    className={`p-5 rounded-xl border transition-all duration-300 ${
                      isUnlocked
                        ? "bg-white/[0.08] border-white/[0.15] hover:bg-white/[0.12] hover:border-white/[0.20] hover:shadow-lg"
                        : "bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.04] grayscale"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3 flex-1">
                        {/* Icon */}
                        <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                          isUnlocked
                            ? "bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30"
                            : "bg-white/[0.03] border border-white/[0.08]"
                        }`}>
                          {isUnlocked ? (
                            <CategoryIcon className={`w-5 h-5 ${categoryColor}`} />
                          ) : (
                            <Lock className="w-5 h-5 text-white/30" />
                          )}
                        </div>

                        {/* Title and Date */}
                        <div className="flex-1 min-w-0">
                          <h4 className={`font-semibold text-base ${isUnlocked ? "text-white" : "text-white/40"}`}>
                            {achievement.title}
                          </h4>
                          {isUnlocked && achievement.unlocked_at && (
                            <p className="text-xs text-white/40 mt-0.5">
                              {new Date(achievement.unlocked_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Tier Badge */}
                      <div className="flex-shrink-0">
                        {getTierBadge(achievement.tier, isUnlocked)}
                      </div>
                    </div>

                    <p className={`text-sm mb-4 ${isUnlocked ? "text-white/70" : "text-white/30"}`}>
                      {achievement.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className={`flex items-center gap-1.5 text-sm font-semibold ${isUnlocked ? "text-yellow-400" : "text-white/30"}`}>
                        <Star className="w-4 h-4" />
                        {achievement.points} pts
                      </div>

                      {achievement.progress !== undefined && achievement.progress < 100 && (
                        <div className="flex items-center gap-2 flex-1 ml-4">
                          <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                              style={{ width: `${achievement.progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-white/60 font-medium min-w-[3rem] text-right">
                            {Math.round(achievement.progress)}%
                          </span>
                        </div>
                      )}

                      {/* Share Button (only for unlocked achievements) */}
                      {isUnlocked && (
                        <div className="ml-3">
                          <ShareButton
                            title={achievement.title}
                            text={generateAchievementShareText(formatAchievementForShare(achievement))}
                            variant="icon"
                            onShare={(platform) => {
                              console.log(`Shared achievement ${achievement.title} on ${platform}`);
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] p-12 text-center">
            <div className="text-6xl mb-4">
              {allAchievements.length === 0 ? "🏆" : "🔍"}
            </div>
            <p className="text-white/40 text-lg">
              {allAchievements.length === 0
                ? "No achievements available yet"
                : `No ${selectedCategory} achievements`}
            </p>
            <p className="text-white/30 text-sm mt-2">
              {allAchievements.length === 0
                ? "Check back soon for new achievements!"
                : "Try selecting a different category"}
            </p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
