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
  Cpu,
  MessageSquare,
  Zap,
  Check,
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
      aiBenefit: "Spaced repetition powered by adaptive AI scheduling",
      route: "/review",
      time: "5-10 min",
    },
    {
      id: "lesson" as SessionStep,
      title: "Lesson",
      icon: BookOpen,
      description: "Learn new grammar concepts",
      aiBenefit: "Personalized grammar lessons based on your errors",
      route: "/lessons",
      time: "5-10 min",
    },
    {
      id: "scenario" as SessionStep,
      title: "Scenario",
      icon: Drama,
      description: "Practice real conversations",
      aiBenefit: "Real-world conversations with AI correction engine",
      route: "/scenarios",
      time: "10-15 min",
    },
    {
      id: "drill" as SessionStep,
      title: "Drill",
      icon: Dumbbell,
      description: "Speaking or writing exercise",
      aiBenefit: "Targeted practice for your weakest skills",
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
      {/* Full-Bleed Hero Section */}
      <div className="-mx-8 bg-gradient-to-b from-deep-blue-900 to-charcoal-900 text-white py-32 mb-32">
        <div className="max-w-container mx-auto px-8 text-center">
          <h1 className="text-7xl font-bold mb-6 tracking-tight">
            The First AI Tutor Built for Real Fluency
          </h1>
          <p className="text-xl text-deep-blue-100 max-w-2xl mx-auto mb-12">
            Precision-trained conversational AI that adapts to your speech, thinking, and goals
          </p>
          <Button
            size="lg"
            onClick={() => handleStepClick("review", "/review")}
            className="text-base font-semibold px-8 py-3 bg-white text-deep-blue-900 hover:bg-deep-blue-50"
          >
            Start Your Session
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* AI Positioning - Three Pillars */}
      <div className="mb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center">
            <div className="w-16 h-16 rounded-xl bg-deep-blue-50 flex items-center justify-center mx-auto mb-6">
              <Zap className="w-8 h-8 text-deep-blue-600" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-semibold text-charcoal-900 mb-3">AI-Precision Feedback</h3>
            <p className="text-base text-charcoal-600 leading-relaxed">
              Instant corrections powered by advanced linguistic models
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 rounded-xl bg-deep-blue-50 flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="w-8 h-8 text-deep-blue-600" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-semibold text-charcoal-900 mb-3">Adaptive Speaking Engine</h3>
            <p className="text-base text-charcoal-600 leading-relaxed">
              Personalized conversation practice that matches your level
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 rounded-xl bg-deep-blue-50 flex items-center justify-center mx-auto mb-6">
              <Cpu className="w-8 h-8 text-deep-blue-600" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-semibold text-charcoal-900 mb-3">Human-Level Corrections</h3>
            <p className="text-base text-charcoal-600 leading-relaxed">
              Grammar, vocabulary, and fluency feedback in real-time
            </p>
          </div>
        </div>
      </div>

      {/* Your Daily Practice Header */}
      <div className="text-center mb-20">
        <h2 className="text-5xl font-bold text-charcoal-900 mb-6">Your Daily Practice</h2>
        <p className="text-lg text-charcoal-600 max-w-2xl mx-auto">
          Each activity uses AI to personalize your learning path
        </p>
      </div>

      {/* Progress Indicator - Clean and minimal */}
      <div className="mb-20">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-charcoal-500">Session Progress</span>
          <span className="text-sm text-charcoal-400">
            {completedSteps.size} of {steps.length} completed
          </span>
        </div>
        <div className="w-full bg-charcoal-100 rounded-full h-1.5">
          <div
            className="h-1.5 rounded-full bg-deep-blue-600 transition-all duration-700 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Activity Cards - With AI Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-32">
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
                <h3 className="text-2xl font-semibold text-charcoal-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-base text-charcoal-600 leading-relaxed mb-3">
                  {step.description}
                </p>
                <div className="flex items-start gap-2">
                  <Cpu className="w-4 h-4 text-deep-blue-600 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                  <p className="text-sm text-deep-blue-700 italic">
                    {step.aiBenefit}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-charcoal-500">{step.time}</span>
                {!isLocked && !isCompleted && (
                  <div className="flex items-center gap-2 text-deep-blue-600 font-medium text-sm">
                    <span>Start</span>
                    <ArrowRight className="w-4 h-4" strokeWidth={2} />
                  </div>
                )}
                {isCompleted && (
                  <span className="text-sm text-deep-blue-600 font-medium flex items-center gap-1">
                    <Check className="w-4 h-4" />
                    Complete
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Social Proof */}
      <div className="bg-charcoal-50 -mx-8 px-8 py-24 mb-32">
        <div className="max-w-container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-charcoal-900 mb-4">Trusted by learners worldwide</h2>
            <p className="text-lg text-charcoal-600">Used by students in 32 countries</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-charcoal-200 rounded-xl p-8">
              <p className="text-base text-charcoal-700 leading-relaxed mb-6">
                "This is the first AI tutor that actually corrects my grammar like a real teacher. The feedback is instant and precise."
              </p>
              <p className="text-sm text-charcoal-600 font-medium">— Maria, Spain</p>
            </div>

            <div className="bg-white border border-charcoal-200 rounded-xl p-8">
              <p className="text-base text-charcoal-700 leading-relaxed mb-6">
                "I've tried every language app. Vorex is different - it adapts to my mistakes and actually helps me improve."
              </p>
              <p className="text-sm text-charcoal-600 font-medium">— Takeshi, Japan</p>
            </div>

            <div className="bg-white border border-charcoal-200 rounded-xl p-8">
              <p className="text-base text-charcoal-700 leading-relaxed mb-6">
                "The AI understands context and gives me corrections I can actually use. It's like having a tutor 24/7."
              </p>
              <p className="text-sm text-charcoal-600 font-medium">— Luis, Brazil</p>
            </div>
          </div>
        </div>
      </div>

      {/* What Powers Vorex */}
      <div className="mb-32">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-charcoal-900 mb-4">What Powers Vorex</h2>
          <p className="text-lg text-charcoal-600 max-w-2xl mx-auto">
            Trained on advanced linguistic models built for spoken English mastery
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white border border-charcoal-200 rounded-xl p-8">
            <h3 className="text-xl font-semibold text-charcoal-900 mb-3">Pronunciation Engine</h3>
            <p className="text-base text-charcoal-600 leading-relaxed">
              Real-time analysis of speech patterns with phonetic-level correction
            </p>
          </div>

          <div className="bg-white border border-charcoal-200 rounded-xl p-8">
            <h3 className="text-xl font-semibold text-charcoal-900 mb-3">Semantic Correction</h3>
            <p className="text-base text-charcoal-600 leading-relaxed">
              Context-aware grammar and vocabulary feedback that understands meaning
            </p>
          </div>

          <div className="bg-white border border-charcoal-200 rounded-xl p-8">
            <h3 className="text-xl font-semibold text-charcoal-900 mb-3">Personalized Pacing</h3>
            <p className="text-base text-charcoal-600 leading-relaxed">
              Adaptive difficulty that matches your current level and learning speed
            </p>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-deep-blue-900 -mx-8 px-8 py-24 text-white">
        <div className="max-w-container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Pro Fluency Plan</h2>
          <p className="text-xl text-deep-blue-100 mb-12 max-w-xl mx-auto">
            Unlimited access to all features
          </p>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-12 max-w-md mx-auto mb-12">
            <div className="mb-8">
              <span className="text-5xl font-bold">$29</span>
              <span className="text-deep-blue-100">/month</span>
            </div>

            <div className="space-y-4 mb-8 text-left">
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-deep-blue-300 flex-shrink-0" />
                <span className="text-base">Unlimited AI tutoring sessions</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-deep-blue-300 flex-shrink-0" />
                <span className="text-base">Personalized error tracking</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-deep-blue-300 flex-shrink-0" />
                <span className="text-base">Advanced pronunciation feedback</span>
              </div>
            </div>

            <Button
              size="lg"
              onClick={() => router.push("/profile")}
              className="w-full text-base font-semibold px-8 py-3 bg-white text-deep-blue-900 hover:bg-deep-blue-50"
            >
              Get Started
            </Button>
          </div>

          <p className="text-sm text-deep-blue-200">7-day money-back guarantee</p>
        </div>
      </div>
    </div>
  );
}

// Helper function for className composition
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
