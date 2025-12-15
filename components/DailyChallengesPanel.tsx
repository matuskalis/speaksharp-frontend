"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apiClient } from "@/lib/api-client";
import {
  Target,
  Trophy,
  Zap,
  Mic,
  BookOpen,
  CheckCircle2,
  Sparkles,
  Shield,
  Clock,
} from "lucide-react";
import { MiniConfetti } from "./gamification/ConfettiCelebration";
import { InlineXPPopup } from "./gamification/XPPopup";

interface ChallengeCardProps {
  name: string;
  description: string;
  progress: number;
  target: number;
  completed: boolean;
  xpReward: number;
  icon: React.ReactNode;
  color: string;
  bonus?: React.ReactNode;
  showCelebration?: boolean;
}

function ChallengeCard({
  name,
  description,
  progress,
  target,
  completed,
  xpReward,
  icon,
  color,
  bonus,
  showCelebration,
}: ChallengeCardProps) {
  const progressPercentage = Math.min((progress / target) * 100, 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative p-4 rounded-xl border transition-all ${
        completed
          ? "bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30"
          : "bg-dark-200/50 border-white/[0.06] hover:border-white/[0.1]"
      }`}
    >
      {showCelebration && <MiniConfetti show={true} />}

      <div className="flex items-start gap-3">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
            completed ? "bg-gradient-to-br from-green-500 to-emerald-500" : color
          }`}
        >
          {completed ? (
            <CheckCircle2 className="w-5 h-5 text-white" />
          ) : (
            icon
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-semibold text-text-primary text-sm">{name}</h4>
            <div className="flex items-center gap-1 text-xs">
              <Zap className={`w-3.5 h-3.5 ${completed ? "text-green-400" : "text-yellow-400"}`} />
              <span className={completed ? "text-green-400" : "text-yellow-400"}>
                +{xpReward} XP
              </span>
            </div>
          </div>

          <p className="text-xs text-text-muted mb-2">{description}</p>

          {/* Progress bar */}
          <div className="mb-1">
            <div className="h-2 bg-dark-300 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={`h-full rounded-full ${
                  completed
                    ? "bg-gradient-to-r from-green-500 to-emerald-500"
                    : "bg-gradient-brand"
                }`}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-text-muted">
              {progress}/{target}
            </span>
            {bonus && !completed && bonus}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function DailyChallengesPanel() {
  const [challenges, setChallenges] = useState<Awaited<ReturnType<typeof apiClient.getDailyChallenges>> | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeUntilReset, setTimeUntilReset] = useState("");
  const [justCompletedCore, setJustCompletedCore] = useState(false);
  const [justCompletedAccuracy, setJustCompletedAccuracy] = useState(false);
  const [justCompletedStretch, setJustCompletedStretch] = useState(false);
  const [showXP, setShowXP] = useState(false);
  const [xpAmount, setXpAmount] = useState(0);

  useEffect(() => {
    loadChallenges();
  }, []);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight.getTime() - now.getTime();

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      setTimeUntilReset(`${hours}h ${minutes}m`);
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 60000);
    return () => clearInterval(interval);
  }, []);

  const loadChallenges = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getDailyChallenges();
      setChallenges(data);
    } catch (error) {
      console.error("Failed to load daily challenges:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="glass gradient-border rounded-2xl p-5 animate-pulse">
        <div className="h-6 bg-dark-200 rounded-lg w-1/3 mb-4" />
        <div className="space-y-3">
          <div className="h-24 bg-dark-300 rounded-xl" />
          <div className="h-24 bg-dark-300 rounded-xl" />
          <div className="h-24 bg-dark-300 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!challenges) return null;

  const { core, accuracy, stretch } = challenges.challenges;
  const completedCount = [core.completed, accuracy.completed, stretch.completed].filter(Boolean).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative glass gradient-border rounded-2xl p-5 overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-accent-purple/10 to-transparent blur-2xl pointer-events-none" />

      {/* XP Popup */}
      {showXP && <InlineXPPopup show={showXP} amount={xpAmount} />}

      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-brand flex items-center justify-center shadow-btn-glow">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-text-primary">Daily Challenges</h3>
                <Sparkles className="w-4 h-4 text-yellow-400" />
              </div>
              <div className="flex items-center gap-2 text-xs text-text-muted">
                <Clock className="w-3 h-3" />
                <span>Resets in {timeUntilReset}</span>
              </div>
            </div>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-lg font-bold text-text-primary">{completedCount}/3</div>
              <div className="text-xs text-text-muted">Completed</div>
            </div>
          </div>
        </div>

        {/* Streak Freeze Tokens */}
        {challenges.streak_freeze_tokens > 0 && (
          <div className="mb-4 p-3 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-500/20">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-400" />
              <div>
                <span className="text-sm font-medium text-blue-400">
                  {challenges.streak_freeze_tokens} Streak Freeze{challenges.streak_freeze_tokens > 1 ? "s" : ""}
                </span>
                <span className="text-xs text-text-muted ml-2">
                  Protect your streak if you miss a day
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Challenge Cards */}
        <div className="space-y-3">
          {/* Core Challenge */}
          <ChallengeCard
            name={core.name}
            description={core.description}
            progress={core.progress}
            target={core.target}
            completed={core.completed}
            xpReward={core.xp_reward}
            icon={<BookOpen className="w-5 h-5 text-white" />}
            color="bg-gradient-to-br from-purple-500 to-violet-600"
            showCelebration={justCompletedCore}
          />

          {/* Accuracy Challenge */}
          <ChallengeCard
            name={accuracy.name}
            description={accuracy.description}
            progress={accuracy.progress}
            target={accuracy.target}
            completed={accuracy.completed}
            xpReward={accuracy.xp_reward}
            icon={<Trophy className="w-5 h-5 text-white" />}
            color="bg-gradient-to-br from-amber-500 to-orange-600"
            showCelebration={justCompletedAccuracy}
          />

          {/* Stretch Challenge */}
          <ChallengeCard
            name={stretch.name}
            description={stretch.description}
            progress={Math.max(stretch.xp_progress, stretch.speaking_progress * stretch.xp_target)}
            target={stretch.xp_target}
            completed={stretch.completed}
            xpReward={stretch.xp_reward}
            icon={<Mic className="w-5 h-5 text-white" />}
            color="bg-gradient-to-br from-rose-500 to-pink-600"
            bonus={
              stretch.gives_freeze_token && (
                <div className="flex items-center gap-1 text-xs text-blue-400">
                  <Shield className="w-3 h-3" />
                  <span>+1 Freeze</span>
                </div>
              )
            }
            showCelebration={justCompletedStretch}
          />
        </div>

        {/* All Completed Message */}
        <AnimatePresence>
          {challenges.all_completed && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-green-400">All Challenges Complete!</p>
                  <p className="text-xs text-text-muted">
                    Great work today! Come back tomorrow for new challenges.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
