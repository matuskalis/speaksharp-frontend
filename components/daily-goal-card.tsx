"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { DailyGoal } from "@/lib/types";
import { Target, Edit2, Check, X } from "lucide-react";

export default function DailyGoalCard() {
  const [loading, setLoading] = useState(true);
  const [goal, setGoal] = useState<DailyGoal | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Edit state
  const [editTargets, setEditTargets] = useState({
    target_study_minutes: 30,
    target_lessons: 1,
    target_reviews: 10,
    target_drills: 2,
  });

  useEffect(() => {
    loadGoal();
  }, []);

  const loadGoal = async () => {
    setLoading(true);
    try {
      const data = await apiClient.getTodayGoal();
      setGoal(data);
      setEditTargets({
        target_study_minutes: data.target_study_minutes,
        target_lessons: data.target_lessons,
        target_reviews: data.target_reviews,
        target_drills: data.target_drills,
      });
    } catch (error) {
      console.error("Failed to load daily goal:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTargets = async () => {
    try {
      const updatedGoal = await apiClient.updateTodayGoal(editTargets);
      setGoal(updatedGoal);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update goals:", error);
    }
  };

  const handleCancelEdit = () => {
    if (goal) {
      setEditTargets({
        target_study_minutes: goal.target_study_minutes,
        target_lessons: goal.target_lessons,
        target_reviews: goal.target_reviews,
        target_drills: goal.target_drills,
      });
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] p-7">
        <div className="text-white/60 text-center">Loading daily goals...</div>
      </div>
    );
  }

  if (!goal) {
    return null;
  }

  const metrics = [
    {
      label: "Study Time",
      icon: "⏱️",
      actual: goal.actual_study_minutes,
      target: isEditing ? editTargets.target_study_minutes : goal.target_study_minutes,
      unit: "min",
      key: "target_study_minutes" as const,
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: "Lessons",
      icon: "📚",
      actual: goal.actual_lessons,
      target: isEditing ? editTargets.target_lessons : goal.target_lessons,
      unit: "",
      key: "target_lessons" as const,
      color: "from-purple-500 to-pink-500",
    },
    {
      label: "Reviews",
      icon: "🔄",
      actual: goal.actual_reviews,
      target: isEditing ? editTargets.target_reviews : goal.target_reviews,
      unit: "",
      key: "target_reviews" as const,
      color: "from-orange-500 to-red-500",
    },
    {
      label: "Drills",
      icon: "💪",
      actual: goal.actual_drills,
      target: isEditing ? editTargets.target_drills : goal.target_drills,
      unit: "",
      key: "target_drills" as const,
      color: "from-green-500 to-teal-500",
    },
  ];

  const isCompleted = goal.completed;
  const completionPercentage = Math.round(goal.completion_percentage);

  return (
    <div className={`bg-white/[0.03] backdrop-blur-md rounded-2xl border shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] p-7 transition-all duration-300 ${
      isCompleted ? "border-green-500/30" : "border-white/[0.08]"
    }`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Target className="w-6 h-6 text-indigo-400" />
          <h3 className="text-xl font-semibold text-white">Today's Goals</h3>
          {isCompleted && (
            <span className="px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-green-300 text-sm font-medium">
              ✓ Completed
            </span>
          )}
        </div>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.08] text-white/70 hover:text-white transition-all"
          >
            <Edit2 className="w-4 h-4" />
            <span className="text-sm">Edit</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveTargets}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-300 transition-all"
            >
              <Check className="w-4 h-4" />
              <span className="text-sm">Save</span>
            </button>
            <button
              onClick={handleCancelEdit}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.08] text-white/70 hover:text-white transition-all"
            >
              <X className="w-4 h-4" />
              <span className="text-sm">Cancel</span>
            </button>
          </div>
        )}
      </div>

      {/* Overall Progress */}
      <div className="mb-6 p-4 bg-white/[0.05] rounded-xl border border-white/[0.08]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-white/80">Overall Progress</span>
          <span className="text-lg font-bold text-white">{completionPercentage}%</span>
        </div>
        <div className="w-full bg-white/[0.08] rounded-full h-3 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isCompleted
                ? "bg-gradient-to-r from-green-500 to-teal-500"
                : "bg-gradient-to-r from-indigo-500 to-purple-500"
            }`}
            style={{ width: `${Math.min(completionPercentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Individual Metrics */}
      <div className="space-y-4">
        {metrics.map((metric) => {
          const percentage = metric.target > 0 ? Math.min((metric.actual / metric.target) * 100, 100) : 0;

          return (
            <div key={metric.label} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{metric.icon}</span>
                  <span className="text-sm font-medium text-white/80">{metric.label}</span>
                </div>

                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/60">Target:</span>
                    <input
                      type="number"
                      min="0"
                      value={editTargets[metric.key]}
                      onChange={(e) => setEditTargets({
                        ...editTargets,
                        [metric.key]: parseInt(e.target.value) || 0,
                      })}
                      className="w-16 px-2 py-1 bg-white/[0.08] border border-white/[0.12] rounded text-white text-sm text-center focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                    <span className="text-xs text-white/60">{metric.unit}</span>
                  </div>
                ) : (
                  <span className="text-sm text-white/60">
                    {metric.actual} / {metric.target} {metric.unit}
                  </span>
                )}
              </div>

              <div className="w-full bg-white/[0.08] rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${metric.color} transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Motivational Message */}
      {!isCompleted && completionPercentage >= 75 && (
        <div className="mt-6 p-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl text-center">
          <p className="text-sm text-white/80">
            🌟 You're almost there! Keep going!
          </p>
        </div>
      )}

      {isCompleted && (
        <div className="mt-6 p-4 bg-gradient-to-r from-green-500/10 to-teal-500/10 border border-green-500/20 rounded-xl text-center">
          <p className="text-sm text-white/80">
            🎉 Congratulations! You've completed all your goals for today!
          </p>
        </div>
      )}
    </div>
  );
}
