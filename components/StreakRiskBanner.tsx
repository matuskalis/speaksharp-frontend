"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Flame, X, ArrowRight, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

interface StreakRiskBannerProps {
  streak: number;
  onDismiss?: () => void;
}

export function StreakRiskBanner({ streak, onDismiss }: StreakRiskBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight.getTime() - now.getTime();

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m`);
      } else {
        setTimeLeft(`${minutes}m`);
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible || streak <= 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="relative overflow-hidden rounded-xl border border-orange-500/30 bg-gradient-to-r from-orange-500/10 via-red-500/10 to-orange-500/10 p-4 mb-6"
      >
        {/* Animated glow effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-400/5 to-transparent"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />

        <div className="relative flex items-center gap-4">
          {/* Icon */}
          <div className="flex-shrink-0">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/20"
            >
              <AlertTriangle className="w-6 h-6 text-white" />
            </motion.div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Flame className="w-4 h-4 text-orange-400" />
              <h3 className="font-semibold text-white">
                Your {streak}-day streak is at risk!
              </h3>
            </div>
            <p className="text-sm text-white/70">
              Complete a lesson in the next <span className="font-bold text-orange-400">{timeLeft}</span> to keep your streak alive.
            </p>
          </div>

          {/* Action */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link
              href="/path"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-orange-500/25"
            >
              Practice Now
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={handleDismiss}
              className="p-2 rounded-lg hover:bg-white/[0.05] text-white/60 hover:text-white transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
