"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import OnboardingWizard from "../components/OnboardingWizard";
import GoalSelector from "../components/GoalSelector";
import TimeCommitment from "../components/TimeCommitment";
import InterestsSelector from "../components/InterestsSelector";
import PlacementTest from "../components/PlacementTest";
import AuthForm from "../components/AuthForm";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api-client";

type OnboardingStep = "goals" | "time" | "placement" | "interests" | "auth" | "complete";

export default function GetStartedPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("goals");
  const [formData, setFormData] = useState({
    goals: [] as string[],
    dailyTimeGoal: null as number | null,
    interests: [] as string[],
  });
  const [saving, setSaving] = useState(false);

  const totalSteps = 5;
  const stepIndex = {
    goals: 0,
    time: 1,
    placement: 2,
    interests: 3,
    auth: 4,
    complete: 4,
  };

  const canProceed = () => {
    switch (currentStep) {
      case "goals":
        return formData.goals.length > 0;
      case "time":
        return formData.dailyTimeGoal !== null;
      case "placement":
        return true; // Placement test handles its own completion
      case "interests":
        return formData.interests.length > 0;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStep === "goals") setCurrentStep("time");
    else if (currentStep === "time") setCurrentStep("placement");
    else if (currentStep === "placement") setCurrentStep("interests");
    else if (currentStep === "interests") {
      if (user) {
        completeOnboarding();
      } else {
        setCurrentStep("auth");
      }
    }
  };

  const completeOnboarding = async () => {
    setSaving(true);
    try {
      // Save user preferences to backend
      await apiClient.updateProfile({
        goals: formData.goals,
        daily_time_goal: formData.dailyTimeGoal,
        interests: formData.interests,
        onboarding_completed: true,
      });
      setCurrentStep("complete");
    } catch (error) {
      console.error("Failed to save onboarding data:", error);
    } finally {
      setSaving(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case "goals":
        return (
          <div>
            <GoalSelector
              onSelect={(goals) => setFormData({ ...formData, goals })}
              initialGoals={formData.goals}
            />
            <div className="flex justify-center mt-8">
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="px-8 py-6 text-lg bg-neutral-900 hover:bg-neutral-800 text-white disabled:opacity-50"
              >
                Continue
              </Button>
            </div>
          </div>
        );

      case "time":
        return (
          <div>
            <TimeCommitment
              onSelect={(minutes) => setFormData({ ...formData, dailyTimeGoal: minutes })}
              initialValue={formData.dailyTimeGoal || undefined}
            />
            <div className="flex justify-center mt-8">
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="px-8 py-6 text-lg bg-neutral-900 hover:bg-neutral-800 text-white disabled:opacity-50"
              >
                Continue
              </Button>
            </div>
          </div>
        );

      case "placement":
        return (
          <div>
            <PlacementTest />
            <div className="flex justify-center mt-8">
              <Button
                onClick={handleNext}
                className="px-8 py-6 text-lg bg-neutral-900 hover:bg-neutral-800 text-white"
              >
                Skip for now
              </Button>
            </div>
          </div>
        );

      case "interests":
        return (
          <div>
            <InterestsSelector
              onSelect={(interests) => setFormData({ ...formData, interests })}
              initialInterests={formData.interests}
            />
            <div className="flex justify-center mt-8">
              <Button
                onClick={handleNext}
                disabled={!canProceed() || saving}
                className="px-8 py-6 text-lg bg-neutral-900 hover:bg-neutral-800 text-white disabled:opacity-50"
              >
                {saving ? "Saving..." : user ? "Complete Setup" : "Continue"}
              </Button>
            </div>
          </div>
        );

      case "auth":
        return (
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-semibold text-neutral-900 mb-4">
                Create your account
              </h1>
              <p className="text-lg text-neutral-600">
                Save your progress and start learning
              </p>
            </div>
            <AuthForm />
            <div className="flex justify-center mt-6">
              <Button
                onClick={completeOnboarding}
                disabled={!user || saving}
                className="px-8 py-6 text-lg bg-neutral-900 hover:bg-neutral-800 text-white disabled:opacity-50"
              >
                {saving ? "Saving..." : "Complete Setup"}
              </Button>
            </div>
          </div>
        );

      case "complete":
        return (
          <div className="text-center space-y-8">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-4xl font-semibold text-neutral-900">
              You're all set!
            </h1>
            <p className="text-lg text-neutral-600">
              Let's start your English learning journey
            </p>
            <Button
              onClick={() => router.push("/learn")}
              className="px-8 py-6 text-lg bg-neutral-900 hover:bg-neutral-800 text-white"
            >
              Start Learning
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <OnboardingWizard
      currentStep={stepIndex[currentStep]}
      totalSteps={totalSteps}
    >
      {renderStep()}
    </OnboardingWizard>
  );
}
