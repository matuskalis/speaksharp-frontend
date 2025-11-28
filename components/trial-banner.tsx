"use client";

import Link from "next/link";
import { useTrialStatus } from "@/hooks/useTrialStatus";
import { Button } from "@/components/ui/button";
import { Clock, Sparkles } from "lucide-react";

export function TrialBanner() {
  const { isTrialActive, trialDaysRemaining, isSubscriptionActive } = useTrialStatus();

  // Don't show banner if user has active subscription
  if (isSubscriptionActive) {
    return null;
  }

  // Don't show banner if no active trial
  if (!isTrialActive || trialDaysRemaining === null) {
    return null;
  }

  // Determine banner color based on days remaining
  const isUrgent = trialDaysRemaining <= 3;
  const isWarning = trialDaysRemaining <= 7 && trialDaysRemaining > 3;

  return (
    <div
      className={`border-b ${
        isUrgent
          ? "bg-red-50 border-red-200"
          : isWarning
          ? "bg-amber-50 border-amber-200"
          : "bg-blue-50 border-blue-200"
      }`}
    >
      <div className="max-w-7xl mx-auto px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {isUrgent || isWarning ? (
              <Clock className={`w-5 h-5 ${isUrgent ? "text-red-600" : "text-amber-600"}`} />
            ) : (
              <Sparkles className="w-5 h-5 text-blue-600" />
            )}
            <p className="text-sm font-medium text-neutral-900">
              {trialDaysRemaining === 1 ? (
                <>
                  <span className="font-semibold">Last day</span> of your free trial
                </>
              ) : (
                <>
                  <span className="font-semibold">{trialDaysRemaining} days left</span> in your
                  free trial
                </>
              )}
            </p>
          </div>
          <Link href="/#pricing">
            <Button
              size="sm"
              className={`${
                isUrgent
                  ? "bg-red-600 hover:bg-red-700"
                  : isWarning
                  ? "bg-amber-600 hover:bg-amber-700"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white`}
            >
              Upgrade Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
