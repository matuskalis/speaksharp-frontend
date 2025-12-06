"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import { ErrorStatsResponse, SrsStatsResponse, WeakSkillsResponse } from "@/lib/types";
import { useGamification } from "@/contexts/GamificationContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import {
  Flame,
  Trophy,
  Heart,
  TrendingUp,
  Target,
  BookOpen,
  BarChart3,
  Award,
  Zap
} from "lucide-react";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [errorStats, setErrorStats] = useState<ErrorStatsResponse | null>(null);
  const [srsStats, setSrsStats] = useState<SrsStatsResponse | null>(null);
  const [weakSkills, setWeakSkills] = useState<WeakSkillsResponse | null>(null);

  // Use gamification context for XP, streak, and hearts
  const { xp, streak, longestStreak, hearts } = useGamification();

  // Use user profile hook
  const { profile } = useUserProfile();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [errors, srs, skills] = await Promise.all([
        apiClient.getErrorStats().catch(() => null),
        apiClient.getSrsStats().catch(() => null),
        apiClient.getWeakSkills(5).catch(() => null),
      ]);

      setErrorStats(errors);
      setSrsStats(srs);
      setWeakSkills(skills);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <div className="text-white/60">Loading your progress...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
          {error}
        </div>
      </div>
    );
  }

  // Calculate XP progress percentage
  const xpProgress = ((xp.toNextLevel > 0 ? (100 - (xp.toNextLevel / 100) * 100) : 0));

  // Generate mock weekly activity data (last 7 days)
  const generateWeeklyActivity = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const today = new Date().getDay();
    const reorderedDays = [...days.slice(today), ...days.slice(0, today)];

    return reorderedDays.map((day, index) => ({
      day,
      minutes: index === 6 ? (srsStats?.reviewed_today || 0) * 2 : Math.floor(Math.random() * 30),
    }));
  };

  const weeklyActivity = generateWeeklyActivity();
  const maxMinutes = Math.max(...weeklyActivity.map(d => d.minutes), 1);

  // Error type colors and labels
  const errorTypeColors: Record<string, string> = {
    grammar: "bg-gradient-to-r from-red-500 to-red-600",
    vocab: "bg-gradient-to-r from-purple-500 to-purple-600",
    fluency: "bg-gradient-to-r from-blue-500 to-blue-600",
    structure: "bg-gradient-to-r from-orange-500 to-orange-600",
    pronunciation_placeholder: "bg-gradient-to-r from-pink-500 to-pink-600",
  };

  const errorTypeLabels: Record<string, string> = {
    grammar: "Grammar",
    vocab: "Vocabulary",
    fluency: "Fluency",
    structure: "Structure",
    pronunciation_placeholder: "Pronunciation",
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300 mb-3">
          Progress Dashboard
        </h1>
        <p className="text-white/60 text-lg">Track your English learning journey</p>
      </div>

      {/* Top Stats Row - Streak, XP, Hearts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Streak Card */}
        <div className="bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] p-6 hover:border-white/[0.15] transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white/60 text-sm font-medium uppercase tracking-wide">Streak</h3>
            <Flame className="w-6 h-6 text-orange-400" />
          </div>
          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-white">{streak}</span>
              <span className="text-white/40 text-lg">days</span>
            </div>
            <p className="text-white/40 text-sm">
              Longest: <span className="text-white/60 font-medium">{longestStreak} days</span>
            </p>
          </div>
        </div>

        {/* XP Card */}
        <div className="bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] p-6 hover:border-white/[0.15] transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white/60 text-sm font-medium uppercase tracking-wide">Level {xp.level}</h3>
            <Trophy className="w-6 h-6 text-yellow-400" />
          </div>
          <div className="space-y-3">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-white">{xp.total}</span>
              <span className="text-white/40 text-lg">XP</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-white/40">
                <span>Level Progress</span>
                <span>{xpProgress.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-white/[0.08] rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${xpProgress}%` }}
                />
              </div>
              <p className="text-white/40 text-xs">{xp.toNextLevel} XP to Level {xp.level + 1}</p>
            </div>
          </div>
        </div>

        {/* Hearts Card */}
        <div className="bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] p-6 hover:border-white/[0.15] transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white/60 text-sm font-medium uppercase tracking-wide">Hearts</h3>
            <Heart className="w-6 h-6 text-red-400 fill-red-400" />
          </div>
          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-white">{hearts.current}</span>
              <span className="text-white/40 text-lg">/ {hearts.max}</span>
            </div>
            <div className="flex gap-1">
              {Array.from({ length: hearts.max }).map((_, i) => (
                <Heart
                  key={i}
                  className={`w-5 h-5 ${
                    i < hearts.current
                      ? 'text-red-400 fill-red-400'
                      : 'text-white/[0.08] fill-white/[0.08]'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Activity Chart */}
      <div className="bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] p-7">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Weekly Activity</h3>
          <BarChart3 className="w-5 h-5 text-white/40" />
        </div>
        <div className="flex items-end justify-between gap-3 h-48">
          {weeklyActivity.map((data, index) => {
            const heightPercent = (data.minutes / maxMinutes) * 100;
            return (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex items-end justify-center h-40">
                  <div
                    className="w-full bg-gradient-to-t from-indigo-500 to-indigo-400 rounded-t-lg transition-all duration-500 hover:from-indigo-400 hover:to-indigo-300"
                    style={{ height: `${Math.max(heightPercent, 5)}%` }}
                    title={`${data.minutes} minutes`}
                  />
                </div>
                <span className="text-white/40 text-xs font-medium">{data.day}</span>
              </div>
            );
          })}
        </div>
        <div className="mt-4 text-center">
          <p className="text-white/40 text-sm">
            Total this week: <span className="text-white/60 font-medium">{weeklyActivity.reduce((sum, d) => sum + d.minutes, 0)} minutes</span>
          </p>
        </div>
      </div>

      {/* Skills & Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skills Mastery */}
        <div className="bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] p-7">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Skills Mastery</h3>
            <Target className="w-5 h-5 text-white/40" />
          </div>

          {weakSkills && weakSkills.skills && weakSkills.skills.length > 0 ? (
            <div className="space-y-4">
              {weakSkills.skills.slice(0, 5).map((skill) => (
                <div key={skill.skill_key} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/80 font-medium">{skill.skill_key}</span>
                    <span className="text-white/60">{skill.mastery_score.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-white/[0.08] rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        skill.mastery_score >= 80
                          ? 'bg-gradient-to-r from-green-400 to-emerald-400'
                          : skill.mastery_score >= 50
                          ? 'bg-gradient-to-r from-yellow-400 to-orange-400'
                          : 'bg-gradient-to-r from-red-400 to-rose-400'
                      }`}
                      style={{ width: `${skill.mastery_score}%` }}
                    />
                  </div>
                  <div className="flex items-center gap-4 text-xs text-white/40">
                    <span>Errors: {skill.error_count}</span>
                    <span>Practice: {skill.practice_count}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Award className="w-12 h-12 text-white/20 mx-auto mb-3" />
              <p className="text-white/40">No skill data yet</p>
              <p className="text-white/30 text-sm mt-1">Start practicing to see your progress</p>
            </div>
          )}
        </div>

        {/* SRS Review Stats */}
        <div className="bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] p-7">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Review Stats</h3>
            <BookOpen className="w-5 h-5 text-white/40" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/[0.05] rounded-xl p-4 border border-white/[0.08]">
              <div className="text-3xl font-bold text-white mb-1">{srsStats?.total_cards || 0}</div>
              <div className="text-white/40 text-sm">Total Cards</div>
            </div>
            <div className="bg-white/[0.05] rounded-xl p-4 border border-white/[0.08]">
              <div className="text-3xl font-bold text-white mb-1">{srsStats?.due_today || 0}</div>
              <div className="text-white/40 text-sm">Due Today</div>
            </div>
            <div className="bg-white/[0.05] rounded-xl p-4 border border-white/[0.08]">
              <div className="text-3xl font-bold text-white mb-1">{srsStats?.reviewed_today || 0}</div>
              <div className="text-white/40 text-sm">Reviewed</div>
            </div>
            <div className="bg-white/[0.05] rounded-xl p-4 border border-white/[0.08]">
              <div className="text-3xl font-bold text-white mb-1">
                {srsStats?.success_rate_today.toFixed(0) || 0}%
              </div>
              <div className="text-white/40 text-sm">Success Rate</div>
            </div>
          </div>

          {srsStats && srsStats.due_today > 0 && (
            <Link
              href="/review"
              className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white font-medium rounded-lg transition-all duration-200"
            >
              <Zap className="w-4 h-4" />
              Review Now
            </Link>
          )}
        </div>
      </div>

      {/* Error Breakdown */}
      <div className="bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] p-7">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Error Analysis</h3>
          <TrendingUp className="w-5 h-5 text-white/40" />
        </div>

        {errorStats && Object.keys(errorStats.errors_by_type).length > 0 ? (
          <div className="space-y-4">
            {Object.entries(errorStats.errors_by_type)
              .sort(([, a], [, b]) => (b as number) - (a as number))
              .map(([type, count]) => {
                const percentage = ((count as number / errorStats.total_errors) * 100).toFixed(1);
                return (
                  <div key={type}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/80 font-medium">
                        {errorTypeLabels[type] || type}
                      </span>
                      <span className="text-white/60 text-sm">
                        {count} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-white/[0.08] rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-2.5 rounded-full transition-all duration-500 ${errorTypeColors[type] || "bg-gradient-to-r from-gray-400 to-gray-500"}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            <div className="pt-4 border-t border-white/[0.08]">
              <p className="text-white/40 text-sm text-center">
                Total errors tracked: <span className="text-white/60 font-medium">{errorStats.total_errors}</span>
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <TrendingUp className="w-12 h-12 text-white/20 mx-auto mb-3" />
            <p className="text-white/40">No errors recorded yet</p>
            <p className="text-white/30 text-sm mt-1">Start learning to track your mistakes</p>
          </div>
        )}
      </div>

      {/* Recent Errors Summary */}
      {errorStats && errorStats.last_errors && errorStats.last_errors.length > 0 && (
        <div className="bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] p-7">
          <h3 className="text-xl font-semibold text-white mb-6">Recent Corrections</h3>
          <div className="space-y-4">
            {errorStats.last_errors.slice(0, 3).map((error, index) => (
              <div
                key={index}
                className="p-5 bg-white/[0.05] rounded-xl border border-white/[0.08] hover:border-white/[0.15] transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="inline-block px-2.5 py-1 text-xs font-medium rounded-lg bg-red-500/20 text-red-300 border border-red-500/30">
                    {errorTypeLabels[error.type] || error.type}
                  </span>
                  <span className="text-xs text-white/40">
                    {new Date(error.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <div className="space-y-2">
                  <p className="text-white/60 line-through text-sm">{error.before_text}</p>
                  <p className="text-white text-sm font-medium">{error.after_text}</p>
                  <p className="text-white/40 text-xs italic pt-2 border-t border-white/[0.08]">
                    {error.explanation}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {errorStats.last_errors.length > 3 && (
            <div className="mt-4 text-center">
              <Link
                href="/insights"
                className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors"
              >
                View all errors
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
