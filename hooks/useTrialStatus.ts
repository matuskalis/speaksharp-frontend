import { useMemo } from "react";
import { useUserProfile } from "./useUserProfile";

export interface TrialStatus {
  hasAccess: boolean;
  isTrialActive: boolean;
  isSubscriptionActive: boolean;
  isTester: boolean;
  trialDaysRemaining: number | null;
  trialEndDate: Date | null;
  subscriptionTier: string | null;
  isTrialExpired: boolean;
  trialProgressPercentage: number;
}

export function useTrialStatus(): TrialStatus {
  const { profile } = useUserProfile();

  return useMemo(() => {
    // FREE ACCESS MODE: Everyone gets full access while we build the user base
    // Payment will be added later once we have users
    // To enable payments again, remove this block and uncomment the code below
    return {
      hasAccess: true, // FREE FOR EVERYONE!
      isTrialActive: false,
      isSubscriptionActive: true, // Treat everyone as subscribed
      isTester: false,
      trialDaysRemaining: null,
      trialEndDate: null,
      subscriptionTier: "free",
      isTrialExpired: false,
      trialProgressPercentage: 0,
    };

    /* PAYMENT CODE - UNCOMMENT WHEN READY TO MONETIZE
    if (!profile) {
      return {
        hasAccess: false,
        isTrialActive: false,
        isSubscriptionActive: false,
        isTester: false,
        trialDaysRemaining: null,
        trialEndDate: null,
        subscriptionTier: null,
        isTrialExpired: false,
        trialProgressPercentage: 0,
      };
    }

    const isTester = profile.is_tester === true;

    if (isTester) {
      return {
        hasAccess: true,
        isTrialActive: false,
        isSubscriptionActive: false,
        isTester: true,
        trialDaysRemaining: null,
        trialEndDate: null,
        subscriptionTier: null,
        isTrialExpired: false,
        trialProgressPercentage: 0,
      };
    }

    const now = new Date();
    const trialStartDate = profile.trial_start_date ? new Date(profile.trial_start_date) : null;
    const trialEndDate = profile.trial_end_date ? new Date(profile.trial_end_date) : null;
    const isTrialActive = trialEndDate ? now < trialEndDate : false;
    const isTrialExpired = trialEndDate ? now >= trialEndDate : false;
    const isSubscriptionActive = profile.subscription_status === "active";

    let trialDaysRemaining: number | null = null;
    let trialProgressPercentage = 0;

    if (trialEndDate) {
      const diffTime = trialEndDate.getTime() - now.getTime();
      trialDaysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

      if (trialStartDate) {
        const totalTrialTime = trialEndDate.getTime() - trialStartDate.getTime();
        const timeElapsed = now.getTime() - trialStartDate.getTime();
        trialProgressPercentage = Math.min(100, Math.max(0, (timeElapsed / totalTrialTime) * 100));
      }
    }

    const hasAccess = isTester || isSubscriptionActive || isTrialActive;

    return {
      hasAccess,
      isTrialActive,
      isSubscriptionActive,
      isTester: false,
      trialDaysRemaining,
      trialEndDate,
      subscriptionTier: profile.subscription_tier,
      isTrialExpired,
      trialProgressPercentage,
    };
    */
  }, [profile]);
}
