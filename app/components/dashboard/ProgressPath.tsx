"use client";

import { motion } from "framer-motion";
import { ProgressLevel } from "@/lib/types";

interface ProgressPathProps {
  progressPath: ProgressLevel;
}

const cefrLevels = ["A1", "A2", "B1", "B2", "C1", "C2"];

const levelColors: Record<string, string> = {
  A1: "bg-green-500",
  A2: "bg-blue-500",
  B1: "bg-purple-500",
  B2: "bg-indigo-500",
  C1: "bg-orange-500",
  C2: "bg-rose-500",
};

export default function ProgressPath({ progressPath }: ProgressPathProps) {
  const currentIndex = cefrLevels.indexOf(progressPath.current);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-neutral-900">Progress Path</h2>
      <div className="bg-white border-2 border-neutral-200 rounded-lg p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-neutral-600 mb-1">Current Level</div>
              <div className="text-3xl font-bold text-neutral-900">
                {progressPath.current}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-neutral-600 mb-1">Next Level</div>
              <div className="text-3xl font-bold text-neutral-900">
                {progressPath.next}
              </div>
            </div>
          </div>

          <div className="relative pt-2">
            <div className="flex justify-between mb-4">
              {cefrLevels.map((level, index) => {
                const isPast = index < currentIndex;
                const isCurrent = index === currentIndex;
                const isFuture = index > currentIndex;

                return (
                  <div key={level} className="flex flex-col items-center flex-1">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white mb-2 ${
                        isPast
                          ? "bg-neutral-400"
                          : isCurrent
                          ? levelColors[level]
                          : "bg-neutral-200"
                      } ${isCurrent ? "ring-4 ring-offset-2 ring-electric-500" : ""}`}
                    >
                      {level}
                    </motion.div>
                    {isCurrent && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-xs font-semibold text-electric-600"
                      >
                        You are here
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="absolute top-8 left-0 right-0 h-2 bg-neutral-200 rounded-full -z-10">
              <motion.div
                initial={{ width: "0%" }}
                animate={{
                  width: `${(currentIndex / (cefrLevels.length - 1)) * 100}%`,
                }}
                transition={{ duration: 1, delay: 0.3 }}
                className="h-2 bg-electric-500 rounded-full"
              />
            </div>
          </div>

          <div className="bg-electric-50 border-2 border-electric-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-electric-700 font-medium mb-1">
                  Progress to {progressPath.next}
                </div>
                <div className="text-2xl font-bold text-electric-900">
                  {progressPath.progress}%
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-electric-700 font-medium mb-1">
                  Estimated Time
                </div>
                <div className="text-2xl font-bold text-electric-900">
                  {progressPath.daysToNext} days
                </div>
              </div>
            </div>
            <div className="w-full bg-electric-200 rounded-full h-3 mt-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPath.progress}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-3 bg-electric-600 rounded-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
