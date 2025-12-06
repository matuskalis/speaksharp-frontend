"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apiClient } from "@/lib/api-client";
import { DailyGoal } from "@/lib/types";
import { Target, Edit2, Check, X, Sparkles, Trophy } from "lucide-react";

export default function DailyGoalCard() {
  const [loading, setLoading] = useState(true);
  const [goal, setGoal] = useState<DailyGoal | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [prevCompleted, setPrevCompleted] = useState(false);

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

  // Check if goal was just completed
  useEffect(() => {
    if (goal && goal.completed && !prevCompleted) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
    if (goal) {
      setPrevCompleted(goal.completed);
    }
  }, [goal?.completed]);

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
      <div className="bg-white border border-gray-200 rounded-xl p-8">
        <div className="text-gray-600 text-center">Loading daily goals...</div>
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
    <div className="relative">
      {/* Celebration Animation */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <motion.div
              animate={{
                rotate: [0, 10, -10, 10, 0],
                scale: [1, 1.2, 1.1, 1.2, 1],
              }}
              transition={{ duration: 0.6, repeat: 3 }}
              className="bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500 p-8 rounded-full shadow-2xl"
            >
              <Trophy className="w-16 h-16 text-white" />
            </motion.div>
            <div className="absolute inset-0">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                  animate={{
                    opacity: [1, 1, 0],
                    scale: [0, 1, 1],
                    x: Math.cos((i * Math.PI * 2) / 12) * 100,
                    y: Math.sin((i * Math.PI * 2) / 12) * 100,
                  }}
                  transition={{ duration: 1, delay: i * 0.05 }}
                  className="absolute top-1/2 left-1/2"
                >
                  <Sparkles className="w-6 h-6 text-yellow-400" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-white border rounded-xl p-8 transition-all duration-300 ${
          isCompleted ? "border-green-500/50 shadow-lg shadow-green-500/20" : "border-gray-200 hover:border-gray-300 hover:shadow-md"
        }`}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              isCompleted
                ? "bg-gradient-to-br from-green-500 to-teal-500"
                : "bg-gradient-to-br from-deep-blue-500 to-purple-500"
            }`}>
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Today's Goals</h3>
              {isCompleted && (
                <span className="text-sm text-green-600 font-medium flex items-center gap-1 mt-1">
                  <Check className="w-4 h-4" />
                  All goals completed!
                </span>
              )}
            </div>
          </div>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all"
            >
              <Edit2 className="w-4 h-4" />
              <span className="text-sm font-medium">Edit</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveTargets}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-all"
              >
                <Check className="w-4 h-4" />
                <span className="text-sm font-medium">Save</span>
              </button>
              <button
                onClick={handleCancelEdit}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all"
              >
                <X className="w-4 h-4" />
                <span className="text-sm font-medium">Cancel</span>
              </button>
            </div>
          )}
        </div>

        {/* Circular Progress Ring with Overall Progress */}
        <div className="flex items-center justify-center mb-8">
          <div className="relative w-48 h-48">
            <svg className="transform -rotate-90 w-48 h-48">
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                className="text-gray-200"
              />
              <motion.circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 88}
                initial={{ strokeDashoffset: 2 * Math.PI * 88 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 88 * (1 - completionPercentage / 100) }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={isCompleted
                  ? "text-green-500"
                  : "text-deep-blue-600"
                }
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-bold text-gray-900">{completionPercentage}%</span>
              <span className="text-sm text-gray-600 mt-1">Complete</span>
            </div>
          </div>
        </div>

        {/* Individual Metrics */}
        <div className="space-y-6">
          {metrics.map((metric, index) => {
            const percentage = metric.target > 0 ? Math.min((metric.actual / metric.target) * 100, 100) : 0;
            const isMetricComplete = percentage >= 100;

            return (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{metric.icon}</span>
                    <span className="text-base font-medium text-gray-900">{metric.label}</span>
                    {isMetricComplete && (
                      <span className="text-green-600">
                        <Check className="w-4 h-4" />
                      </span>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Target:</span>
                      <input
                        type="number"
                        min="0"
                        value={editTargets[metric.key]}
                        onChange={(e) => setEditTargets({
                          ...editTargets,
                          [metric.key]: parseInt(e.target.value) || 0,
                        })}
                        className="w-20 px-3 py-1 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm text-center focus:outline-none focus:ring-2 focus:ring-deep-blue-500 focus:border-transparent"
                      />
                      <span className="text-sm text-gray-600">{metric.unit}</span>
                    </div>
                  ) : (
                    <span className="text-sm font-medium text-gray-700">
                      {metric.actual} / {metric.target} {metric.unit}
                    </span>
                  )}
                </div>

                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 + 0.2 }}
                    className={`h-full rounded-full bg-gradient-to-r ${metric.color}`}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Motivational Messages */}
        <AnimatePresence>
          {!isCompleted && completionPercentage >= 75 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl text-center"
            >
              <p className="text-base text-blue-900 font-medium">
                🌟 You're almost there! Keep going!
              </p>
            </motion.div>
          )}

          {isCompleted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-8 p-6 bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-xl text-center"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <Trophy className="w-6 h-6 text-green-600" />
                <p className="text-lg text-green-900 font-bold">
                  Congratulations!
                </p>
              </div>
              <p className="text-sm text-green-700">
                You've completed all your goals for today! 🎉
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
