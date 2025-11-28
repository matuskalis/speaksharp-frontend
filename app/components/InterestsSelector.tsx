"use client";

import { useState } from "react";

const INTERESTS = [
  { id: "business", label: "Business & Career", emoji: "💼" },
  { id: "technology", label: "Technology", emoji: "💻" },
  { id: "travel", label: "Travel & Culture", emoji: "🌎" },
  { id: "food", label: "Food & Cooking", emoji: "🍳" },
  { id: "sports", label: "Sports & Fitness", emoji: "⚽" },
  { id: "entertainment", label: "Movies & Music", emoji: "🎬" },
  { id: "science", label: "Science & Nature", emoji: "🔬" },
  { id: "art", label: "Art & Literature", emoji: "🎨" },
  { id: "news", label: "Current Events", emoji: "📰" },
  { id: "health", label: "Health & Wellness", emoji: "🏥" },
];

interface InterestsSelectorProps {
  onSelect: (interests: string[]) => void;
  initialInterests?: string[];
}

export default function InterestsSelector({ onSelect, initialInterests = [] }: InterestsSelectorProps) {
  const [selectedInterests, setSelectedInterests] = useState<string[]>(initialInterests);

  const toggleInterest = (interestId: string) => {
    const newInterests = selectedInterests.includes(interestId)
      ? selectedInterests.filter((id) => id !== interestId)
      : [...selectedInterests, interestId];

    setSelectedInterests(newInterests);
    onSelect(newInterests);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-semibold text-neutral-900 mb-4">
          What are you interested in?
        </h1>
        <p className="text-lg text-neutral-600">
          We'll personalize your lessons around these topics
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {INTERESTS.map((interest) => {
          const isSelected = selectedInterests.includes(interest.id);

          return (
            <button
              key={interest.id}
              onClick={() => toggleInterest(interest.id)}
              className={`p-6 rounded-lg border-2 transition-all ${
                isSelected
                  ? "border-neutral-900 bg-neutral-50"
                  : "border-neutral-200 bg-white hover:border-neutral-400"
              }`}
            >
              <div className="text-4xl mb-3">{interest.emoji}</div>
              <div className="text-lg font-medium text-neutral-900">
                {interest.label}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
