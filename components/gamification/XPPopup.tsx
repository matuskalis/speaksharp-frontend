"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useGamification } from "@/contexts/GamificationContext";

export function XPPopup() {
  const { showXPPopup } = useGamification();

  return (
    <AnimatePresence>
      {showXPPopup && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: -40, scale: 1 }}
          exit={{ opacity: 0, y: -80, scale: 0.8 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
        >
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: [0.5, 1.2, 1] }}
              transition={{ duration: 0.3, times: [0, 0.6, 1] }}
              className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white font-bold text-2xl px-6 py-3 rounded-full shadow-lg"
            >
              +{showXPPopup.amount} XP
            </motion.div>

            {showXPPopup.bonus > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-2 bg-purple-500 text-white text-sm font-semibold px-4 py-1.5 rounded-full"
              >
                +{showXPPopup.bonus} Streak Bonus!
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Inline XP popup for within exercise cards
export function InlineXPPopup({
  show,
  amount,
  bonus = 0,
}: {
  show: boolean;
  amount: number;
  bonus?: number;
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.8 }}
          animate={{ opacity: 1, y: -20, scale: 1 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="absolute top-0 left-1/2 -translate-x-1/2 z-10 pointer-events-none"
        >
          <div className="flex items-center gap-2">
            <span className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white font-bold text-lg px-4 py-1.5 rounded-full shadow-md">
              +{amount}
            </span>
            {bonus > 0 && (
              <span className="bg-purple-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                +{bonus}
              </span>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
