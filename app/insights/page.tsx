"use client";

import { useState, useEffect } from "react";
import { AppShell } from "@/components/app-shell";
import { apiClient } from "@/lib/api-client";
import { ErrorStatsResponse, SrsStatsResponse, WeakSkillsResponse } from "@/lib/types";

export default function InsightsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [errorStats, setErrorStats] = useState<ErrorStatsResponse | null>(null);
  const [srsStats, setSrsStats] = useState<SrsStatsResponse | null>(null);
  const [weakSkills, setWeakSkills] = useState<WeakSkillsResponse | null>(null);

  useEffect(() => {
    loadInsightsData();
  }, []);

  const loadInsightsData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [errors, srs, skills] = await Promise.all([
        apiClient.getErrorStats().catch(() => null),
        apiClient.getSrsStats().catch(() => null),
        apiClient.getWeakSkills(3).catch(() => null),
      ]);

      setErrorStats(errors);
      setSrsStats(srs);
      setWeakSkills(skills);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load insights data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AppShell>
        <div className="max-w-5xl mx-auto p-6 text-center">
          <div className="text-white/60">Loading insights...</div>
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

  const totalErrors = errorStats?.total_errors || 0;
  const totalReviews = srsStats?.reviewed_today || 0;
  const totalCards = srsStats?.total_cards || 0;

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300 mb-3">
            Insights
          </h2>
          <p className="text-white/50 text-lg">Track your learning journey</p>
        </div>

        {/* Activity Stats */}
        <div className="bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] p-7">
          <h3 className="text-xl font-semibold text-white mb-6">Activity Overview</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Errors */}
            <div className="text-center p-5 bg-white/[0.03] rounded-xl border border-white/[0.08]">
              <div className="text-4xl mb-2">📝</div>
              <div className="text-3xl font-bold text-white mb-1">{totalErrors}</div>
              <div className="text-sm text-white/60">Total Errors Tracked</div>
            </div>

            {/* SRS Cards */}
            <div className="text-center p-5 bg-white/[0.03] rounded-xl border border-white/[0.08]">
              <div className="text-4xl mb-2">🗂️</div>
              <div className="text-3xl font-bold text-white mb-1">{totalCards}</div>
              <div className="text-sm text-white/60">SRS Cards Created</div>
            </div>

            {/* Reviews Today */}
            <div className="text-center p-5 bg-white/[0.03] rounded-xl border border-white/[0.08]">
              <div className="text-4xl mb-2">📚</div>
              <div className="text-3xl font-bold text-white mb-1">{totalReviews}</div>
              <div className="text-sm text-white/60">Reviews Today</div>
            </div>
          </div>
        </div>

        {/* Weak Skills */}
        <div className="bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] p-7">
          <h3 className="text-xl font-semibold text-white mb-6">Top Areas to Improve</h3>

          {weakSkills && weakSkills.skills && weakSkills.skills.length > 0 ? (
            <div className="space-y-4">
              {weakSkills.skills.slice(0, 3).map((skill, index) => (
                <div
                  key={skill.skill_key}
                  className="p-5 bg-white/[0.05] rounded-xl border border-white/[0.08]"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl font-bold text-white/30">#{index + 1}</span>
                      <h4 className="text-lg font-medium text-white">{skill.skill_key}</h4>
                    </div>
                    <div className="text-sm px-3 py-1 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      {skill.skill_category}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center text-sm">
                    <div>
                      <div className="text-white/40 mb-1">Mastery</div>
                      <div className="text-white font-semibold">{skill.mastery_score.toFixed(0)}%</div>
                    </div>
                    <div>
                      <div className="text-white/40 mb-1">Errors</div>
                      <div className="text-red-400 font-semibold">{skill.error_count}</div>
                    </div>
                    <div>
                      <div className="text-white/40 mb-1">Practice</div>
                      <div className="text-blue-400 font-semibold">{skill.practice_count}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-white/40 text-lg">No skill data yet</p>
              <p className="text-white/30 text-sm mt-2">Start learning to see your weakest skills</p>
            </div>
          )}
        </div>

        {/* Recent Progress */}
        <div className="bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] p-7">
          <h3 className="text-xl font-semibold text-white mb-6">Recent Progress</h3>

          <div className="space-y-4">
            {errorStats && errorStats.last_errors && errorStats.last_errors.length > 0 ? (
              <>
                <p className="text-white/60 mb-4">
                  You've logged <span className="text-white font-semibold">{totalErrors}</span> errors and created{" "}
                  <span className="text-white font-semibold">{totalCards}</span> SRS cards to help you improve.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(errorStats.errors_by_type || {})
                    .sort(([, a], [, b]) => (b as number) - (a as number))
                    .slice(0, 4)
                    .map(([type, count]) => {
                      const percentage = totalErrors > 0 ? ((count as number / totalErrors) * 100).toFixed(0) : 0;

                      const typeLabels: Record<string, string> = {
                        grammar: "Grammar",
                        vocab: "Vocabulary",
                        fluency: "Fluency",
                        structure: "Structure",
                      };

                      const typeIcons: Record<string, string> = {
                        grammar: "📘",
                        vocab: "📖",
                        fluency: "💬",
                        structure: "🏗️",
                      };

                      return (
                        <div key={type} className="p-4 bg-white/[0.05] rounded-xl border border-white/[0.08]">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="text-2xl">{typeIcons[type] || "📌"}</span>
                              <span className="text-white font-medium">{typeLabels[type] || type}</span>
                            </div>
                            <div className="text-right">
                              <div className="text-white font-bold">{count as number}</div>
                              <div className="text-white/40 text-xs">{percentage}%</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🌱</div>
                <p className="text-white/40 text-lg">No progress data yet</p>
                <p className="text-white/30 text-sm mt-2">Start using the tutor to track your progress</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
