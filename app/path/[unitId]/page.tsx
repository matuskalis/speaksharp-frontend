"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { MobileAppShell } from "@/components/mobile-app-shell";
import { apiClient } from "@/lib/api-client";
import { LearningUnit, LearningLesson } from "@/lib/types";
import {
  ArrowLeft,
  Lock,
  CheckCircle2,
  PlayCircle,
  Clock,
  Zap,
  Star,
} from "lucide-react";

export default function UnitDetailPage() {
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile();
  const router = useRouter();
  const params = useParams();
  const unitId = params.unitId as string;

  const [unit, setUnit] = useState<LearningUnit | null>(null);
  const [lessons, setLessons] = useState<LearningLesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profileLoading && !user) {
      router.push("/get-started");
    }
  }, [user, profileLoading, router]);

  useEffect(() => {
    if (profile && user && unitId) {
      const fetchUnit = async () => {
        try {
          setLoading(true);
          const data = await apiClient.getLearningPathUnit(unitId);
          setUnit(data.unit);
          setLessons(data.lessons);
        } catch (err) {
          console.error("Failed to fetch unit:", err);
          router.push("/path");
        } finally {
          setLoading(false);
        }
      };
      fetchUnit();
    }
  }, [profile, user, unitId, router]);

  if (profileLoading || loading) {
    return (
      <MobileAppShell>
        <div className="p-4 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-dark-200 rounded-xl animate-pulse" />
            <div className="h-6 bg-dark-200 rounded w-1/3 animate-pulse" />
          </div>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass rounded-2xl p-5 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-dark-300 rounded-xl" />
                <div className="flex-1">
                  <div className="h-5 bg-dark-200 rounded w-2/3 mb-2" />
                  <div className="h-4 bg-dark-300 rounded w-1/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </MobileAppShell>
    );
  }

  if (!user || !profile || !unit) {
    return null;
  }

  const unitColors: Record<string, { bg: string; light: string }> = {
    purple: { bg: "from-purple-500 to-pink-500", light: "bg-purple-500/20" },
    blue: { bg: "from-blue-500 to-cyan-500", light: "bg-blue-500/20" },
    green: { bg: "from-green-500 to-emerald-500", light: "bg-green-500/20" },
    orange: { bg: "from-orange-500 to-amber-500", light: "bg-orange-500/20" },
  };

  const colorKey = unit.color || "purple";
  const colors = unitColors[colorKey] || unitColors.purple;

  return (
    <MobileAppShell>
      <div className="min-h-screen bg-dark">
        {/* Header */}
        <div className="relative overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} opacity-10`} />

          <div className="relative px-4 pt-4 pb-6">
            {/* Back Button */}
            <Link
              href="/path"
              className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back to Path</span>
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${colors.bg} flex items-center justify-center shadow-btn-glow`}
                >
                  <span className="text-3xl">{unit.icon || "book"}</span>
                </div>
                <div>
                  <span className="text-xs font-medium text-text-muted uppercase tracking-wide">
                    {unit.level} - Unit {unit.unit_number}
                  </span>
                  <h1 className="text-2xl font-bold text-text-primary">
                    {unit.title}
                  </h1>
                </div>
              </div>

              {unit.description && (
                <p className="text-text-secondary mt-3">{unit.description}</p>
              )}

              {/* Progress Stats */}
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <span className="text-sm text-text-secondary">
                    {unit.completed_lessons}/{unit.lesson_count} lessons
                  </span>
                </div>
                {unit.estimated_time_minutes && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-text-muted" />
                    <span className="text-sm text-text-secondary">
                      ~{unit.estimated_time_minutes} min
                    </span>
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              <div className="mt-4 h-2 bg-dark-300 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${unit.progress_percentage}%` }}
                  transition={{ duration: 0.5 }}
                  className={`h-full bg-gradient-to-r ${colors.bg} rounded-full`}
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Lessons List */}
        <div className="px-4 pb-8">
          <h2 className="font-bold text-text-primary text-lg mb-4">Lessons</h2>

          <div className="space-y-3">
            {lessons.map((lesson, index) => (
              <LessonCard
                key={lesson.lesson_id}
                lesson={lesson}
                index={index}
                colors={colors}
              />
            ))}
          </div>

          {lessons.length === 0 && (
            <div className="text-center py-12">
              <p className="text-text-secondary">No lessons available yet</p>
            </div>
          )}
        </div>
      </div>
    </MobileAppShell>
  );
}

function LessonCard({
  lesson,
  index,
  colors,
}: {
  lesson: LearningLesson;
  index: number;
  colors: { bg: string; light: string };
}) {
  const isLocked = lesson.is_locked;
  const isComplete = lesson.is_completed;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link
        href={isLocked ? "#" : `/path/lesson/${lesson.lesson_id}`}
        className={isLocked ? "cursor-not-allowed" : "cursor-pointer"}
      >
        <div
          className={`glass rounded-2xl p-4 transition-all duration-300 ${
            isLocked
              ? "opacity-50"
              : "hover:bg-dark-200/50 hover:scale-[1.01]"
          }`}
        >
          <div className="flex items-center gap-4">
            {/* Lesson Number/Icon */}
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                isLocked
                  ? "bg-dark-300"
                  : isComplete
                  ? "bg-success"
                  : colors.light
              }`}
            >
              {isLocked ? (
                <Lock className="w-5 h-5 text-text-muted" />
              ) : isComplete ? (
                <CheckCircle2 className="w-6 h-6 text-white" />
              ) : (
                <PlayCircle className="w-6 h-6 text-accent-purple" />
              )}
            </div>

            {/* Lesson Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs font-medium text-text-muted">
                  Lesson {lesson.lesson_number}
                </span>
                {isComplete && lesson.best_score && lesson.best_score >= 90 && (
                  <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                )}
              </div>
              <h3 className="font-semibold text-text-primary truncate">
                {lesson.title}
              </h3>
              {lesson.description && (
                <p className="text-text-secondary text-sm truncate">
                  {lesson.description}
                </p>
              )}
            </div>

            {/* XP Reward & Stats */}
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-1 text-yellow-400">
                <Zap className="w-4 h-4" />
                <span className="text-sm font-bold">{lesson.xp_reward}</span>
              </div>
              {isComplete && lesson.best_score !== null && (
                <span className="text-xs text-text-muted">
                  Best: {lesson.best_score}%
                </span>
              )}
              {lesson.estimated_time_minutes && !isComplete && (
                <span className="text-xs text-text-muted">
                  {lesson.estimated_time_minutes} min
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
