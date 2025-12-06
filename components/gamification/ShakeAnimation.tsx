"use client";

import { motion } from "framer-motion";
import { useGamification } from "@/contexts/GamificationContext";
import { ReactNode } from "react";

interface ShakeWrapperProps {
  children: ReactNode;
  className?: string;
}

// Wrapper component that shakes its children when triggered
export function ShakeWrapper({ children, className = "" }: ShakeWrapperProps) {
  const { showShake } = useGamification();

  return (
    <motion.div
      animate={
        showShake
          ? {
              x: [0, -10, 10, -10, 10, -5, 5, 0],
            }
          : { x: 0 }
      }
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Screen flash effect for wrong answers
export function WrongAnswerFlash() {
  const { showShake } = useGamification();

  if (!showShake) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.3, 0] }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-red-500 pointer-events-none z-40"
    />
  );
}

// Standalone shake animation for specific elements
export function ShakeOnWrong({
  shake,
  children,
  className = "",
}: {
  shake: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      animate={
        shake
          ? {
              x: [0, -8, 8, -8, 8, -4, 4, 0],
            }
          : { x: 0 }
      }
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
