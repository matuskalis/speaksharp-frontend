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
        <div className="text-center max-w-[600px] px-8">
          <h2 className="text-5xl font-semibold text-gray-900 mb-6">
            Session Complete
          </h2>
          <p className="text-lg text-gray-600 mb-12">
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
    <div className="w-full max-w-[1200px] mx-auto px-8">
      {/* Hero Section - 120px bottom spacing */}
      <div className="text-center mb-[120px]">
        <h1 className="text-6xl font-semibold text-gray-900 mb-6 tracking-tight leading-tight">
          Daily Practice
        </h1>
        <p className="text-lg text-gray-600 max-w-[600px] mx-auto mb-12">
          Complete these activities for a balanced learning experience
        </p>
        <Button size="lg" onClick={() => handleStepClick("review", "/review")}>
          Start Session
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>

      {/* Progress Section - 80px bottom spacing */}
      <div className="mb-[80px]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-500">Progress</span>
          <span className="text-sm text-gray-400">
            {completedSteps.size} of {steps.length}
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className="h-2 rounded-full bg-gray-900 transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Cards Grid - Strict uniform layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                group relative bg-white border border-gray-200 rounded-xl p-10 text-left
                transition-all duration-200 h-full flex flex-col
                ${isLocked ? "opacity-40 cursor-not-allowed" : "hover:border-gray-300 hover:shadow-md cursor-pointer"}
                ${isCurrent && !isCompleted ? "border-gray-900" : ""}
              `}
            >
              {/* Icon - Fixed size */}
              <div className="mb-8">
                <div
                  className={`
                    inline-flex items-center justify-center w-16 h-16 rounded-xl
                    ${
                      isCompleted
                        ? "bg-gray-900 text-white"
                        : isCurrent
                        ? "bg-gray-900 text-white"
                        : "bg-gray-100 text-gray-600"
                    }
                  `}
                >
                  <Icon className="w-8 h-8" strokeWidth={1.5} />
                </div>
              </div>

              {/* Content - Flexible grow */}
              <div className="flex-grow mb-8">
                <h3 className="text-3xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Footer - Fixed at bottom */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">{step.time}</span>
                {!isLocked && !isCompleted && (
                  <div className="flex items-center gap-2 text-gray-900 font-medium">
                    <span>Start</span>
                    <ArrowRight className="w-4 h-4" strokeWidth={2} />
                  </div>
                )}
                {isCompleted && (
                  <span className="text-gray-900 font-medium">✓ Complete</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
