"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Star, X, Sparkles } from "lucide-react";
import { ShareButton } from "./ShareButton";
import { ShareCard } from "./ShareCard";
import { generateAchievementShareText, formatAchievementForShare } from "@/lib/share-utils";
import { useState, useEffect } from "react";

export interface AchievementUnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  achievement: {
    title: string;
    description: string;
    points: number;
    tier: string;
    category: string;
  };
}

export function AchievementUnlockModal({
  isOpen,
  onClose,
  achievement,
}: AchievementUnlockModalProps) {
  const [showShareCard, setShowShareCard] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowShareCard(false);
      const timer = setTimeout(() => setShowShareCard(true), 1200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const tierColors = {
    platinum: "from-cyan-400 to-blue-500",
    gold: "from-yellow-400 to-orange-500",
    silver: "from-gray-300 to-gray-500",
    bronze: "from-amber-600 to-amber-800",
  };

  const tierColor =
    tierColors[achievement.tier as keyof typeof tierColors] || tierColors.bronze;

  const tierEmojis = {
    platinum: "💎",
    gold: "🥇",
    silver: "🥈",
    bronze: "🥉",
  };

  const tierEmoji =
    tierEmojis[achievement.tier as keyof typeof tierEmojis] || "🏆";

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

          {/* Confetti Effect */}
          <div className="fixed inset-0 z-50 pointer-events-none">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: "50%",
                  y: "50%",
                  scale: 0,
                  opacity: 1,
                }}
                animate={{
                  x: `${Math.random() * 100}%`,
                  y: `${Math.random() * 100}%`,
                  scale: Math.random() * 2 + 1,
                  opacity: 0,
                }}
                transition={{
                  duration: Math.random() * 2 + 1,
                  delay: Math.random() * 0.5,
                  ease: "easeOut",
                }}
                className="absolute"
              >
                <Sparkles
                  className="text-yellow-400"
                  style={{
                    width: Math.random() * 20 + 10,
                    height: Math.random() * 20 + 10,
                  }}
                />
              </motion.div>
            ))}
          </div>

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-2xl">
              {/* Close Button */}
              <div className="flex justify-end mb-4">
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-white/[0.05] text-white/60 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Achievement Celebration */}
              <div className="bg-dark-100 rounded-2xl border border-white/[0.08] shadow-2xl overflow-hidden">
                <div className="relative p-8 text-center">
                  {/* Background gradient */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-radial from-purple-500 via-transparent to-transparent blur-3xl" />
                  </div>

                  {/* Content */}
                  <div className="relative">
                    {/* "Achievement Unlocked" Header */}
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="mb-6"
                    >
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 font-semibold">
                        <Trophy className="w-4 h-4" />
                        Achievement Unlocked!
                      </div>
                    </motion.div>

                    {/* Trophy Icon */}
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        delay: 0.4,
                        type: "spring",
                        damping: 12,
                        stiffness: 200,
                      }}
                      className="mb-6"
                    >
                      <div
                        className={`w-32 h-32 mx-auto rounded-2xl bg-gradient-to-br ${tierColor} flex items-center justify-center shadow-lg`}
                      >
                        <span className="text-6xl">{tierEmoji}</span>
                      </div>
                    </motion.div>

                    {/* Achievement Title */}
                    <motion.h2
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="text-3xl font-bold text-white mb-3"
                    >
                      {achievement.title}
                    </motion.h2>

                    {/* Achievement Description */}
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      className="text-white/70 mb-6 max-w-md mx-auto"
                    >
                      {achievement.description}
                    </motion.p>

                    {/* Points Badge */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8, type: "spring" }}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-yellow-500/20 border border-yellow-500/30 mb-8"
                    >
                      <Star className="w-5 h-5 text-yellow-400" />
                      <span className="font-bold text-yellow-400 text-lg">
                        +{achievement.points} points
                      </span>
                    </motion.div>

                    {/* Share Section */}
                    <AnimatePresence>
                      {showShareCard && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                        >
                          <div className="mb-4">
                            <p className="text-white/60 text-sm mb-4">
                              Celebrate your achievement!
                            </p>
                            <ShareButton
                              title={achievement.title}
                              text={generateAchievementShareText(
                                formatAchievementForShare(achievement)
                              )}
                              variant="default"
                              onShare={(platform) => {
                                console.log(
                                  `Shared achievement on ${platform}`
                                );
                              }}
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Continue Button */}
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                      onClick={onClose}
                      className="text-white/60 hover:text-white text-sm font-medium transition-colors"
                    >
                      Continue
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Share Preview (Optional) */}
              {showShareCard && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  className="mt-6 bg-dark-100 rounded-2xl border border-white/[0.08] p-6"
                >
                  <p className="text-white/60 text-sm mb-4 text-center">
                    Preview how this will look when shared:
                  </p>
                  <div className="flex justify-center scale-75 origin-top">
                    <ShareCard
                      type="achievement"
                      data={{
                        title: achievement.title,
                        description: achievement.description,
                        value: achievement.points,
                        tier: achievement.tier,
                        category: achievement.category,
                      }}
                    />
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
