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
      <div className="bg-white border border-gray-200 rounded-xl p-8">
        <h3 className="text-3xl font-semibold text-gray-900 mb-6">Session Summary</h3>
        <p className="text-base text-gray-600">
          Sign in to track your progress and see your session summary.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-8">
        <h3 className="text-3xl font-semibold text-gray-900 mb-6">Session Summary</h3>
        <div className="text-gray-500 text-sm">Loading your stats...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-8">
        <h3 className="text-3xl font-semibold text-gray-900 mb-6">Session Summary</h3>
        <div className="text-red-600 text-sm">{error}</div>
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
    <div className="bg-white border border-gray-200 rounded-xl p-8">
      <h3 className="text-3xl font-semibold text-gray-900 mb-6">Session Summary</h3>

      {/* Encouragement Message */}
      <div className="mb-6 p-8 bg-white border border-gray-200 rounded-xl">
        <p className="text-base text-gray-900">{getTodayMessage()}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* SRS Stats */}
        <div className="p-8 bg-white border border-gray-200 rounded-xl">
          <div className="text-sm text-gray-600 mb-1">Cards Reviewed</div>
          <div className="text-3xl font-bold text-gray-900">{srsStats?.reviewed_today || 0}</div>
          <div className="text-sm text-gray-500 mt-1">
            {srsStats?.due_today || 0} due today
          </div>
        </div>

        <div className="p-8 bg-white border border-gray-200 rounded-xl">
          <div className="text-sm text-gray-600 mb-1">Success Rate</div>
          <div className="text-3xl font-bold text-gray-900">
            {srsStats?.success_rate_today ? `${Math.round(srsStats.success_rate_today)}%` : "—"}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {srsStats?.total_cards || 0} total cards
          </div>
        </div>

        <div className="p-8 bg-white border border-gray-200 rounded-xl">
          <div className="text-sm text-gray-600 mb-1">Errors Corrected</div>
          <div className="text-3xl font-bold text-gray-900">{errorStats?.total_errors || 0}</div>
          <div className="text-sm text-gray-500 mt-1">All time</div>
        </div>

        <div className="p-8 bg-white border border-gray-200 rounded-xl">
          <div className="text-sm text-gray-600 mb-1">Most Common</div>
          <div className="text-base font-semibold text-gray-900">
            {errorStats?.errors_by_type && Object.keys(errorStats.errors_by_type).length > 0
              ? errorTypeLabels[
                  Object.entries(errorStats.errors_by_type).sort((a, b) => b[1] - a[1])[0][0]
                ] || "—"
              : "—"}
          </div>
          <div className="text-sm text-gray-500 mt-1">Error type</div>
        </div>
      </div>

      {/* Areas to Focus */}
      {weakSkills && weakSkills.skills.length > 0 && (
        <div className="mb-6">
          <h4 className="text-base font-semibold text-gray-900 mb-6">Areas to Focus On</h4>
          <div className="space-y-6">
            {weakSkills.skills.map((skill, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-8 bg-white border border-gray-200 rounded-lg"
              >
                <div className="flex-1">
                  <div className="text-base text-gray-900 font-medium capitalize">
                    {skill.skill_key.replace(/_/g, " ")}
                  </div>
                  <div className="text-sm text-gray-500">
                    {skill.skill_category} • {skill.error_count} errors
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-sm text-gray-600">Mastery</div>
                  <div className="text-base font-bold text-gray-900">
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
          <h4 className="text-base font-semibold text-gray-900 mb-6">Recent Corrections</h4>
          <div className="space-y-6">
            {errorStats.last_errors.slice(0, 3).map((error, idx) => (
              <div
                key={idx}
                className="p-8 bg-white border border-gray-200 rounded-lg text-sm"
              >
                <div className="flex items-start justify-between mb-1">
                  <span className="text-gray-500 line-through">{error.before_text}</span>
                  <span className="ml-2 text-gray-400 text-xs uppercase">
                    {errorTypeLabels[error.type] || error.type}
                  </span>
                </div>
                <div className="text-gray-900 mb-1">→ {error.after_text}</div>
                <div className="text-gray-500 text-xs italic">{error.explanation}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No activity message */}
      {(!errorStats || errorStats.total_errors === 0) &&
        (!srsStats || srsStats.reviewed_today === 0) && (
          <div className="text-center py-6">
            <div className="text-gray-500 text-sm mb-6">No activity yet today</div>
            <p className="text-base text-gray-600">
              Start practicing with scenarios, drills, or reviews to see your progress here!
            </p>
          </div>
        )}
    </div>
  );
}
