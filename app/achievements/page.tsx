"use client";

import { useState, useEffect } from "react";
import { AppShell } from "@/components/app-shell";
import { apiClient } from "@/lib/api-client";
import { Achievement } from "@/lib/types";
import { Trophy, Lock, Star } from "lucide-react";

export default function AchievementsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Group by category
  const achievementsByCategory = achievementsWithStatus.reduce((acc, ach) => {
    if (!acc[ach.category]) {
      acc[ach.category] = [];
    }
    acc[ach.category].push(ach);
    return acc;
  }, {} as Record<string, typeof achievementsWithStatus>);

  // Calculate stats
  const totalPoints = myAchievements.reduce((sum, ach) => sum + ach.points, 0);
  const unlockedCount = myAchievements.length;
  const totalCount = allAchievements.length;

  // Tier badge styling
  const getTierBadge = (tier: string) => {
    const styles = {
      bronze: "bg-amber-900/30 border-amber-600/40 text-amber-300",
      silver: "bg-gray-600/30 border-gray-400/40 text-gray-200",
      gold: "bg-yellow-600/30 border-yellow-500/40 text-yellow-300",
      platinum: "bg-cyan-600/30 border-cyan-400/40 text-cyan-200",
    };

    const emojis = {
      bronze: "🥉",
      silver: "🥈",
      gold: "🥇",
      platinum: "💎",
    };

    return (
      <div className={`px-3 py-1 rounded-lg text-xs font-semibold border ${styles[tier as keyof typeof styles] || styles.bronze}`}>
        <span className="mr-1">{emojis[tier as keyof typeof emojis] || "🏆"}</span>
        {tier.charAt(0).toUpperCase() + tier.slice(1)}
      </div>
    );
  };

  // Category labels
  const categoryLabels: Record<string, string> = {
    milestone: "Milestones",
    streak: "Streaks",
    mastery: "Mastery",
    social: "Social",
  };

  const categoryEmojis: Record<string, string> = {
    milestone: "🎯",
    streak: "🔥",
    mastery: "⭐",
    social: "👥",
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

        {/* Achievements by Category */}
        {Object.entries(achievementsByCategory).map(([category, achievements]) => (
          <div
            key={category}
            className="bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] p-7"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">{categoryEmojis[category] || "🏆"}</span>
              <h3 className="text-xl font-semibold text-white">
                {categoryLabels[category] || category}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement) => {
                const isUnlocked = achievement.unlocked;

                return (
                  <div
                    key={achievement.achievement_id}
                    className={`p-5 rounded-xl border transition-all duration-300 ${
                      isUnlocked
                        ? "bg-white/[0.08] border-white/[0.15] hover:bg-white/[0.12]"
                        : "bg-white/[0.02] border-white/[0.05] opacity-60"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {isUnlocked ? (
                          <Trophy className="w-6 h-6 text-yellow-400" />
                        ) : (
                          <Lock className="w-6 h-6 text-white/30" />
                        )}
                        <div>
                          <h4 className={`font-semibold ${isUnlocked ? "text-white" : "text-white/50"}`}>
                            {achievement.title}
                          </h4>
                          {isUnlocked && achievement.unlocked_at && (
                            <p className="text-xs text-white/40 mt-1">
                              Unlocked {new Date(achievement.unlocked_at).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                      {getTierBadge(achievement.tier)}
                    </div>

                    <p className={`text-sm mb-3 ${isUnlocked ? "text-white/70" : "text-white/40"}`}>
                      {achievement.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className={`text-sm font-semibold ${isUnlocked ? "text-yellow-400" : "text-white/40"}`}>
                        {achievement.points} points
                      </div>

                      {achievement.progress !== undefined && achievement.progress < 100 && (
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                              style={{ width: `${achievement.progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-white/60">{Math.round(achievement.progress)}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Empty State */}
        {allAchievements.length === 0 && (
          <div className="bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] p-12 text-center">
            <div className="text-6xl mb-4">🏆</div>
            <p className="text-white/40 text-lg">No achievements available yet</p>
            <p className="text-white/30 text-sm mt-2">Check back soon for new achievements!</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
