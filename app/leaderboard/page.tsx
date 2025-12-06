"use client";

import { useState, useEffect } from "react";
import { AppShell } from "@/components/app-shell";
import { apiClient } from "@/lib/api-client";
import { LeaderboardEntry, LeaderboardResponse } from "@/lib/types";
import { Trophy, Medal, Flame, TrendingUp, Crown, Award, Star } from "lucide-react";

type LeaderboardTab = "weekly" | "monthly" | "alltime" | "streaks";

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<LeaderboardTab>("weekly");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<LeaderboardResponse | null>(null);

  useEffect(() => {
    loadLeaderboard();
  }, [activeTab]);

  const loadLeaderboard = async () => {
    setLoading(true);
    setError(null);

    try {
      let response: LeaderboardResponse;

      switch (activeTab) {
        case "weekly":
          response = await apiClient.getWeeklyLeaderboard();
          break;
        case "monthly":
          response = await apiClient.getMonthlyLeaderboard();
          break;
        case "alltime":
          response = await apiClient.getAllTimeLeaderboard();
          break;
        case "streaks":
          response = await apiClient.getStreakLeaderboard();
          break;
      }

      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load leaderboard");
    } finally {
      setLoading(false);
    }
  };

  const getXpValue = (entry: LeaderboardEntry): number => {
    switch (activeTab) {
      case "weekly":
        return entry.xp_this_week || 0;
      case "monthly":
        return entry.xp_this_month || 0;
      case "alltime":
        return entry.total_xp || 0;
      case "streaks":
        return entry.current_streak || 0;
      default:
        return 0;
    }
  };

  const getXpLabel = (): string => {
    switch (activeTab) {
      case "streaks":
        return "days";
      default:
        return "XP";
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-amber-600" />;
    return null;
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/50 animate-pulse">
          <span className="text-xl font-bold text-white">1</span>
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center shadow-lg">
          <span className="text-xl font-bold text-white">2</span>
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center shadow-lg">
          <span className="text-xl font-bold text-white">3</span>
        </div>
      );
    }
    return (
      <div className="w-12 h-12 rounded-full bg-white/[0.08] flex items-center justify-center border border-white/[0.15]">
        <span className="text-lg font-semibold text-white/70">{rank}</span>
      </div>
    );
  };

  const tabs: { key: LeaderboardTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: "weekly", label: "Weekly", icon: TrendingUp },
    { key: "monthly", label: "Monthly", icon: Award },
    { key: "alltime", label: "All Time", icon: Trophy },
    { key: "streaks", label: "Streaks", icon: Flame },
  ];

  if (loading) {
    return (
      <AppShell>
        <div className="max-w-5xl mx-auto p-6 text-center">
          <div className="text-white/60 text-lg">Loading leaderboard...</div>
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

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-white/90 to-purple-300 mb-3">
            Leaderboard
          </h2>
          <p className="text-white/50 text-lg">Compete with learners worldwide</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] p-2">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;

              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 text-white shadow-lg"
                      : "bg-white/[0.03] border border-white/[0.08] text-white/60 hover:bg-white/[0.08] hover:text-white/80"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-blue-400" : "text-white/40"}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Current User Rank Card */}
        {data?.current_user && (
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-md rounded-2xl border border-blue-400/30 shadow-[0_8px_32px_0_rgba(59,130,246,0.15)] p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Trophy className="w-8 h-8 text-blue-400" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Your Rank</h3>
                  <p className="text-sm text-white/60">Current standing</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white">#{data.current_user.rank}</div>
                <div className="text-sm text-white/60">
                  {getXpValue(data.current_user)} {getXpLabel()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard Table */}
        <div className="bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] overflow-hidden">
          {data?.leaderboard && data.leaderboard.length > 0 ? (
            <div className="divide-y divide-white/[0.08]">
              {data.leaderboard.map((entry) => {
                const xpValue = getXpValue(entry);
                const isTopThree = entry.rank <= 3;
                const isCurrentUser = data.current_user?.user_id === entry.user_id;

                return (
                  <div
                    key={entry.user_id}
                    className={`flex items-center gap-4 p-5 transition-all duration-300 ${
                      isTopThree
                        ? "bg-gradient-to-r from-yellow-500/5 to-transparent hover:from-yellow-500/10"
                        : isCurrentUser
                        ? "bg-blue-500/10 hover:bg-blue-500/15"
                        : "hover:bg-white/[0.05]"
                    }`}
                  >
                    {/* Rank Badge */}
                    <div className="flex-shrink-0">
                      {getRankBadge(entry.rank)}
                    </div>

                    {/* Rank Icon for Top 3 */}
                    {isTopThree && (
                      <div className="flex-shrink-0">
                        {getRankIcon(entry.rank)}
                      </div>
                    )}

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className={`font-semibold truncate ${
                          isTopThree ? "text-white" : "text-white/90"
                        }`}>
                          {entry.display_name}
                        </h4>
                        {isCurrentUser && (
                          <span className="px-2 py-0.5 bg-blue-500/20 border border-blue-400/30 rounded-md text-xs text-blue-300 font-medium">
                            You
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-white/50">Level {entry.level}</p>
                    </div>

                    {/* XP/Streak Value */}
                    <div className="text-right flex-shrink-0">
                      <div className={`flex items-center gap-1.5 ${
                        isTopThree ? "text-yellow-400" : "text-white"
                      }`}>
                        {activeTab === "streaks" ? (
                          <Flame className="w-5 h-5" />
                        ) : (
                          <Star className="w-5 h-5" />
                        )}
                        <span className="text-xl font-bold">
                          {xpValue.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-white/50">{getXpLabel()}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">🏆</div>
              <p className="text-white/40 text-lg">No data available yet</p>
              <p className="text-white/30 text-sm mt-2">
                Complete lessons and earn XP to appear on the leaderboard!
              </p>
            </div>
          )}
        </div>

        {/* Info Card */}
        <div className="bg-white/[0.03] backdrop-blur-md rounded-xl border border-white/[0.08] p-6">
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            How to earn XP
          </h3>
          <ul className="space-y-2 text-sm text-white/70">
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">•</span>
              <span>Complete lessons, exercises, and practice sessions (10 XP each)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">•</span>
              <span>Maintain your daily streak to climb the streak leaderboard</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">•</span>
              <span>Leaderboards reset weekly and monthly - compete for the top spot!</span>
            </li>
          </ul>
        </div>
      </div>
    </AppShell>
  );
}
