"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Heart, Clock, Zap } from "lucide-react";
import { useGamification } from "@/contexts/GamificationContext";

interface NoHeartsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefill?: () => void;
}

export function NoHeartsModal({ isOpen, onClose, onRefill }: NoHeartsModalProps) {
  const { timeUntilRefill, refillHearts } = useGamification();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleRefill = () => {
    refillHearts();
    onRefill?.();
    onClose();
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
            onClick={onClose}
            className="fixed inset-0 bg-dark/80 backdrop-blur-md z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-sm"
          >
            <div className="glass gradient-border rounded-3xl p-6">
              {/* Broken hearts illustration */}
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Heart
                        key={i}
                        className="w-8 h-8 text-dark-300 fill-dark-300"
                      />
                    ))}
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                  >
                    <span className="text-white text-xs font-bold">0</span>
                  </motion.div>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-xl font-bold text-center text-text-primary mb-2">
                Out of Hearts!
              </h2>

              {/* Description */}
              <p className="text-center text-text-secondary mb-6">
                Take a break and come back when your hearts refill, or refill them now.
              </p>

              {/* Timer */}
              {timeUntilRefill && (
                <div className="flex items-center justify-center gap-2 mb-6 text-text-muted">
                  <Clock className="w-5 h-5" />
                  <span>Next heart in {formatTime(timeUntilRefill)}</span>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-3">
                {/* Refill button (premium feature) */}
                <button
                  onClick={handleRefill}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-brand text-white font-semibold py-3 px-4 rounded-xl shadow-btn-glow hover:shadow-btn-glow-hover transition-all"
                >
                  <Zap className="w-5 h-5" />
                  Refill Hearts
                </button>

                {/* Practice without hearts (review mode) */}
                <button
                  onClick={onClose}
                  className="w-full text-text-secondary font-medium py-3 hover:text-text-primary transition-colors"
                >
                  Practice in Review Mode
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
