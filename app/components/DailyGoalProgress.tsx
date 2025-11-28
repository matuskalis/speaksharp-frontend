"use client";

interface DailyGoalProgressProps {
  minutesCompleted: number;
  dailyGoalMinutes: number;
}

export default function DailyGoalProgress({ minutesCompleted, dailyGoalMinutes }: DailyGoalProgressProps) {
  const progress = Math.min((minutesCompleted / dailyGoalMinutes) * 100, 100);
  const isComplete = minutesCompleted >= dailyGoalMinutes;

  return (
    <div className="bg-white border-2 border-neutral-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-neutral-900">Daily Goal</h3>
        {isComplete && <span className="text-2xl">✓</span>}
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-3xl font-bold text-neutral-900">
              {minutesCompleted} min
            </span>
            <span className="text-sm text-neutral-600">
              of {dailyGoalMinutes} min
            </span>
          </div>

          <div className="w-full bg-neutral-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${
                isComplete ? "bg-green-500" : "bg-neutral-900"
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {isComplete ? (
          <div className="text-sm text-green-600 font-medium">
            Goal completed! Great work!
          </div>
        ) : (
          <div className="text-sm text-neutral-600">
            {dailyGoalMinutes - minutesCompleted} min remaining
          </div>
        )}
      </div>
    </div>
  );
}
