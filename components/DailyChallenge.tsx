"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apiClient } from "@/lib/api-client";
import { DailyChallenge as DailyChallengeType } from "@/lib/types";
import {
  Target,
  Zap,
  Clock,
  Mic,
  BookOpen,
  MessageCircle,
  Trophy,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { MiniConfetti } from "./gamification/ConfettiCelebration";
import { InlineXPPopup } from "./gamification/XPPopup";

interface DailyChallengeProps {
  onComplete?: () => void;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  target: Target,
  zap: Zap,
  clock: Clock,
  mic: Mic,
  book: BookOpen,
  message: MessageCircle,
};

export function DailyChallenge({ onComplete }: DailyChallengeProps) {
  const [challenge, setChallenge] = useState<DailyChallengeType | null>(null);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [timeUntilReset, setTimeUntilReset] = useState("");
  const [showCelebration, setShowCelebration] = useState(false);
  const [showXP, setShowXP] = useState(false);

  useEffect(() => {
    loadChallenge();
  }, []);

  const loadChallenge = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getTodayChallenge();
      setChallenge(data.challenge);
      setProgress(data.progress);
      setCompleted(data.completed);
      updateCountdown(data.seconds_until_reset);
    } catch (error) {
      console.error("Failed to load challenge:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateCountdown = (secondsRemaining: number) => {
    const hours = Math.floor(secondsRemaining / 3600);
    const minutes = Math.floor((secondsRemaining % 3600) / 60);
    setTimeUntilReset(`${hours}h ${minutes}m`);

    // Update every minute
    const interval = setInterval(() => {
      secondsRemaining -= 60;
      if (secondsRemaining <= 0) {
        clearInterval(interval);
        loadChallenge(); // Reload when new challenge is available
      } else {
        const h = Math.floor(secondsRemaining / 3600);
        const m = Math.floor((secondsRemaining % 3600) / 60);
        setTimeUntilReset(`${h}h ${m}m`);
      }
    }, 60000);

    return () => clearInterval(interval);
  };

  const handleComplete = async () => {
    if (completed) return;

    try {
      const result = await apiClient.completeChallenge();
      if (result.success) {
        setCompleted(true);
        setShowCelebration(true);
        setShowXP(true);

        // Hide XP popup after 2 seconds
        setTimeout(() => setShowXP(false), 2000);

        // Hide confetti after 3 seconds
        setTimeout(() => setShowCelebration(false), 3000);

        // Call onComplete callback
        onComplete?.();
      }
    } catch (error) {
      console.error("Failed to complete challenge:", error);
    }
  };

  // Auto-complete when progress reaches goal
  useEffect(() => {
    if (challenge && progress >= challenge.goal && !completed) {
      handleComplete();
    }
  }, [progress, challenge, completed]);

  if (loading) {
    return (
      <div className="glass gradient-border rounded-2xl p-5 animate-pulse">
        <div className="h-6 bg-dark-200 rounded-lg w-1/3 mb-4" />
        <div className="h-20 bg-dark-300 rounded-xl" />
      </div>
    );
  }

  if (!challenge) return null;

  const Icon = iconMap[challenge.icon] || Target;
  const progressPercentage = Math.min((progress / challenge.goal) * 100, 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative glass gradient-border rounded-2xl p-5 overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-accent-purple/10 to-transparent blur-2xl pointer-events-none" />

      {/* Confetti */}
      <MiniConfetti show={showCelebration} />

      {/* XP Popup */}
      {showXP && challenge && (
        <InlineXPPopup show={showXP} amount={challenge.reward_xp} />
      )}

      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                completed
                  ? "bg-gradient-to-br from-green-500 to-emerald-500"
                  : "bg-gradient-brand"
              } shadow-btn-glow`}
            >
              {completed ? (
                <Trophy className="w-6 h-6 text-white" />
              ) : (
                <Icon className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-text-primary">Daily Challenge</h3>
                <Sparkles className="w-4 h-4 text-yellow-400" />
              </div>
              <p className="text-xs text-text-muted">
                {completed ? "Completed!" : `Resets in ${timeUntilReset}`}
              </p>
            </div>
          </div>

          {/* Reward Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 rounded-full border border-yellow-500/30">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-bold text-yellow-400">
              +{challenge.reward_xp} XP
            </span>
          </div>
        </div>

        {/* Challenge Description */}
        <div className="mb-4">
          <h4 className="font-semibold text-text-primary mb-1">
            {challenge.title}
          </h4>
          <p className="text-sm text-text-secondary">{challenge.description}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-text-muted">Progress</span>
            <span className="text-xs font-semibold text-text-primary">
              {progress}/{challenge.goal}
            </span>
          </div>
          <div className="h-3 bg-dark-300 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className={`h-full rounded-full ${
                completed
                  ? "bg-gradient-to-r from-green-500 to-emerald-500"
                  : "bg-gradient-brand"
              } shadow-[0_0_20px_rgba(168,85,247,0.5)]`}
            />
          </div>
        </div>

        {/* Completion Message */}
        <AnimatePresence>
          {completed && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 p-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl"
            >
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-sm font-semibold text-green-400">
                    Challenge Complete!
                  </p>
                  <p className="text-xs text-text-muted">
                    Come back tomorrow for a new challenge
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Call to Action */}
        {!completed && progress < challenge.goal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4 flex items-center justify-between p-3 bg-dark-200/50 rounded-xl border border-white/[0.06]"
          >
            <span className="text-sm text-text-secondary">
              Keep going to complete!
            </span>
            <ChevronRight className="w-5 h-5 text-accent-purple" />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
