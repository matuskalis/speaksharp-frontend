"use client";

import { ReactNode } from "react";

interface OnboardingWizardProps {
  currentStep: number;
  totalSteps: number;
  children: ReactNode;
}

export default function OnboardingWizard({
  currentStep,
  totalSteps,
  children,
}: OnboardingWizardProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress indicator */}
      <div className="w-full py-6 px-8">
        <div className="max-w-md mx-auto flex items-center justify-center gap-2">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className={`h-2 flex-1 rounded-full transition-colors ${
                index < currentStep
                  ? "bg-neutral-900"
                  : index === currentStep
                  ? "bg-neutral-400"
                  : "bg-neutral-200"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-2xl">
          {children}
        </div>
      </div>
    </div>
  );
}
