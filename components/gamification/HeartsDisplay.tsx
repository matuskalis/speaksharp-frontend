"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import { useGamification } from "@/contexts/GamificationContext";

interface HeartsDisplayProps {
  compact?: boolean;
}

export function HeartsDisplay({ compact = false }: HeartsDisplayProps) {
  const { hearts, timeUntilRefill } = useGamification();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        <Heart
          className={`w-5 h-5 ${hearts.current > 0 ? "text-red-500 fill-red-500" : "text-text-muted"}`}
        />
        <span className="font-bold text-text-primary">{hearts.current}</span>
        {timeUntilRefill && hearts.current < hearts.max && (
          <span className="text-xs text-text-muted ml-1">
            {formatTime(timeUntilRefill)}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: hearts.max }).map((_, index) => {
        const isFilled = index < hearts.current;
        const isLastLost = index === hearts.current;

        return (
          <motion.div
            key={index}
            initial={false}
            animate={{
              scale: isLastLost ? [1, 1.2, 0.8, 1] : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            <Heart
              className={`w-5 h-5 transition-colors duration-300 ${
                isFilled
                  ? "text-red-500 fill-red-500"
                  : "text-dark-300 fill-dark-300"
              }`}
            />
          </motion.div>
        );
      })}

      <AnimatePresence>
        {timeUntilRefill && hearts.current < hearts.max && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="text-xs text-text-muted ml-2 font-medium"
          >
            {formatTime(timeUntilRefill)}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
