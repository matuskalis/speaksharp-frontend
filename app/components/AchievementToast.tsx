"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Star, Sparkles, X, Share2 } from "lucide-react";

interface Achievement {
  key: string;
  title: string;
  description: string;
  xp_reward: number;
  tier: string;
}

interface AchievementToastProps {
  achievement: Achievement | null;
  onClose: () => void;
}

export default function AchievementToast({ achievement, onClose }: AchievementToastProps) {
  if (!achievement) return null;

  const getTierColors = (tier: string) => {
    switch (tier) {
      case "platinum":
        return {
          bg: "from-cyan-500/20 to-blue-500/20",
          border: "border-cyan-400/50",
          icon: "text-cyan-400",
          glow: "shadow-cyan-500/30",
        };
      case "gold":
        return {
          bg: "from-yellow-500/20 to-amber-500/20",
          border: "border-yellow-400/50",
          icon: "text-yellow-400",
          glow: "shadow-yellow-500/30",
        };
      case "silver":
        return {
          bg: "from-gray-400/20 to-slate-400/20",
          border: "border-gray-300/50",
          icon: "text-gray-300",
          glow: "shadow-gray-400/30",
        };
      default: // bronze
        return {
          bg: "from-orange-500/20 to-amber-600/20",
          border: "border-orange-400/50",
          icon: "text-orange-400",
          glow: "shadow-orange-500/30",
        };
    }
  };

  const colors = getTierColors(achievement.tier);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.9 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] max-w-sm w-full mx-4`}
      >
        <div
          className={`relative overflow-hidden rounded-2xl border ${colors.border} bg-gradient-to-br ${colors.bg} backdrop-blur-xl shadow-2xl ${colors.glow}`}
        >
          {/* Sparkle effects */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: 2 }}
          >
            <Sparkles className={`absolute top-2 right-8 w-4 h-4 ${colors.icon}`} />
            <Sparkles className={`absolute bottom-4 left-4 w-3 h-3 ${colors.icon}`} />
            <Sparkles className={`absolute top-8 left-8 w-3 h-3 ${colors.icon}`} />
          </motion.div>

          <div className="p-4">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                {/* Trophy icon with animation */}
                <motion.div
                  initial={{ rotate: -10, scale: 0.8 }}
                  animate={{ rotate: [0, -5, 5, 0], scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className={`p-2.5 rounded-xl bg-gradient-to-br ${colors.bg} border ${colors.border}`}
                >
                  <Trophy className={`w-6 h-6 ${colors.icon}`} />
                </motion.div>

                <div>
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-xs font-medium text-white/60 uppercase tracking-wider"
                  >
                    Achievement Unlocked!
                  </motion.p>
                  <motion.h3
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-lg font-bold text-white"
                  >
                    {achievement.title}
                  </motion.h3>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4 text-white/60" />
              </button>
            </div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-2 text-sm text-white/70 pl-14"
            >
              {achievement.description}
            </motion.p>

            {/* XP Reward and Share */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
              className="mt-3 pl-14 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                {achievement.xp_reward > 0 && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/20 rounded-full border border-indigo-400/30">
                    <Star className="w-4 h-4 text-indigo-400" />
                    <span className="text-sm font-semibold text-indigo-300">
                      +{achievement.xp_reward} XP
                    </span>
                  </div>
                )}
                <span className="text-xs text-white/50 capitalize">{achievement.tier}</span>
              </div>

              <button
                onClick={async (e) => {
                  e.stopPropagation();
                  const shareText = `I just unlocked "${achievement.title}" on Vorex! ${achievement.description}`;
                  const shareUrl = typeof window !== "undefined" ? window.location.origin : "";

                  if (navigator.share) {
                    try {
                      await navigator.share({
                        title: `Achievement Unlocked: ${achievement.title}`,
                        text: shareText,
                        url: shareUrl,
                      });
                    } catch {
                      // User cancelled or share failed
                    }
                  } else {
                    // Fallback to clipboard
                    await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
                    alert("Copied to clipboard!");
                  }
                }}
                className={`p-2 rounded-lg ${colors.bg} border ${colors.border} hover:scale-105 transition-transform`}
                title="Share achievement"
              >
                <Share2 className={`w-4 h-4 ${colors.icon}`} />
              </button>
            </motion.div>
          </div>

          {/* Progress bar animation */}
          <motion.div
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: 5, ease: "linear" }}
            onAnimationComplete={onClose}
            className={`h-1 origin-left bg-gradient-to-r ${colors.bg.replace('/20', '/50')}`}
            style={{ transformOrigin: "left" }}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
