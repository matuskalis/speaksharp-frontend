"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  RotateCcw,
  BookOpen,
  Drama,
  Dumbbell,
  ArrowRight,
} from "lucide-react";

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
      icon: RotateCcw,
      description: "Practice your SRS flashcards",
      route: "/review",
      time: "5-10 min",
    },
    {
      id: "lesson" as SessionStep,
      title: "Lesson",
      icon: BookOpen,
      description: "Learn new grammar concepts",
      route: "/lessons",
      time: "5-10 min",
    },
    {
      id: "scenario" as SessionStep,
      title: "Scenario",
      icon: Drama,
      description: "Practice real conversations",
      route: "/scenarios",
      time: "10-15 min",
    },
    {
      id: "drill" as SessionStep,
      title: "Drill",
      icon: Dumbbell,
      description: "Speaking or writing exercise",
      route: "/drills",
      time: "5-10 min",
    },
  ];

  const handleStepClick = (stepId: SessionStep, route: string) => {
    setCurrentStep(stepId);
    router.push(route);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <h3 className="text-3xl font-semibold text-gray-900 mb-4">
            Daily Practice Session
          </h3>
          <p className="text-lg text-gray-600">
            Sign in to access your personalized daily learning session.
          </p>
        </div>
      </div>
    );
  }

  if (currentStep === "complete") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-xl">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Session Complete
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Excellent work completing today's practice session.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              onClick={() => {
                setCurrentStep("review");
                setCompletedSteps(new Set());
              }}
              size="lg"
            >
              Start New Session
            </Button>
            <Button onClick={() => router.push("/dashboard")} size="lg">
              View Progress
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const progressPercentage = (completedSteps.size / steps.length) * 100;

  return (
    <div>
      {/* Hero Section - Massive visual weight */}
      <div className="text-center mb-24">
        <h1 className="text-7xl font-bold text-gray-900 mb-6">
          Daily Practice
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
          Complete these activities for a balanced learning experience
        </p>
        <Button
          size="lg"
          onClick={() => handleStepClick("review", "/review")}
          className="text-base font-semibold px-8 py-3"
        >
          Start Session
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>

      {/* Progress Indicator - Clean and minimal */}
      <div className="mb-20">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-500">Progress</span>
          <span className="text-sm text-gray-400">
            {completedSteps.size} of {steps.length}
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-1.5">
          <div
            className="h-1.5 rounded-full bg-gray-900 transition-all duration-700 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Activity Cards - Structured grid with proper card design */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.has(step.id);
          const isCurrent = currentStep === step.id;
          const isLocked = index > 0 && !completedSteps.has(steps[index - 1].id);
          const Icon = step.icon;

          return (
            <button
              key={step.id}
              onClick={() => !isLocked && handleStepClick(step.id, step.route)}
              disabled={isLocked}
              className={cn(
                "group relative bg-white rounded-xl p-8 text-left transition-all duration-200",
                "border border-gray-200 hover:border-gray-300 hover:shadow-md",
                isLocked && "opacity-40 cursor-not-allowed hover:border-gray-200 hover:shadow-none",
                isCurrent && !isCompleted && "border-gray-900"
              )}
            >
              {/* Icon Container */}
              <div className="mb-6">
                <div
                  className={cn(
                    "inline-flex items-center justify-center w-14 h-14 rounded-xl transition-colors",
                    isCompleted
                      ? "bg-gray-900 text-white"
                      : isCurrent
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                  )}
                >
                  <Icon className="w-7 h-7" strokeWidth={1.5} />
                </div>
              </div>

              {/* Content */}
              <div className="mb-6">
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-base text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">{step.time}</span>
                {!isLocked && !isCompleted && (
                  <div className="flex items-center gap-2 text-gray-900 font-medium text-sm">
                    <span>Start</span>
                    <ArrowRight className="w-4 h-4" strokeWidth={2} />
                  </div>
                )}
                {isCompleted && (
                  <span className="text-sm text-gray-900 font-medium">✓ Complete</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Helper function for className composition
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
