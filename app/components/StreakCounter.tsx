"use client";

interface StreakCounterProps {
  currentStreak: number;
  longestStreak: number;
}

export default function StreakCounter({ currentStreak, longestStreak }: StreakCounterProps) {
  return (
    <div className="bg-white border-2 border-neutral-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-neutral-900">Daily Streak</h3>
        <span className="text-3xl">🔥</span>
      </div>

      <div className="space-y-4">
        <div>
          <div className="text-4xl font-bold text-neutral-900 mb-1">
            {currentStreak} {currentStreak === 1 ? "day" : "days"}
          </div>
          <div className="text-sm text-neutral-600">Current streak</div>
        </div>

        <div className="pt-4 border-t border-neutral-200">
          <div className="text-sm text-neutral-600 mb-1">Your longest streak</div>
          <div className="text-2xl font-semibold text-neutral-900">
            {longestStreak} {longestStreak === 1 ? "day" : "days"}
          </div>
        </div>
      </div>
    </div>
  );
}
