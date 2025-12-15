"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { apiClient } from "@/lib/api-client";

interface BestStudyHour {
  hour: number;
  avg_score: number;
  sessions: number;
}

interface DayPerformance {
  day: string;
  avg_score: number;
  total_xp: number;
  sessions: number;
}

interface ErrorTrend {
  error_type: string;
  count: number;
  recent_count: number;
  trend: string;
}

interface SkillProgress {
  skill_key: string;
  mastery_score: number;
  practice_count: number;
  last_practiced: string | null;
}

interface InsightsData {
  best_study_hours: BestStudyHour[];
  day_performance: DayPerformance[];
  error_trends: ErrorTrend[];
  skill_progress: SkillProgress[];
  streak: { current: number; longest: number };
  totals: {
    total_lessons: number;
    total_xp: number;
    total_time_minutes: number;
    avg_score: number;
  };
}

export function LearningInsights() {
  const [data, setData] = useState<InsightsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    try {
      const response = await apiClient.getLearningInsights();
      setData({
        best_study_hours: response.best_study_hours || [],
        day_performance: response.day_performance || [],
        error_trends: response.error_trends || [],
        skill_progress: response.skill_progress || [],
        streak: response.streak || { current: 0, longest: 0 },
        totals: response.totals || { total_lessons: 0, total_xp: 0, total_time_minutes: 0, avg_score: 0 },
      });
    } catch (err) {
      console.error("Failed to load insights:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatHour = (hour: number) => {
    if (hour === 0) return "12 AM";
    if (hour === 12) return "12 PM";
    if (hour < 12) return `${hour} AM`;
    return `${hour - 12} PM`;
  };

  const formatMinutes = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/[0.08] p-7">
          <div className="h-32 flex items-center justify-center">
            <div className="text-white/40">Loading insights...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  // Find the best hour
  const bestHour = data.best_study_hours.length > 0
    ? data.best_study_hours.reduce((best, h) => (h.avg_score > best.avg_score ? h : best))
    : null;

  // Find the best day
  const bestDay = data.day_performance.length > 0
    ? data.day_performance.reduce((best, d) => (d.avg_score > best.avg_score ? d : best))
    : null;

  const dayOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] p-7">
        <h3 className="text-xl font-semibold text-white mb-6">Learning Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-white/[0.03] rounded-xl border border-white/[0.08]">
            <div className="text-3xl font-bold text-blue-400">{data.totals.total_lessons}</div>
            <div className="text-sm text-white/50">Total Lessons</div>
          </div>
          <div className="text-center p-4 bg-white/[0.03] rounded-xl border border-white/[0.08]">
            <div className="text-3xl font-bold text-emerald-400">{data.totals.total_xp.toLocaleString()}</div>
            <div className="text-sm text-white/50">Total XP</div>
          </div>
          <div className="text-center p-4 bg-white/[0.03] rounded-xl border border-white/[0.08]">
            <div className="text-3xl font-bold text-purple-400">{formatMinutes(data.totals.total_time_minutes)}</div>
            <div className="text-sm text-white/50">Study Time</div>
          </div>
          <div className="text-center p-4 bg-white/[0.03] rounded-xl border border-white/[0.08]">
            <div className="text-3xl font-bold text-orange-400">{data.totals.avg_score.toFixed(0)}%</div>
            <div className="text-sm text-white/50">Avg Score</div>
          </div>
        </div>
      </div>

      {/* Best Study Times */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Best Hours */}
        <div className="bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] p-7">
          <h3 className="text-xl font-semibold text-white mb-4">Best Study Hours</h3>
          {bestHour && (
            <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
              <div className="flex items-center gap-2">
                <span className="text-2xl">⏰</span>
                <div>
                  <div className="text-emerald-400 font-semibold">Peak Performance</div>
                  <div className="text-white/70 text-sm">
                    You perform best at <span className="text-white font-medium">{formatHour(bestHour.hour)}</span> with{" "}
                    <span className="text-white font-medium">{bestHour.avg_score.toFixed(0)}%</span> avg score
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="space-y-2">
            {data.best_study_hours.slice(0, 6).map((hour) => (
              <div key={hour.hour} className="flex items-center gap-3">
                <div className="w-14 text-sm text-white/50">{formatHour(hour.hour)}</div>
                <div className="flex-1 h-6 bg-white/[0.03] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${hour.avg_score}%` }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="h-full bg-gradient-to-r from-blue-500/50 to-blue-400/70 rounded-full"
                  />
                </div>
                <div className="w-12 text-sm text-white/70 text-right">{hour.avg_score.toFixed(0)}%</div>
              </div>
            ))}
          </div>
          {data.best_study_hours.length === 0 && (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">📊</div>
              <div className="text-white/40">Not enough data yet</div>
            </div>
          )}
        </div>

        {/* Day Performance */}
        <div className="bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] p-7">
          <h3 className="text-xl font-semibold text-white mb-4">Day Performance</h3>
          {bestDay && (
            <div className="mb-4 p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📅</span>
                <div>
                  <div className="text-purple-400 font-semibold">Best Day</div>
                  <div className="text-white/70 text-sm">
                    <span className="text-white font-medium">{bestDay.day}</span> is your strongest day with{" "}
                    <span className="text-white font-medium">{bestDay.avg_score.toFixed(0)}%</span> avg score
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="space-y-2">
            {dayOrder.map((dayName) => {
              const day = data.day_performance.find((d) => d.day === dayName);
              const score = day?.avg_score || 0;
              const sessions = day?.sessions || 0;
              return (
                <div key={dayName} className="flex items-center gap-3">
                  <div className="w-10 text-sm text-white/50">{dayName}</div>
                  <div className="flex-1 h-6 bg-white/[0.03] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${score}%` }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className="h-full bg-gradient-to-r from-purple-500/50 to-purple-400/70 rounded-full"
                    />
                  </div>
                  <div className="w-16 text-sm text-white/50 text-right">{sessions > 0 ? `${score.toFixed(0)}%` : "-"}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Streak Info */}
      <div className="bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] p-7">
        <h3 className="text-xl font-semibold text-white mb-4">Streak Progress</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-xl border border-orange-500/20">
            <div className="text-5xl mb-2">🔥</div>
            <div className="text-4xl font-bold text-orange-400">{data.streak.current}</div>
            <div className="text-sm text-white/50 mt-1">Current Streak</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-xl border border-yellow-500/20">
            <div className="text-5xl mb-2">🏆</div>
            <div className="text-4xl font-bold text-yellow-400">{data.streak.longest}</div>
            <div className="text-sm text-white/50 mt-1">Longest Streak</div>
          </div>
        </div>
      </div>

      {/* Error Trends */}
      {data.error_trends.length > 0 && (
        <div className="bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] p-7">
          <h3 className="text-xl font-semibold text-white mb-4">Error Patterns</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.error_trends.slice(0, 4).map((error) => {
              const trendIcon = error.trend === "improving" ? "📈" : error.trend === "worsening" ? "📉" : "➡️";
              const trendColor = error.trend === "improving" ? "text-emerald-400" : error.trend === "worsening" ? "text-red-400" : "text-white/50";
              const trendBg = error.trend === "improving" ? "bg-emerald-500/10 border-emerald-500/20" : error.trend === "worsening" ? "bg-red-500/10 border-red-500/20" : "bg-white/[0.03] border-white/[0.08]";

              return (
                <div key={error.error_type} className={`p-4 rounded-xl border ${trendBg}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium capitalize">{error.error_type}</span>
                    <span className="text-xl">{trendIcon}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/50">Total: {error.count}</span>
                    <span className={trendColor}>
                      Recent: {error.recent_count} ({error.trend})
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Skill Progress */}
      {data.skill_progress.length > 0 && (
        <div className="bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] p-7">
          <h3 className="text-xl font-semibold text-white mb-4">Skill Progress</h3>
          <div className="space-y-4">
            {data.skill_progress.slice(0, 5).map((skill) => (
              <div key={skill.skill_key}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">{skill.skill_key}</span>
                  <span className="text-white/50 text-sm">{skill.mastery_score.toFixed(0)}% mastery</span>
                </div>
                <div className="h-3 bg-white/[0.03] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.mastery_score}%` }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className={`h-full rounded-full ${
                      skill.mastery_score >= 80
                        ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
                        : skill.mastery_score >= 50
                        ? "bg-gradient-to-r from-blue-500 to-blue-400"
                        : "bg-gradient-to-r from-orange-500 to-yellow-400"
                    }`}
                  />
                </div>
                <div className="flex items-center justify-between mt-1 text-xs text-white/40">
                  <span>Practiced {skill.practice_count} times</span>
                  {skill.last_practiced && (
                    <span>Last: {new Date(skill.last_practiced).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
