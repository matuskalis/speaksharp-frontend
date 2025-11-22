"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { ErrorStatsResponse, SrsStatsResponse, WeakSkillsResponse } from "@/lib/types";
import { useAuth } from "@/contexts/AuthContext";

export default function SessionSummary() {
  const { user } = useAuth();
  const [errorStats, setErrorStats] = useState<ErrorStatsResponse | null>(null);
  const [srsStats, setSrsStats] = useState<SrsStatsResponse | null>(null);
  const [weakSkills, setWeakSkills] = useState<WeakSkillsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadStats();
    }
  }, [user]);

  const loadStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const [errors, srs, skills] = await Promise.all([
        apiClient.getErrorStats(),
        apiClient.getSrsStats(),
        apiClient.getWeakSkills(3),
      ]);
      setErrorStats(errors);
      setSrsStats(srs);
      setWeakSkills(skills);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load stats");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] p-7">
        <h3 className="text-xl font-bold text-white mb-3">📊 Session Summary</h3>
        <p className="text-white/60 text-sm">
          Sign in to track your progress and see your session summary.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] p-7">
        <h3 className="text-xl font-bold text-white mb-3">📊 Session Summary</h3>
        <div className="text-white/50 text-sm">Loading your stats...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] p-7">
        <h3 className="text-xl font-bold text-white mb-3">📊 Session Summary</h3>
        <div className="text-red-400 text-sm">{error}</div>
      </div>
    );
  }

  const getTodayMessage = () => {
    if (!srsStats || !errorStats) return "Keep practicing!";

    const reviewedCards = srsStats.reviewed_today;
    const totalErrors = errorStats.total_errors;

    if (reviewedCards > 0 && totalErrors > 0) {
      return "Great work today! You're actively learning and improving.";
    } else if (reviewedCards > 0) {
      return "Nice job on your reviews today!";
    } else if (totalErrors > 0) {
      return "Good practice session! Every correction makes you stronger.";
    }
    return "Ready to start learning? Try a scenario or drill!";
  };

  const errorTypeLabels: Record<string, string> = {
    grammar: "Grammar",
    vocab: "Vocabulary",
    fluency: "Fluency",
    structure: "Structure",
    pronunciation_placeholder: "Pronunciation",
  };

  return (
    <div className="bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] p-7">
      <h3 className="text-xl font-bold text-white mb-5">📊 Session Summary</h3>

      {/* Encouragement Message */}
      <div className="mb-6 p-4 bg-gradient-to-r from-indigo-500/10 to-rose-500/10 border border-indigo-500/20 rounded-xl">
        <p className="text-white/90 text-sm">{getTodayMessage()}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* SRS Stats */}
        <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
          <div className="text-blue-300 text-xs font-medium mb-1">Cards Reviewed</div>
          <div className="text-2xl font-bold text-white">{srsStats?.reviewed_today || 0}</div>
          <div className="text-xs text-white/50 mt-1">
            {srsStats?.due_today || 0} due today
          </div>
        </div>

        <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-xl">
          <div className="text-green-300 text-xs font-medium mb-1">Success Rate</div>
          <div className="text-2xl font-bold text-white">
            {srsStats?.success_rate_today ? `${Math.round(srsStats.success_rate_today)}%` : "—"}
          </div>
          <div className="text-xs text-white/50 mt-1">
            {srsStats?.total_cards || 0} total cards
          </div>
        </div>

        <div className="p-4 bg-purple-500/5 border border-purple-500/20 rounded-xl">
          <div className="text-purple-300 text-xs font-medium mb-1">Errors Corrected</div>
          <div className="text-2xl font-bold text-white">{errorStats?.total_errors || 0}</div>
          <div className="text-xs text-white/50 mt-1">All time</div>
        </div>

        <div className="p-4 bg-orange-500/5 border border-orange-500/20 rounded-xl">
          <div className="text-orange-300 text-xs font-medium mb-1">Most Common</div>
          <div className="text-sm font-semibold text-white">
            {errorStats?.errors_by_type && Object.keys(errorStats.errors_by_type).length > 0
              ? errorTypeLabels[
                  Object.entries(errorStats.errors_by_type).sort((a, b) => b[1] - a[1])[0][0]
                ] || "—"
              : "—"}
          </div>
          <div className="text-xs text-white/50 mt-1">Error type</div>
        </div>
      </div>

      {/* Areas to Focus */}
      {weakSkills && weakSkills.skills.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-white/80 mb-3">🎯 Areas to Focus On</h4>
          <div className="space-y-2">
            {weakSkills.skills.map((skill, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-white/[0.03] border border-white/[0.08] rounded-lg"
              >
                <div className="flex-1">
                  <div className="text-sm text-white font-medium capitalize">
                    {skill.skill_key.replace(/_/g, " ")}
                  </div>
                  <div className="text-xs text-white/50">
                    {skill.skill_category} • {skill.error_count} errors
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-xs text-white/60">Mastery</div>
                  <div className="text-sm font-bold text-white">
                    {Math.round(skill.mastery_score * 100)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Errors Preview */}
      {errorStats && errorStats.last_errors.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-white/80 mb-3">🔄 Recent Corrections</h4>
          <div className="space-y-2">
            {errorStats.last_errors.slice(0, 3).map((error, idx) => (
              <div
                key={idx}
                className="p-3 bg-white/[0.03] border border-white/[0.08] rounded-lg text-xs"
              >
                <div className="flex items-start justify-between mb-1">
                  <span className="text-white/40 line-through">{error.before_text}</span>
                  <span className="ml-2 text-white/30 text-[10px] uppercase">
                    {errorTypeLabels[error.type] || error.type}
                  </span>
                </div>
                <div className="text-white/80 mb-1">→ {error.after_text}</div>
                <div className="text-white/50 text-[10px] italic">{error.explanation}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No activity message */}
      {(!errorStats || errorStats.total_errors === 0) &&
        (!srsStats || srsStats.reviewed_today === 0) && (
          <div className="text-center py-6">
            <div className="text-white/40 text-sm mb-3">No activity yet today</div>
            <p className="text-white/60 text-xs">
              Start practicing with scenarios, drills, or reviews to see your progress here!
            </p>
          </div>
        )}
    </div>
  );
}
