"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { MobileAppShell } from "@/components/mobile-app-shell";
import { apiClient } from "@/lib/api-client";
import { LearningUnit } from "@/lib/types";
import {
  Lock,
  CheckCircle2,
  ChevronRight,
  BookOpen,
  Star,
  Trophy,
} from "lucide-react";

export default function LearningPathPage() {
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile();
  const router = useRouter();
  const [units, setUnits] = useState<LearningUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLevel, setUserLevel] = useState("A1");

  useEffect(() => {
    if (!profileLoading && !user) {
      router.push("/get-started");
    }
  }, [user, profileLoading, router]);

  useEffect(() => {
    if (profile && user) {
      const fetchUnits = async () => {
        try {
          setLoading(true);
          const data = await apiClient.getLearningPathUnits();
          setUnits(data.units);
          setUserLevel(data.user_level);
        } catch (err) {
          console.error("Failed to fetch learning path:", err);
          // Seed if no data exists
          try {
            await apiClient.seedLearningPath();
            const data = await apiClient.getLearningPathUnits();
            setUnits(data.units);
            setUserLevel(data.user_level);
          } catch (seedErr) {
            console.error("Failed to seed learning path:", seedErr);
          }
        } finally {
          setLoading(false);
        }
      };
      fetchUnits();
    }
  }, [profile, user]);

  if (profileLoading || loading) {
    return (
      <MobileAppShell>
        <div className="p-4 space-y-6">
          <div className="h-8 bg-dark-200 rounded-lg w-1/2 animate-pulse" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass rounded-2xl p-6 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-dark-300 rounded-2xl" />
                <div className="flex-1">
                  <div className="h-5 bg-dark-200 rounded w-2/3 mb-2" />
                  <div className="h-4 bg-dark-300 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </MobileAppShell>
    );
  }

  if (!user || !profile) {
    return null;
  }

  return (
    <MobileAppShell>
      <div className="min-h-screen bg-dark">
        {/* Header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-gradient-radial from-accent-purple/20 via-transparent to-transparent blur-3xl" />
          </div>

          <div className="relative px-4 pt-6 pb-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-3 mb-1">
                <BookOpen className="w-6 h-6 text-accent-purple" />
                <h1 className="text-2xl font-bold text-text-primary">
                  Learning Path
                </h1>
              </div>
              <p className="text-text-secondary text-sm">
                Master English step by step
              </p>
            </motion.div>

            {/* Level Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gradient-brand rounded-xl shadow-btn-glow"
            >
              <Trophy className="w-4 h-4 text-white" />
              <span className="text-white font-semibold text-sm">
                Current Level: {userLevel}
              </span>
            </motion.div>
          </div>
        </div>

        {/* Units List */}
        <div className="px-4 pb-8">
          <div className="relative">
            {/* Connecting Line */}
            <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-dark-300" />

            <div className="space-y-4">
              {units.map((unit, index) => (
                <UnitCard
                  key={unit.unit_id}
                  unit={unit}
                  index={index}
                  isFirst={index === 0}
                  isLast={index === units.length - 1}
                />
              ))}
            </div>
          </div>

          {units.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <BookOpen className="w-12 h-12 text-text-muted mx-auto mb-4" />
              <p className="text-text-secondary">
                Loading your learning path...
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </MobileAppShell>
  );
}

function UnitCard({
  unit,
  index,
  isFirst,
  isLast,
}: {
  unit: LearningUnit;
  index: number;
  isFirst: boolean;
  isLast: boolean;
}) {
  const isLocked = unit.is_locked;
  const isComplete = unit.is_completed;
  const progress = unit.progress_percentage;

  const unitColors: Record<string, { bg: string; icon: string; glow: string }> = {
    purple: {
      bg: "from-purple-500 to-pink-500",
      icon: "text-purple-400",
      glow: "shadow-[0_0_20px_rgba(168,85,247,0.4)]",
    },
    blue: {
      bg: "from-blue-500 to-cyan-500",
      icon: "text-blue-400",
      glow: "shadow-[0_0_20px_rgba(59,130,246,0.4)]",
    },
    green: {
      bg: "from-green-500 to-emerald-500",
      icon: "text-green-400",
      glow: "shadow-[0_0_20px_rgba(34,197,94,0.4)]",
    },
    orange: {
      bg: "from-orange-500 to-amber-500",
      icon: "text-orange-400",
      glow: "shadow-[0_0_20px_rgba(249,115,22,0.4)]",
    },
  };

  const colorKey = unit.color || ["purple", "blue", "green", "orange"][index % 4];
  const colors = unitColors[colorKey] || unitColors.purple;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative"
    >
      {/* Node on the line */}
      <div
        className={`absolute left-6 top-8 w-4 h-4 rounded-full z-10 ${
          isComplete
            ? "bg-success"
            : isLocked
            ? "bg-dark-300"
            : `bg-gradient-to-r ${colors.bg}`
        }`}
      />

      <Link
        href={isLocked ? "#" : `/path/${unit.unit_id}`}
        className={isLocked ? "cursor-not-allowed" : "cursor-pointer"}
      >
        <div
          className={`ml-12 glass rounded-2xl p-5 transition-all duration-300 ${
            isLocked
              ? "opacity-50"
              : "hover:bg-dark-200/50 hover:scale-[1.02]"
          } ${!isLocked && !isComplete ? colors.glow : ""}`}
        >
          <div className="flex items-center gap-4">
            {/* Unit Icon */}
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                isLocked
                  ? "bg-dark-300"
                  : isComplete
                  ? "bg-success"
                  : `bg-gradient-to-br ${colors.bg}`
              }`}
            >
              {isLocked ? (
                <Lock className="w-6 h-6 text-text-muted" />
              ) : isComplete ? (
                <CheckCircle2 className="w-7 h-7 text-white" />
              ) : (
                <span className="text-2xl">{unit.icon || getUnitIcon(index)}</span>
              )}
            </div>

            {/* Unit Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-text-muted uppercase tracking-wide">
                  {unit.level} - Unit {unit.unit_number}
                </span>
                {isComplete && (
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                )}
              </div>
              <h3 className="font-bold text-text-primary text-lg truncate">
                {unit.title}
              </h3>
              {unit.description && (
                <p className="text-text-secondary text-sm truncate">
                  {unit.description}
                </p>
              )}
            </div>

            {/* Progress/Arrow */}
            <div className="flex flex-col items-end gap-1">
              {!isLocked && (
                <>
                  <span className="text-xs font-semibold text-text-muted">
                    {unit.completed_lessons}/{unit.lesson_count}
                  </span>
                  <ChevronRight
                    className={`w-5 h-5 ${
                      isComplete ? "text-success" : colors.icon
                    }`}
                  />
                </>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          {!isLocked && !isComplete && progress > 0 && (
            <div className="mt-4 h-2 bg-dark-300 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                className={`h-full bg-gradient-to-r ${colors.bg} rounded-full`}
              />
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

function getUnitIcon(index: number): string {
  const icons = ["wave", "book", "puzzle", "brain", "star", "rocket"];
  return icons[index % icons.length];
}
