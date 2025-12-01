"use client";

import { motion } from "framer-motion";
import { SkillScore } from "@/lib/types";

interface SkillBreakdownProps {
  scores: SkillScore;
}

const skillConfig = {
  grammar: { icon: "📝", label: "Grammar", color: "bg-blue-500" },
  vocabulary: { icon: "📚", label: "Vocabulary", color: "bg-green-500" },
  fluency: { icon: "💬", label: "Fluency", color: "bg-purple-500" },
  pronunciation: { icon: "🗣️", label: "Pronunciation", color: "bg-orange-500" },
};

export default function SkillBreakdown({ scores }: SkillBreakdownProps) {
  const skillEntries = Object.entries(scores) as [keyof SkillScore, number][];
  const weakestSkill = skillEntries.reduce((min, entry) =>
    entry[1] < min[1] ? entry : min
  );

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-neutral-900">Skill Breakdown</h2>
      <div className="bg-white border-2 border-neutral-200 rounded-lg p-6">
        <div className="space-y-6">
          {skillEntries.map(([skill, score], index) => {
            const config = skillConfig[skill];
            const isWeakest = skill === weakestSkill[0];

            return (
              <motion.div
                key={skill}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg transition-all ${
                  isWeakest
                    ? "bg-amber-50 border-2 border-amber-300"
                    : "bg-neutral-50 border-2 border-neutral-200"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{config.icon}</span>
                    <div>
                      <h3 className="font-semibold text-neutral-900">
                        {config.label}
                      </h3>
                      {isWeakest && (
                        <p className="text-xs text-amber-600 font-medium">
                          🎯 Focus area
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-neutral-900">
                    {score}
                    <span className="text-sm text-neutral-500">/100</span>
                  </span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${score}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 + 0.2 }}
                    className={`h-3 rounded-full ${config.color}`}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
