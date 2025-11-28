import { useMemo } from "react";
import { useUserProfile } from "./useUserProfile";

export interface TrialStatus {
  hasAccess: boolean;
  isTrialActive: boolean;
  isSubscriptionActive: boolean;
  trialDaysRemaining: number | null;
  trialEndDate: Date | null;
  subscriptionTier: string | null;
}

export function useTrialStatus(): TrialStatus {
  const { profile } = useUserProfile();

  return useMemo(() => {
    if (!profile) {
      return {
        hasAccess: false,
        isTrialActive: false,
        isSubscriptionActive: false,
        trialDaysRemaining: null,
        trialEndDate: null,
        subscriptionTier: null,
      };
    }

    const now = new Date();
    const trialEndDate = profile.trial_end_date ? new Date(profile.trial_end_date) : null;
    const isTrialActive = trialEndDate ? now < trialEndDate : false;
    const isSubscriptionActive = profile.subscription_status === "active";

    let trialDaysRemaining: number | null = null;
    if (isTrialActive && trialEndDate) {
      const diffTime = trialEndDate.getTime() - now.getTime();
      trialDaysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    return {
      hasAccess: isTrialActive || isSubscriptionActive,
      isTrialActive,
      isSubscriptionActive,
      trialDaysRemaining,
      trialEndDate,
      subscriptionTier: profile.subscription_tier,
    };
  }, [profile]);
}
