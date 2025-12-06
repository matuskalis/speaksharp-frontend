"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useGamification } from "@/contexts/GamificationContext";
import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  rotation: number;
  scale: number;
  delay: number;
}

const COLORS = [
  "#22C55E", // green
  "#3B82F6", // blue
  "#A855F7", // purple
  "#EC4899", // pink
  "#F59E0B", // amber
  "#06B6D4", // cyan
];

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100 - 50, // -50 to 50
    y: -(Math.random() * 100 + 50), // -50 to -150
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    rotation: Math.random() * 360,
    scale: Math.random() * 0.5 + 0.5,
    delay: Math.random() * 0.2,
  }));
}

export function ConfettiCelebration() {
  const { showConfetti } = useGamification();
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (showConfetti) {
      setParticles(generateParticles(30));
    }
  }, [showConfetti]);

  return (
    <AnimatePresence>
      {showConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2">
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                initial={{
                  x: 0,
                  y: 0,
                  opacity: 1,
                  rotate: 0,
                  scale: 0,
                }}
                animate={{
                  x: particle.x * 4,
                  y: particle.y,
                  opacity: [1, 1, 0],
                  rotate: particle.rotation,
                  scale: particle.scale,
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 1,
                  delay: particle.delay,
                  ease: "easeOut",
                }}
                className="absolute"
              >
                <div
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: particle.color }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

// Smaller confetti burst for inline celebrations
export function MiniConfetti({ show }: { show: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (show) {
      setParticles(generateParticles(12));
    }
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <div className="absolute inset-0 pointer-events-none overflow-visible">
          <div className="absolute top-1/2 left-1/2">
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                initial={{
                  x: 0,
                  y: 0,
                  opacity: 1,
                  scale: 0,
                }}
                animate={{
                  x: particle.x * 2,
                  y: particle.y * 0.5,
                  opacity: [1, 1, 0],
                  scale: particle.scale * 0.6,
                }}
                transition={{
                  duration: 0.6,
                  delay: particle.delay * 0.5,
                  ease: "easeOut",
                }}
                className="absolute"
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: particle.color }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
