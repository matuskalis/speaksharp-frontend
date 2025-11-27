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
  PartyPopper,
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

  const markStepComplete = (stepId: SessionStep) => {
    setCompletedSteps((prev) => new Set(prev).add(stepId));
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
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <h3 className="text-2xl font-semibold text-gray-900 mb-3">
            Daily Practice Session
          </h3>
          <p className="text-gray-600">
            Sign in to access your personalized daily learning session.
          </p>
        </div>
      </div>
    );
  }

  if (currentStep === "complete") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-2xl px-6">
          <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-8">
            <PartyPopper className="w-10 h-10 text-gray-900" />
          </div>
          <h2 className="text-5xl font-semibold text-gray-900 mb-4 tracking-tight">
            Session Complete
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-lg mx-auto">
            Excellent work completing today's practice session.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Button variant="outline" onClick={resetSession} size="lg">
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
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-20">
        <h1 className="text-6xl font-semibold text-gray-900 mb-4 tracking-tight">
          Daily Practice
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Complete these activities for a balanced learning experience
        </p>
      </div>

      {/* Progress Indicator - Minimal */}
      <div className="mb-16">
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="text-sm font-medium text-gray-500">
            {completedSteps.size} of {steps.length} complete
          </div>
          <div className="text-sm text-gray-400">
            {Math.round(progressPercentage)}%
          </div>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-1">
          <div
            className="h-1 rounded-full bg-gray-900 transition-all duration-700 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Steps Grid - Premium Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
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
              className={`
                group relative bg-white rounded-2xl p-8 text-left transition-all duration-200
                ${
                  isLocked
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:shadow-lg cursor-pointer"
                }
                ${isCurrent && !isCompleted ? "shadow-md" : "shadow-sm"}
              `}
            >
              {/* Icon */}
              <div className="mb-6">
                <div
                  className={`
                    inline-flex items-center justify-center w-14 h-14 rounded-2xl
                    transition-all duration-200
                    ${
                      isCompleted
                        ? "bg-gray-900 text-white"
                        : isCurrent
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                    }
                  `}
                >
                  <Icon className="w-7 h-7" strokeWidth={1.5} />
                </div>
              </div>

              {/* Content */}
              <div className="mb-6">
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-base leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">{step.time}</span>
                {!isLocked && !isCompleted && (
                  <div className="flex items-center gap-2 text-gray-900 font-medium group-hover:gap-3 transition-all">
                    <span>{isCurrent ? "Continue" : "Start"}</span>
                    <ArrowRight className="w-4 h-4" strokeWidth={2} />
                  </div>
                )}
                {isCompleted && (
                  <span className="text-gray-900 font-medium">Complete</span>
                )}
              </div>

              {/* Completion Indicator - Subtle */}
              {isCompleted && (
                <div className="absolute top-8 right-8">
                  <div className="w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
