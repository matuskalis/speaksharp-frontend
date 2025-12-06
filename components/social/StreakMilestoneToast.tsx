"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Flame, Share2 } from "lucide-react";
import { useState, useEffect } from "react";
import { ShareButton } from "./ShareButton";
import { generateStatsShareText } from "@/lib/share-utils";

export interface StreakMilestoneToastProps {
  isOpen: boolean;
  onClose: () => void;
  streak: number;
  milestone: 7 | 30 | 100 | 365;
  autoCloseDelay?: number;
}

export function StreakMilestoneToast({
  isOpen,
  onClose,
  streak,
  milestone,
  autoCloseDelay = 5000,
}: StreakMilestoneToastProps) {
  const [showShare, setShowShare] = useState(false);

  useEffect(() => {
    if (isOpen && autoCloseDelay > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoCloseDelay, onClose]);

  const getMilestoneMessage = () => {
    if (milestone === 7) return "7 Day Streak!";
    if (milestone === 30) return "30 Day Streak!";
    if (milestone === 100) return "100 Day Streak!";
    if (milestone === 365) return "365 Day Streak!";
    return `${streak} Day Streak!`;
  };

  const getMilestoneEmoji = () => {
    if (milestone === 7) return "🔥";
    if (milestone === 30) return "🔥🔥";
    if (milestone === 100) return "🔥🔥🔥";
    if (milestone === 365) return "🎉🔥🎉";
    return "🔥";
  };

  const getMilestoneDescription = () => {
    if (milestone === 7) return "Keep the momentum going!";
    if (milestone === 30) return "You're on fire! Consistency pays off!";
    if (milestone === 100) return "Incredible dedication! You're unstoppable!";
    if (milestone === 365) return "One full year! You're a legend!";
    return "Amazing consistency!";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="fixed bottom-8 right-8 max-w-sm z-50"
        >
          <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-md rounded-2xl border border-orange-400/30 shadow-2xl p-5">
            {/* Header */}
            <div className="flex items-start gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">{getMilestoneEmoji()}</span>
                  <h3 className="text-lg font-bold text-white">
                    {getMilestoneMessage()}
                  </h3>
                </div>
                <p className="text-white/70 text-sm">
                  {getMilestoneDescription()}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-white/[0.05] text-white/60 hover:text-white transition-colors flex-shrink-0"
              >
                ✕
              </button>
            </div>

            {/* Progress Indicator */}
            <div className="mb-3">
              <div className="flex items-center justify-between text-xs text-white/60 mb-1">
                <span>Current Streak</span>
                <span className="font-bold text-orange-400">{streak} days</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-orange-400 to-red-500"
                />
              </div>
            </div>

            {/* Share Section */}
            <AnimatePresence>
              {showShare ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-white/[0.08] pt-3 mt-3"
                >
                  <ShareButton
                    title={`${streak} Day Streak on Vorex`}
                    text={generateStatsShareText({
                      type: "streak",
                      value: streak,
                      context: getMilestoneDescription(),
                    })}
                    variant="compact"
                    onShare={(platform) => {
                      console.log(`Shared streak on ${platform}`);
                    }}
                  />
                </motion.div>
              ) : (
                <button
                  onClick={() => setShowShare(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.15] text-white/70 hover:text-white text-sm font-medium transition-all mt-3"
                >
                  <Share2 className="w-4 h-4" />
                  Share Milestone
                </button>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
