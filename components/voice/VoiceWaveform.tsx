"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface VoiceWaveformProps {
  isRecording: boolean;
  className?: string;
}

export function VoiceWaveform({ isRecording, className = "" }: VoiceWaveformProps) {
  const [bars, setBars] = useState<number[]>([0.3, 0.5, 0.4, 0.6, 0.5, 0.4, 0.3, 0.5, 0.4]);

  useEffect(() => {
    if (!isRecording) {
      setBars([0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3]);
      return;
    }

    const interval = setInterval(() => {
      setBars((prev) =>
        prev.map(() => 0.2 + Math.random() * 0.8)
      );
    }, 100);

    return () => clearInterval(interval);
  }, [isRecording]);

  return (
    <div className={`flex items-center justify-center gap-1 ${className}`}>
      {bars.map((height, index) => (
        <motion.div
          key={index}
          className="w-1.5 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full"
          animate={{
            height: `${height * 48}px`,
            opacity: isRecording ? 1 : 0.5,
          }}
          transition={{
            duration: 0.1,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

// Larger waveform for recording screen
export function VoiceWaveformLarge({ isRecording }: { isRecording: boolean }) {
  const [bars, setBars] = useState<number[]>(Array(15).fill(0.3));

  useEffect(() => {
    if (!isRecording) {
      setBars(Array(15).fill(0.3));
      return;
    }

    const interval = setInterval(() => {
      setBars((prev) =>
        prev.map(() => 0.15 + Math.random() * 0.85)
      );
    }, 80);

    return () => clearInterval(interval);
  }, [isRecording]);

  return (
    <div className="flex items-center justify-center gap-1.5 h-24">
      {bars.map((height, index) => (
        <motion.div
          key={index}
          className="w-2 bg-gradient-to-t from-red-500 to-red-400 rounded-full"
          animate={{
            height: `${height * 96}px`,
            opacity: isRecording ? 1 : 0.4,
          }}
          transition={{
            duration: 0.08,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}
