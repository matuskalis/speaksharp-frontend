"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import { ErrorStatsResponse, SrsStatsResponse, WeakSkillsResponse, StreakResponse, UserProfileResponse } from "@/lib/types";
import SessionSummary from "./SessionSummary";
import DailyGoalCard from "@/components/daily-goal-card";
import { CheckCircle2, Circle, X, BookOpen, Target, FolderOpen, Flame } from "lucide-react";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [errorStats, setErrorStats] = useState<ErrorStatsResponse | null>(null);
  const [srsStats, setSrsStats] = useState<SrsStatsResponse | null>(null);
  const [weakSkills, setWeakSkills] = useState<WeakSkillsResponse | null>(null);
  const [streak, setStreak] = useState<StreakResponse | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfileResponse | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [errors, srs, skills, streakData, profile] = await Promise.all([
        apiClient.getErrorStats(),
        apiClient.getSrsStats(),
        apiClient.getWeakSkills(3),
        apiClient.getStreak().catch(() => ({ current_streak: 0, longest_streak: 0, last_active_date: null })),
        apiClient.getCurrentUser().catch(() => null),
      ]);

      setErrorStats(errors);
      setSrsStats(srs);
      setWeakSkills(skills);
      setStreak(streakData);
      setUserProfile(profile);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-container mx-auto px-8 text-center">
        <div className="text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-container mx-auto px-8">
        <div className="p-8 bg-white border border-gray-200 rounded-xl text-red-600">
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

  // Check if onboarding is complete
  const isOnboardingComplete = (userProfile as any)?.onboarding_completed === true;
  const hasCompletedPlacementTest = userProfile?.level && userProfile.level !== "A1";
  const hasCompletedProfile = !!(userProfile as any)?.full_name && !!(userProfile as any)?.country;
  const hasCompletedFirstLesson = (srsStats?.total_cards || 0) > 0;

  const handleCompleteOnboarding = async () => {
    try {
      await apiClient.updateProfile({ onboarding_completed: true } as any);
      setShowOnboarding(false);
    } catch (error) {
      console.error("Failed to mark onboarding as complete:", error);
    }
  };

  return (
    <div className="max-w-container mx-auto px-8">
      {/* Onboarding Checklist */}
      {!isOnboardingComplete && showOnboarding && (
        <div className="bg-white border border-gray-200 rounded-xl p-8 mb-20">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-3xl font-semibold text-gray-900 mb-2">Welcome to SpeakSharp!</h3>
              <p className="text-base text-gray-600">Complete these steps to get started:</p>
            </div>
            <button
              onClick={() => setShowOnboarding(false)}
              className="text-gray-500 hover:text-gray-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Placement Test */}
            <Link
              href="/placement-test"
              className={`flex items-center gap-3 p-8 rounded-xl border transition-all duration-200 ${
                hasCompletedPlacementTest
                  ? "bg-white border-gray-200 cursor-default"
                  : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-md"
              }`}
            >
              {hasCompletedPlacementTest ? (
                <CheckCircle2 className="w-5 h-5 text-gray-900 flex-shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-gray-400 flex-shrink-0" />
              )}
              <div className="flex-1">
                <div className="text-base text-gray-900 font-medium">Take Placement Test</div>
                <div className="text-sm text-gray-600">Find your English level (5 min)</div>
              </div>
            </Link>

            {/* Complete Profile */}
            <Link
              href="/profile"
              className={`flex items-center gap-3 p-8 rounded-xl border transition-all duration-200 ${
                hasCompletedProfile
                  ? "bg-white border-gray-200 cursor-default"
                  : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-md"
              }`}
            >
              {hasCompletedProfile ? (
                <CheckCircle2 className="w-5 h-5 text-gray-900 flex-shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-gray-400 flex-shrink-0" />
              )}
              <div className="flex-1">
                <div className="text-base text-gray-900 font-medium">Complete Your Profile</div>
                <div className="text-sm text-gray-600">Add your name and country</div>
              </div>
            </Link>

            {/* First Lesson */}
            <Link
              href="/lessons"
              className={`flex items-center gap-3 p-8 rounded-xl border transition-all duration-200 ${
                hasCompletedFirstLesson
                  ? "bg-white border-gray-200 cursor-default"
                  : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-md"
              }`}
            >
              {hasCompletedFirstLesson ? (
                <CheckCircle2 className="w-5 h-5 text-gray-900 flex-shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-gray-400 flex-shrink-0" />
              )}
              <div className="flex-1">
                <div className="text-base text-gray-900 font-medium">Complete Your First Lesson</div>
                <div className="text-sm text-gray-600">Start learning with AI-powered lessons</div>
              </div>
            </Link>
          </div>

          {/* Complete Button */}
          {hasCompletedPlacementTest && hasCompletedProfile && hasCompletedFirstLesson && (
            <button
              onClick={handleCompleteOnboarding}
              className="mt-6 w-full px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-all duration-200"
            >
              Complete Onboarding
            </button>
          )}
        </div>
      )}

      {/* Hero Header */}
      <div className="text-center mb-24">
        <div className="flex items-center justify-center gap-4 mb-6">
          <h2 className="text-6xl font-bold text-gray-900">
            Dashboard
          </h2>
          {streak && streak.current_streak > 0 && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-deep-blue-200 rounded-full">
              <Flame className="w-5 h-5 text-deep-blue-600" />
              <span className="text-deep-blue-900 font-bold text-lg">{streak.current_streak}</span>
              <span className="text-charcoal-600 text-sm">day streak</span>
            </div>
          )}
        </div>
        <p className="text-xl text-gray-600">Your learning progress at a glance</p>
      </div>

      {/* Session Summary */}
      <div className="mb-20">
        <SessionSummary />
      </div>

      {/* Today Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        {/* Cards Reviewed */}
        <div className="bg-white border border-gray-200 rounded-xl p-8 hover:border-gray-300 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-medium text-charcoal-600">Cards Reviewed Today</h3>
            <div className="w-10 h-10 rounded-lg bg-deep-blue-50 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-deep-blue-600" strokeWidth={1.5} />
            </div>
          </div>
          <p className="text-6xl font-bold text-charcoal-900 mb-2">{srsStats?.reviewed_today || 0}</p>
          <p className="text-sm text-charcoal-500">
            {srsStats?.due_today || 0} cards due today
          </p>
        </div>

        {/* Accuracy */}
        <div className="bg-white border border-gray-200 rounded-xl p-8 hover:border-gray-300 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-medium text-charcoal-600">Success Rate Today</h3>
            <div className="w-10 h-10 rounded-lg bg-deep-blue-50 flex items-center justify-center">
              <Target className="w-5 h-5 text-deep-blue-600" strokeWidth={1.5} />
            </div>
          </div>
          <p className="text-6xl font-bold text-charcoal-900 mb-2">
            {srsStats?.success_rate_today.toFixed(1) || 0}%
          </p>
          <p className="text-sm text-charcoal-500">
            Quality score ≥ 3
          </p>
        </div>

        {/* Total Cards */}
        <div className="bg-white border border-gray-200 rounded-xl p-8 hover:border-gray-300 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-medium text-charcoal-600">Total SRS Cards</h3>
            <div className="w-10 h-10 rounded-lg bg-deep-blue-50 flex items-center justify-center">
              <FolderOpen className="w-5 h-5 text-deep-blue-600" strokeWidth={1.5} />
            </div>
          </div>
          <p className="text-6xl font-bold text-charcoal-900 mb-2">{srsStats?.total_cards || 0}</p>
          <p className="text-sm text-charcoal-500">
            Errors tracked: {errorStats?.total_errors || 0}
          </p>
        </div>
      </div>

      {/* Daily Goals */}
      <div className="mb-20">
        <DailyGoalCard />
      </div>

      {/* Error Breakdown */}
      <div className="bg-white border border-gray-200 rounded-xl p-8 mb-20">
        <h3 className="text-3xl font-semibold text-gray-900 mb-6">Error Breakdown</h3>

        {errorStats && Object.keys(errorStats.errors_by_type).length > 0 ? (
          <div className="space-y-6">
            {Object.entries(errorStats.errors_by_type)
              .sort(([, a], [, b]) => b - a)
              .map(([type, count]) => {
                const percentage = ((count / errorStats.total_errors) * 100).toFixed(1);
                return (
                  <div key={type}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-medium text-gray-900">
                        {errorTypeLabels[type] || type}
                      </span>
                      <span className="text-sm text-gray-600">
                        {count} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
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
          <p className="text-gray-500 text-center py-6">No errors recorded yet</p>
        )}
      </div>

      {/* Weakest Skills */}
      <div className="bg-white border border-gray-200 rounded-xl p-8 mb-20">
        <h3 className="text-3xl font-semibold text-gray-900 mb-6">Areas to Improve</h3>

        {weakSkills && weakSkills.skills.length > 0 ? (
          <div className="space-y-6">
            {weakSkills.skills.map((skill, index) => (
              <div
                key={skill.skill_key}
                className="p-8 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-base font-semibold text-gray-600">
                        #{index + 1}
                      </span>
                      <h4 className="text-base font-medium text-gray-900">
                        {skill.skill_key}
                      </h4>
                    </div>
                    <p className="text-sm text-gray-500 mb-6">
                      Category: {skill.skill_category}
                    </p>
                    <div className="flex items-center space-x-6 text-sm">
                      <span className="text-gray-600">
                        Mastery: <span className="font-medium text-gray-900">{skill.mastery_score.toFixed(1)}%</span>
                      </span>
                      <span className="text-gray-600">
                        Errors: <span className="font-medium text-red-600">{skill.error_count}</span>
                      </span>
                      <span className="text-gray-600">
                        Practice: <span className="font-medium text-blue-600">{skill.practice_count}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-6">No skill data available yet</p>
        )}
      </div>

      {/* Recent Errors */}
      <div className="bg-white border border-gray-200 rounded-xl p-8">
        <h3 className="text-3xl font-semibold text-gray-900 mb-6">Recent Errors</h3>

        {errorStats && errorStats.last_errors.length > 0 ? (
          <div className="space-y-6">
            {errorStats.last_errors.map((error, index) => (
              <div
                key={index}
                className="p-8 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-6">
                  <span className="inline-block px-3 py-1 text-sm font-medium rounded-lg bg-white text-red-600 border border-gray-200">
                    {errorTypeLabels[error.type] || error.type}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(error.timestamp).toLocaleDateString()} at{" "}
                    {new Date(error.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start space-x-2">
                    <span className="text-red-600 font-medium text-sm mt-1">✗</span>
                    <p className="text-base text-gray-600 line-through flex-1">{error.before_text}</p>
                  </div>

                  <div className="flex items-start space-x-2">
                    <span className="text-green-600 font-medium text-sm mt-1">✓</span>
                    <p className="text-base text-gray-900 font-medium flex-1">{error.after_text}</p>
                  </div>

                  <div className="pl-6 pt-6 border-t border-gray-200">
                    <p className="text-base text-gray-600 italic">{error.explanation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-6">No errors recorded yet</p>
        )}
      </div>
    </div>
  );
}
