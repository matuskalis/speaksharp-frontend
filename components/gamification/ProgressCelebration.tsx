"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Star, Zap, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { ShareButton } from "@/components/social/ShareButton";
import { generateSessionShareText } from "@/lib/share-utils";

interface ProgressCelebrationProps {
  isOpen: boolean;
  onClose: () => void;
  stats: {
    correctCount: number;
    totalQuestions: number;
    xpEarned: number;
    timeSeconds: number;
    heartsLost: number;
    isPerfect: boolean;
    skillName?: string;
    skillLevel?: string;
  };
}

export function ProgressCelebration({ isOpen, onClose, stats }: ProgressCelebrationProps) {
  const [showStats, setShowStats] = useState(false);
  const accuracy = Math.round((stats.correctCount / stats.totalQuestions) * 100);

  useEffect(() => {
    if (isOpen) {
      setShowStats(false);
      const timer = setTimeout(() => setShowStats(true), 600);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  const getMessage = () => {
    if (stats.isPerfect) return "Perfect Score!";
    if (accuracy >= 80) return "Great Job!";
    if (accuracy >= 60) return "Good Progress!";
    return "Keep Practicing!";
  };

  const getEmoji = () => {
    if (stats.isPerfect) return "🎉";
    if (accuracy >= 80) return "⭐";
    if (accuracy >= 60) return "👍";
    return "💪";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-dark/90 backdrop-blur-xl z-50"
          />

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
          >
            <div className="w-full max-w-sm">
              {/* Trophy/Star icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", damping: 10 }}
                className="flex justify-center mb-6"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/30">
                  {stats.isPerfect ? (
                    <Trophy className="w-12 h-12 text-white" />
                  ) : (
                    <Star className="w-12 h-12 text-white fill-white" />
                  )}
                </div>
              </motion.div>

              {/* Message */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-center mb-8"
              >
                <span className="text-4xl mb-2 block">{getEmoji()}</span>
                <h2 className="text-2xl font-bold text-text-primary mb-2">
                  {getMessage()}
                </h2>
                {stats.skillName ? (
                  <div className="flex items-center justify-center gap-2">
                    {stats.skillLevel && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-accent-purple/20 text-accent-purple font-medium">
                        {stats.skillLevel}
                      </span>
                    )}
                    <p className="text-text-secondary">{stats.skillName}</p>
                  </div>
                ) : (
                  <p className="text-text-secondary">
                    You completed the practice session
                  </p>
                )}
              </motion.div>

              {/* Stats */}
              <AnimatePresence>
                {showStats && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass gradient-border rounded-2xl p-5 mb-6"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      {/* Accuracy */}
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-center"
                      >
                        <div className="text-3xl font-bold text-text-primary">{accuracy}%</div>
                        <div className="text-sm text-text-muted">Accuracy</div>
                      </motion.div>

                      {/* XP */}
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-center"
                      >
                        <div className="text-3xl font-bold text-yellow-400 flex items-center justify-center gap-1">
                          <Zap className="w-6 h-6" />
                          {stats.xpEarned}
                        </div>
                        <div className="text-sm text-text-muted">XP Earned</div>
                      </motion.div>

                      {/* Correct */}
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-center"
                      >
                        <div className="text-3xl font-bold text-green-400">
                          {stats.correctCount}/{stats.totalQuestions}
                        </div>
                        <div className="text-sm text-text-muted">Correct</div>
                      </motion.div>

                      {/* Time */}
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-center"
                      >
                        <div className="text-3xl font-bold text-text-primary">
                          {formatTime(stats.timeSeconds)}
                        </div>
                        <div className="text-sm text-text-muted">Time</div>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Share Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mb-4"
              >
                <p className="text-sm text-white/60 text-center mb-3">
                  Share your progress!
                </p>
                <ShareButton
                  title="Practice Session Complete!"
                  text={generateSessionShareText(
                    stats.correctCount,
                    stats.totalQuestions,
                    stats.xpEarned
                  )}
                  variant="compact"
                  onShare={(platform) => {
                    console.log(`Shared session on ${platform}`);
                  }}
                />
              </motion.div>

              {/* Continue button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                onClick={onClose}
                className="w-full flex items-center justify-center gap-2 bg-gradient-brand text-white font-bold py-4 px-6 rounded-xl shadow-btn-glow hover:shadow-btn-glow-hover transition-all"
              >
                Continue
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
