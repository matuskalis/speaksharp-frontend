"use client";

import { motion } from "framer-motion";
import { MessageCircle, Users, Coffee, Briefcase, Plane, Heart, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type VoiceMode = "free" | "scenario";

interface Scenario {
  id: string;
  title: string;
  description: string;
  icon: typeof Coffee;
  color: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  prompt: string;
}

const scenarios: Scenario[] = [
  {
    id: "coffee-shop",
    title: "Coffee Shop",
    description: "Order your favorite drink",
    icon: Coffee,
    color: "bg-amber-500",
    difficulty: "beginner",
    prompt: "You are a friendly barista at a coffee shop. The customer wants to order a drink. Ask them what they would like and make small talk.",
  },
  {
    id: "job-interview",
    title: "Job Interview",
    description: "Practice interview questions",
    icon: Briefcase,
    color: "bg-blue-500",
    difficulty: "intermediate",
    prompt: "You are a professional interviewer. Ask the candidate about their experience, strengths, and why they want this job.",
  },
  {
    id: "airport",
    title: "At the Airport",
    description: "Navigate check-in & security",
    icon: Plane,
    color: "bg-sky-500",
    difficulty: "intermediate",
    prompt: "You are an airline check-in agent. Help the passenger with their boarding pass, luggage, and answer any questions about their flight.",
  },
  {
    id: "first-date",
    title: "First Date",
    description: "Casual conversation practice",
    icon: Heart,
    color: "bg-pink-500",
    difficulty: "beginner",
    prompt: "You are on a first date. Make casual conversation, ask about hobbies, work, and interests. Be friendly and engaging.",
  },
];

interface VoiceModeSelectorProps {
  onSelectMode: (mode: VoiceMode) => void;
  onSelectScenario?: (scenario: Scenario) => void;
}

export function VoiceModeSelector({ onSelectMode, onSelectScenario }: VoiceModeSelectorProps) {
  return (
    <div className="space-y-6">
      {/* Free Talk Mode */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onClick={() => onSelectMode("free")}
        className="w-full bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-left shadow-btn-glow hover:shadow-btn-glow-hover transition-all active:scale-[0.98]"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
            <MessageCircle className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white">Free Conversation</h3>
            <p className="text-purple-100 text-sm mt-1">
              Talk about anything with your AI tutor
            </p>
          </div>
          <ChevronRight className="w-6 h-6 text-white/60" />
        </div>
      </motion.button>

      {/* Scenario Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-5 h-5 text-text-muted" />
          <h2 className="font-semibold text-text-secondary">Practice Scenarios</h2>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {scenarios.map((scenario, index) => {
            const Icon = scenario.icon;
            return (
              <motion.button
                key={scenario.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                onClick={() => onSelectScenario?.(scenario)}
                className="glass gradient-border rounded-xl p-4 text-left hover:bg-dark-200/50 transition-all active:scale-[0.98]"
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center mb-3",
                    scenario.color
                  )}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-text-primary">{scenario.title}</h3>
                <p className="text-xs text-text-muted mt-0.5">{scenario.description}</p>
                <span
                  className={cn(
                    "inline-block text-xs font-medium px-2 py-0.5 rounded-full mt-2",
                    scenario.difficulty === "beginner" && "bg-green-500/20 text-green-400",
                    scenario.difficulty === "intermediate" && "bg-amber-500/20 text-amber-400",
                    scenario.difficulty === "advanced" && "bg-red-500/20 text-red-400"
                  )}
                >
                  {scenario.difficulty}
                </span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

export type { VoiceMode, Scenario };
export { scenarios };
