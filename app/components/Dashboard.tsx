"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { ErrorStatsResponse, SrsStatsResponse, WeakSkillsResponse, StreakResponse } from "@/lib/types";
import SessionSummary from "./SessionSummary";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [errorStats, setErrorStats] = useState<ErrorStatsResponse | null>(null);
  const [srsStats, setSrsStats] = useState<SrsStatsResponse | null>(null);
  const [weakSkills, setWeakSkills] = useState<WeakSkillsResponse | null>(null);
  const [streak, setStreak] = useState<StreakResponse | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [errors, srs, skills, streakData] = await Promise.all([
        apiClient.getErrorStats(),
        apiClient.getSrsStats(),
        apiClient.getWeakSkills(3),
        apiClient.getStreak().catch(() => ({ current_streak: 0, longest_streak: 0, last_active_date: null })),
      ]);

      setErrorStats(errors);
      setSrsStats(srs);
      setWeakSkills(skills);
      setStreak(streakData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 text-center">
        <div className="text-white/60">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="p-5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 backdrop-blur-sm">
          {error}
        </div>
      </div>
    );
  }

  // Calculate total sentences from error count (rough approximation)
  const totalSentences = errorStats?.total_errors || 0;

  // Error type colors
  const errorTypeColors: Record<string, string> = {
    grammar: "bg-red-500",
    vocab: "bg-purple-500",
    fluency: "bg-blue-500",
    structure: "bg-orange-500",
    pronunciation_placeholder: "bg-pink-500",
  };

  const errorTypeLabels: Record<string, string> = {
    grammar: "Grammar",
    vocab: "Vocabulary",
    fluency: "Fluency",
    structure: "Structure",
    pronunciation_placeholder: "Pronunciation",
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-4 mb-3">
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">
            Dashboard
          </h2>
          {streak && streak.current_streak > 0 && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-full">
              <span className="text-2xl">🔥</span>
              <span className="text-white font-bold text-lg">{streak.current_streak}</span>
              <span className="text-white/70 text-sm">day streak</span>
            </div>
          )}
        </div>
        <p className="text-white/50 text-lg">Your learning progress at a glance</p>
      </div>

      {/* Session Summary */}
      <SessionSummary />

      {/* Today Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cards Reviewed */}
        <div className="bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] p-7 hover:bg-white/[0.05] transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-white/60">Cards Reviewed Today</h3>
            <span className="text-3xl">📚</span>
          </div>
          <p className="text-4xl font-bold text-white">{srsStats?.reviewed_today || 0}</p>
          <p className="text-xs text-white/40 mt-2">
            {srsStats?.due_today || 0} cards due today
          </p>
        </div>

        {/* Accuracy */}
        <div className="bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] p-7 hover:bg-white/[0.05] transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-white/60">Success Rate Today</h3>
            <span className="text-3xl">🎯</span>
          </div>
          <p className="text-4xl font-bold text-white">
            {srsStats?.success_rate_today.toFixed(1) || 0}%
          </p>
          <p className="text-xs text-white/40 mt-2">
            Quality score ≥ 3
          </p>
        </div>

        {/* Total Cards */}
        <div className="bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] p-7 hover:bg-white/[0.05] transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-white/60">Total SRS Cards</h3>
            <span className="text-3xl">🗂️</span>
          </div>
          <p className="text-4xl font-bold text-white">{srsStats?.total_cards || 0}</p>
          <p className="text-xs text-white/40 mt-2">
            Errors tracked: {errorStats?.total_errors || 0}
          </p>
        </div>
      </div>

      {/* Error Breakdown */}
      <div className="bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] p-7">
        <h3 className="text-xl font-semibold text-white mb-6">Error Breakdown</h3>

        {errorStats && Object.keys(errorStats.errors_by_type).length > 0 ? (
          <div className="space-y-4">
            {Object.entries(errorStats.errors_by_type)
              .sort(([, a], [, b]) => b - a)
              .map(([type, count]) => {
                const percentage = ((count / errorStats.total_errors) * 100).toFixed(1);
                return (
                  <div key={type}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-white/80">
                        {errorTypeLabels[type] || type}
                      </span>
                      <span className="text-sm text-white/60">
                        {count} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-white/[0.05] rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full ${errorTypeColors[type] || "bg-gray-500"}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
          </div>
        ) : (
          <p className="text-white/40 text-center py-6">No errors recorded yet</p>
        )}
      </div>

      {/* Weakest Skills */}
      <div className="bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] p-7">
        <h3 className="text-xl font-semibold text-white mb-6">Areas to Improve</h3>

        {weakSkills && weakSkills.skills.length > 0 ? (
          <div className="space-y-4">
            {weakSkills.skills.map((skill, index) => (
              <div
                key={skill.skill_key}
                className="p-5 bg-white/[0.05] rounded-xl border border-white/[0.08] hover:bg-white/[0.08] transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-lg font-semibold text-white/70">
                        #{index + 1}
                      </span>
                      <h4 className="text-base font-medium text-white">
                        {skill.skill_key}
                      </h4>
                    </div>
                    <p className="text-xs text-white/50 mb-3">
                      Category: {skill.skill_category}
                    </p>
                    <div className="flex items-center space-x-6 text-sm">
                      <span className="text-white/60">
                        Mastery: <span className="font-medium text-white/90">{skill.mastery_score.toFixed(1)}%</span>
                      </span>
                      <span className="text-white/60">
                        Errors: <span className="font-medium text-red-400">{skill.error_count}</span>
                      </span>
                      <span className="text-white/60">
                        Practice: <span className="font-medium text-blue-400">{skill.practice_count}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-white/40 text-center py-6">No skill data available yet</p>
        )}
      </div>

      {/* Recent Errors */}
      <div className="bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] p-7">
        <h3 className="text-xl font-semibold text-white mb-6">Recent Errors</h3>

        {errorStats && errorStats.last_errors.length > 0 ? (
          <div className="space-y-4">
            {errorStats.last_errors.map((error, index) => (
              <div
                key={index}
                className="p-5 bg-white/[0.05] rounded-xl border border-white/[0.08] hover:bg-white/[0.08] transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="inline-block px-3 py-1 text-xs font-medium rounded-lg bg-red-500/20 text-red-300 border border-red-500/30">
                    {errorTypeLabels[error.type] || error.type}
                  </span>
                  <span className="text-xs text-white/50">
                    {new Date(error.timestamp).toLocaleDateString()} at{" "}
                    {new Date(error.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <span className="text-red-400 font-medium text-sm mt-1">✗</span>
                    <p className="text-white/60 line-through flex-1">{error.before_text}</p>
                  </div>

                  <div className="flex items-start space-x-2">
                    <span className="text-green-400 font-medium text-sm mt-1">✓</span>
                    <p className="text-white font-medium flex-1">{error.after_text}</p>
                  </div>

                  <div className="pl-6 pt-3 border-t border-white/[0.08]">
                    <p className="text-sm text-white/60 italic">{error.explanation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-white/40 text-center py-6">No errors recorded yet</p>
        )}
      </div>
    </div>
  );
}
