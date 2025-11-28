"use client";

import { useState } from "react";

const TIME_OPTIONS = [
  {
    id: "casual",
    minutes: 5,
    label: "Casual",
    emoji: "🕐",
    weeklyMinutes: 35,
    description: "5 min/day"
  },
  {
    id: "regular",
    minutes: 10,
    label: "Regular",
    emoji: "🕑",
    weeklyMinutes: 70,
    description: "10 min/day"
  },
  {
    id: "serious",
    minutes: 15,
    label: "Serious",
    emoji: "🕒",
    weeklyMinutes: 105,
    description: "15 min/day"
  },
  {
    id: "intense",
    minutes: 30,
    label: "Intense",
    emoji: "🕟",
    weeklyMinutes: 210,
    description: "30 min/day"
  },
];

interface TimeCommitmentProps {
  onSelect: (minutes: number) => void;
  initialValue?: number;
}

export default function TimeCommitment({ onSelect, initialValue }: TimeCommitmentProps) {
  const [selectedMinutes, setSelectedMinutes] = useState<number | null>(initialValue || null);

  const handleSelect = (minutes: number) => {
    setSelectedMinutes(minutes);
    onSelect(minutes);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-semibold text-neutral-900 mb-4">
          How much time can you commit?
        </h1>
        <p className="text-lg text-neutral-600">
          Choose your daily goal
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {TIME_OPTIONS.map((option) => {
          const isSelected = selectedMinutes === option.minutes;

          return (
            <button
              key={option.id}
              onClick={() => handleSelect(option.minutes)}
              className={`p-6 rounded-lg border-2 transition-all ${
                isSelected
                  ? "border-neutral-900 bg-neutral-50"
                  : "border-neutral-200 bg-white hover:border-neutral-400"
              }`}
            >
              <div className="text-4xl mb-3">{option.emoji}</div>
              <div className="text-lg font-medium text-neutral-900 mb-1">
                {option.label}
              </div>
              <div className="text-sm text-neutral-600 mb-2">
                {option.description}
              </div>
              <div className="text-xs text-neutral-500">
                ~{option.weeklyMinutes} min/week
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
