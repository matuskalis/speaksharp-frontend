"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, ChevronDown, ChevronUp, AlertCircle, CheckCircle, Info } from "lucide-react";

interface WordScore {
  word: string;
  score: number;
  status: "good" | "needs_work" | "focus" | "missing";
  tip?: string;
  problem_phonemes?: string[];
}

interface PronunciationFeedbackProps {
  overallScore: number;
  wordScores: WordScore[];
  problemSounds: string[];
  tips: string[];
  className?: string;
}

export default function PronunciationFeedback({
  overallScore,
  wordScores,
  problemSounds,
  tips,
  className = "",
}: PronunciationFeedbackProps) {
  const [expanded, setExpanded] = useState(false);

  // Get score color
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-500/20 border-green-500/30";
    if (score >= 60) return "bg-yellow-500/20 border-yellow-500/30";
    return "bg-red-500/20 border-red-500/30";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "good":
        return <CheckCircle className="w-3.5 h-3.5 text-green-400" />;
      case "needs_work":
        return <AlertCircle className="w-3.5 h-3.5 text-yellow-400" />;
      case "focus":
      case "missing":
        return <AlertCircle className="w-3.5 h-3.5 text-red-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "needs_work":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "focus":
      case "missing":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      default:
        return "bg-white/5 text-white/60 border-white/10";
    }
  };

  // Calculate circular progress
  const circumference = 2 * Math.PI * 40;
  const progress = (overallScore / 100) * circumference;

  if (!wordScores || wordScores.length === 0) {
    return null;
  }

  return (
    <div className={`bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/[0.08] overflow-hidden ${className}`}>
      {/* Header with overall score */}
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-4">
          {/* Circular progress */}
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="transparent"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="6"
              />
              {/* Progress circle */}
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="transparent"
                stroke={overallScore >= 80 ? "#4ade80" : overallScore >= 60 ? "#facc15" : "#f87171"}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${(overallScore / 100) * 176} 176`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-lg font-bold ${getScoreColor(overallScore)}`}>
                {Math.round(overallScore)}
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <Mic className="w-4 h-4 text-white/60" />
              <h3 className="text-white font-medium">Pronunciation</h3>
            </div>
            <p className="text-white/50 text-sm mt-0.5">
              {overallScore >= 80 ? "Great pronunciation!" :
               overallScore >= 60 ? "Good, with room to improve" :
               "Focus on these sounds"}
            </p>
          </div>
        </div>

        <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
          {expanded ? (
            <ChevronUp className="w-5 h-5 text-white/60" />
          ) : (
            <ChevronDown className="w-5 h-5 text-white/60" />
          )}
        </button>
      </div>

      {/* Expandable details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4 border-t border-white/[0.08] pt-4">
              {/* Word-by-word breakdown */}
              <div>
                <h4 className="text-white/70 text-sm font-medium mb-3">Word Breakdown</h4>
                <div className="flex flex-wrap gap-2">
                  {wordScores.map((word, index) => (
                    <div
                      key={index}
                      className={`group relative px-3 py-1.5 rounded-lg border text-sm font-medium ${getStatusColor(word.status)}`}
                    >
                      <span className="flex items-center gap-1.5">
                        {getStatusIcon(word.status)}
                        {word.word}
                        <span className="text-xs opacity-70">({Math.round(word.score)})</span>
                      </span>

                      {/* Tooltip with tip */}
                      {word.tip && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 rounded-lg text-xs text-white/80 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 border border-white/10">
                          {word.tip}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Problem sounds */}
              {problemSounds.length > 0 && (
                <div>
                  <h4 className="text-white/70 text-sm font-medium mb-2">Sounds to Practice</h4>
                  <div className="flex flex-wrap gap-2">
                    {problemSounds.map((sound, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-red-500/10 text-red-300 rounded-full text-sm border border-red-500/20"
                      >
                        /{sound}/
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tips */}
              {tips.length > 0 && (
                <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.08]">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-white/90 font-medium text-sm mb-2">Tips for Improvement</h4>
                      <ul className="space-y-1.5">
                        {tips.map((tip, index) => (
                          <li key={index} className="text-white/60 text-sm">
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
