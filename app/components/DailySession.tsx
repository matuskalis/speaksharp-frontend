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
  Clock,
  CheckCircle2,
  ArrowRight,
  PartyPopper,
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
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Daily Practice Session</h3>
          <p className="text-gray-600">
            Sign in to access your personalized daily learning session.
          </p>
        </div>
      </div>
    );
  }

  if (currentStep === "complete") {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-12 text-center">
          <div className="mx-auto w-16 h-16 bg-success-light rounded-full flex items-center justify-center mb-6">
            <PartyPopper className="w-8 h-8 text-success" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Session Complete!</h2>
          <p className="text-lg text-gray-600 mb-8">
            Excellent work completing today's practice session.
          </p>

          <div className="flex items-center justify-center gap-4 mb-8">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.id} className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-success-light border-2 border-success flex items-center justify-center mb-2">
                    <Icon className="w-5 h-5 text-success" />
                  </div>
                  <div className="text-xs text-gray-600">{step.title}</div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-3">
            <Button variant="outline" onClick={resetSession}>
              Start New Session
            </Button>
            <Button onClick={() => router.push("/dashboard")}>
              View Progress
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const progressPercentage = (completedSteps.size / steps.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Daily Practice Session</h1>
        <p className="text-gray-600">
          Complete these activities for a balanced learning experience
        </p>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-medium text-gray-700">Session Progress</div>
          <div className="text-sm text-gray-500">
            {completedSteps.size} of {steps.length} complete
          </div>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className="h-2 rounded-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.has(step.id);
          const isCurrent = currentStep === step.id;
          const isLocked = index > 0 && !completedSteps.has(steps[index - 1].id);
          const Icon = step.icon;

          return (
            <div
              key={step.id}
              className={`
                bg-white rounded-lg border shadow-sm p-6 transition-all duration-200
                ${
                  isCompleted
                    ? "border-success bg-success-light/20"
                    : isCurrent
                    ? "border-primary bg-primary-50/30 shadow-md"
                    : isLocked
                    ? "border-gray-200 opacity-60"
                    : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                }
                ${!isLocked ? "cursor-pointer" : "cursor-not-allowed"}
              `}
              onClick={() => !isLocked && handleStepClick(step.id, step.route)}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div
                  className={`
                    flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center
                    ${
                      isCompleted
                        ? "bg-success text-white"
                        : isCurrent
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-600"
                    }
                  `}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <Icon className="w-6 h-6" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-semibold text-gray-900">{step.title}</h3>
                    {isCurrent && !isCompleted && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-primary-100 text-primary-700 rounded">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{step.description}</p>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{step.time}</span>
                    </div>
                    {!isLocked && !isCompleted && (
                      <div className="flex items-center gap-1 text-primary font-medium">
                        <span>Start</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    )}
                    {isLocked && (
                      <span className="text-gray-400">Complete previous step</span>
                    )}
                  </div>

                  {/* Mark Complete Button */}
                  {isCurrent && !isCompleted && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <Button
                        size="sm"
                        variant="outline"
                        fullWidth
                        onClick={(e) => {
                          e.stopPropagation();
                          markStepComplete(step.id);
                        }}
                        className="text-success border-success hover:bg-success-light"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Mark Complete
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tips Section */}
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Practice Tips</h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• Complete activities in order for optimal learning progression</li>
          <li>• Take short breaks between activities to stay focused</li>
          <li>• You can practice freely at any time from the navigation menu</li>
        </ul>
      </div>
    </div>
  );
}
