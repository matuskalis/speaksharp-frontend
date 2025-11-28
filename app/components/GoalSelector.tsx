"use client";

import { useState } from "react";

const GOALS = [
  { id: "career", label: "Career advancement", emoji: "💼" },
  { id: "school", label: "School/University", emoji: "🎓" },
  { id: "travel", label: "Travel", emoji: "✈️" },
  { id: "culture", label: "Culture & conversation", emoji: "🌍" },
  { id: "family", label: "Family & friends", emoji: "👨‍👩‍👧" },
  { id: "brain", label: "Brain training", emoji: "🧠" },
  { id: "other", label: "Other", emoji: "➕" },
];

interface GoalSelectorProps {
  onSelect: (goals: string[]) => void;
  initialGoals?: string[];
}

export default function GoalSelector({ onSelect, initialGoals = [] }: GoalSelectorProps) {
  const [selectedGoals, setSelectedGoals] = useState<string[]>(initialGoals);

  const toggleGoal = (goalId: string) => {
    const newGoals = selectedGoals.includes(goalId)
      ? selectedGoals.filter((id) => id !== goalId)
      : [...selectedGoals, goalId];

    setSelectedGoals(newGoals);
    onSelect(newGoals);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-semibold text-neutral-900 mb-4">
          Why are you learning English?
        </h1>
        <p className="text-lg text-neutral-600">
          Select all that apply
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {GOALS.map((goal) => {
          const isSelected = selectedGoals.includes(goal.id);

          return (
            <button
              key={goal.id}
              onClick={() => toggleGoal(goal.id)}
              className={`p-6 rounded-lg border-2 transition-all ${
                isSelected
                  ? "border-neutral-900 bg-neutral-50"
                  : "border-neutral-200 bg-white hover:border-neutral-400"
              }`}
            >
              <div className="text-4xl mb-3">{goal.emoji}</div>
              <div className="text-lg font-medium text-neutral-900">
                {goal.label}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
