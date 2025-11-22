"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

type SessionStep = "review" | "lesson" | "scenario" | "drill" | "complete";

export default function DailySession() {
  const { user } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<SessionStep>("review");
  const [completedSteps, setCompletedSteps] = useState<Set<SessionStep>>(new Set());

  const steps = [
    {
      id: "review" as SessionStep,
      title: "Review",
      icon: "🔄",
      description: "Practice your SRS cards",
      route: "/review",
      time: "5-10 min",
    },
    {
      id: "lesson" as SessionStep,
      title: "Lesson",
      icon: "📚",
      description: "Learn new concepts",
      route: "/lessons",
      time: "5-10 min",
    },
    {
      id: "scenario" as SessionStep,
      title: "Scenario",
      icon: "🎭",
      description: "Practice real conversations",
      route: "/scenarios",
      time: "10-15 min",
    },
    {
      id: "drill" as SessionStep,
      title: "Drill",
      icon: "💪",
      description: "Speaking or writing practice",
      route: "/drills",
      time: "5-10 min",
    },
  ];

  const markStepComplete = (stepId: SessionStep) => {
    setCompletedSteps((prev) => new Set(prev).add(stepId));

    // Auto-advance to next step
    const currentIndex = steps.findIndex((s) => s.id === stepId);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id);
    } else {
      setCurrentStep("complete");
    }
  };

  const handleStepClick = (stepId: SessionStep, route: string) => {
    setCurrentStep(stepId);
    router.push(route);
  };

  const resetSession = () => {
    setCurrentStep("review");
    setCompletedSteps(new Set());
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] p-7">
          <h3 className="text-xl font-bold text-white mb-3">📅 Daily Session</h3>
          <p className="text-white/60 text-sm">
            Sign in to access your personalized daily learning session.
          </p>
        </div>
      </div>
    );
  }

  if (currentStep === "complete") {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-green-500/10 to-blue-500/10 backdrop-blur-md rounded-2xl border border-green-500/20 shadow-[0_8px_32px_0_rgba(0,255,0,0.1)] p-10 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-3xl font-bold text-white mb-3">Session Complete!</h3>
          <p className="text-white/70 text-lg mb-6">
            Excellent work! You've completed today's recommended practice.
          </p>

          <div className="flex items-center justify-center gap-4 mb-8">
            {steps.map((step) => (
              <div
                key={step.id}
                className="flex flex-col items-center"
              >
                <div className="w-12 h-12 rounded-full bg-green-500/20 border-2 border-green-500/50 flex items-center justify-center text-2xl mb-2">
                  {step.icon}
                </div>
                <div className="text-xs text-green-300">✓ {step.title}</div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={resetSession}
              className="px-6 py-3 bg-white/[0.05] text-white border border-white/[0.12] rounded-lg hover:bg-white/[0.08] transition-all duration-300"
            >
              Start New Session
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-rose-500 text-white rounded-lg hover:from-indigo-600 hover:to-rose-600 transition-all duration-300"
            >
              View Progress
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300 mb-3">
          📅 Daily Learning Session
        </h2>
        <p className="text-white/60">
          Complete these steps for a balanced practice session
        </p>
      </div>

      {/* Progress Bar */}
      <div className="bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-medium text-white/70">Session Progress</div>
          <div className="text-sm text-white/60">
            {completedSteps.size} / {steps.length} steps
          </div>
        </div>
        <div className="w-full bg-white/[0.05] rounded-full h-2.5">
          <div
            className="h-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-rose-500 transition-all duration-500"
            style={{ width: `${(completedSteps.size / steps.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.has(step.id);
          const isCurrent = currentStep === step.id;
          const isLocked = index > 0 && !completedSteps.has(steps[index - 1].id);

          return (
            <button
              key={step.id}
              onClick={() => !isLocked && handleStepClick(step.id, step.route)}
              disabled={isLocked}
              className={`p-6 rounded-2xl border transition-all duration-300 text-left ${
                isCompleted
                  ? "bg-green-500/10 border-green-500/30 hover:bg-green-500/15"
                  : isCurrent
                  ? "bg-gradient-to-r from-indigo-500/20 to-rose-500/20 border-white/20 shadow-lg"
                  : isLocked
                  ? "bg-white/[0.02] border-white/[0.05] opacity-50 cursor-not-allowed"
                  : "bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.05]"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`text-4xl ${isLocked ? "grayscale opacity-50" : ""}`}>
                    {step.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                      <span>{step.title}</span>
                      {isCompleted && <span className="text-green-400 text-sm">✓</span>}
                      {isCurrent && !isCompleted && (
                        <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded">
                          Current
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-white/60 mt-1">{step.description}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-white/50">
                <span>⏱️ {step.time}</span>
                {isLocked && <span className="text-white/40">🔒 Complete previous step</span>}
                {!isLocked && !isCompleted && <span className="text-indigo-300">Click to start →</span>}
              </div>

              {isCurrent && !isCompleted && (
                <div className="mt-4 pt-4 border-t border-white/[0.08]">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      markStepComplete(step.id);
                    }}
                    className="w-full py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-green-300 rounded-lg hover:from-green-500/30 hover:to-emerald-500/30 transition-all duration-300 text-sm font-medium"
                  >
                    ✓ Mark as Complete
                  </button>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] p-6">
        <h4 className="text-sm font-semibold text-white/80 mb-3">💡 Quick Tips</h4>
        <ul className="space-y-2 text-sm text-white/60">
          <li>• Complete steps in order for the best learning experience</li>
          <li>• Take breaks between steps if needed</li>
          <li>• You can skip the session and practice freely anytime</li>
          <li>• Review your progress on the Dashboard tab</li>
        </ul>
      </div>
    </div>
  );
}
