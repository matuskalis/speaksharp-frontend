"use client";

import Link from "next/link";
import { useTrialStatus } from "@/hooks/useTrialStatus";
import { Button } from "@/components/ui/button";
import { Clock, Sparkles, Zap, Crown, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

  // Determine banner urgency and messaging
  const isUrgent = trialDaysRemaining <= 3;
  const isWarning = trialDaysRemaining <= 7 && trialDaysRemaining > 3;
  const isFinalDay = trialDaysRemaining === 1;

  const getMessage = () => {
    if (isFinalDay) {
      return {
        main: "Last chance!",
        sub: "Your trial ends today. Don't lose access to premium features.",
        icon: AlertCircle,
      };
    } else if (isUrgent) {
      return {
        main: `Only ${trialDaysRemaining} days left!`,
        sub: "Upgrade now to keep learning without interruption.",
        icon: Clock,
      };
    } else if (isWarning) {
      return {
        main: `${trialDaysRemaining} days left in your trial`,
        sub: "Unlock unlimited access with premium.",
        icon: Zap,
      };
    } else {
      return {
        main: `${trialDaysRemaining} days of premium trial remaining`,
        sub: "Enjoying the features? Upgrade to keep them forever.",
        icon: Sparkles,
      };
    }
  };

  const message = getMessage();
  const Icon = message.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        className={`border-b ${
          isUrgent
            ? "bg-gradient-to-r from-red-50 via-red-100/50 to-red-50 border-red-200"
            : isWarning
            ? "bg-gradient-to-r from-amber-50 via-amber-100/50 to-amber-50 border-amber-200"
            : "bg-gradient-to-r from-blue-50 via-blue-100/50 to-blue-50 border-blue-200"
        }`}
      >
        <div className="max-w-7xl mx-auto px-8 py-3.5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <motion.div
                animate={
                  isUrgent
                    ? {
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0],
                      }
                    : {}
                }
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
              >
                <Icon
                  className={`w-5 h-5 ${
                    isUrgent
                      ? "text-red-600"
                      : isWarning
                      ? "text-amber-600"
                      : "text-blue-600"
                  }`}
                />
              </motion.div>
              <div>
                <p className="text-sm font-semibold text-neutral-900">{message.main}</p>
                <p className="text-xs text-neutral-600">{message.sub}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!isUrgent && (
                <Link href="/#pricing">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-neutral-700 hover:text-neutral-900"
                  >
                    View Plans
                  </Button>
                </Link>
              )}
              <Link href="/#pricing">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="sm"
                    className={`${
                      isUrgent
                        ? "bg-red-600 hover:bg-red-700"
                        : isWarning
                        ? "bg-amber-600 hover:bg-amber-700"
                        : "bg-blue-600 hover:bg-blue-700"
                    } text-white shadow-lg`}
                  >
                    <Crown className="w-4 h-4 mr-1.5" />
                    {isUrgent ? "Upgrade Now" : "Go Premium"}
                  </Button>
                </motion.div>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
