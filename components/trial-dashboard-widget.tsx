"use client";

import { useTrialStatus } from "@/hooks/useTrialStatus";
import { useUserProfile } from "@/hooks/useUserProfile";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Sparkles,
  Check,
  Lock,
  Crown,
  Zap,
  MessageCircle,
  Mic,
  TrendingUp,
  Gift,
} from "lucide-react";

export function TrialDashboardWidget() {
  const { isTrialActive, trialDaysRemaining, isSubscriptionActive, trialEndDate } = useTrialStatus();
  const { profile } = useUserProfile();

  // Don't show if user has active subscription
  if (isSubscriptionActive || !profile) {
    return null;
  }

  // Don't show if no trial data
  if (!isTrialActive || trialDaysRemaining === null) {
    return null;
  }

  const totalTrialDays = 14; // Assuming 14-day trial
  const daysUsed = totalTrialDays - trialDaysRemaining;
  const progressPercentage = (daysUsed / totalTrialDays) * 100;

  const premiumFeatures = [
    {
      icon: MessageCircle,
      title: "Unlimited AI Conversations",
      description: "Practice with AI tutor anytime",
      used: true,
    },
    {
      icon: Mic,
      title: "Voice Practice",
      description: "Real-time pronunciation feedback",
      used: true,
    },
    {
      icon: TrendingUp,
      title: "Advanced Analytics",
      description: "Track your progress in detail",
      used: false,
    },
    {
      icon: Zap,
      title: "Personalized Learning Path",
      description: "AI-powered curriculum",
      used: true,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass gradient-border rounded-2xl p-5 mb-5"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center shadow-btn-glow">
            <Crown className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-text-primary">Free Trial</h3>
            <p className="text-xs text-text-secondary">
              {trialDaysRemaining} {trialDaysRemaining === 1 ? "day" : "days"} remaining
            </p>
          </div>
        </div>
        <Link href="/#pricing">
          <Button
            size="sm"
            className="bg-gradient-brand text-white shadow-btn-glow hover:shadow-btn-glow-hover"
          >
            Upgrade
          </Button>
        </Link>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-text-secondary">Trial Progress</span>
          <span className="text-xs font-semibold text-text-primary">
            Day {daysUsed + 1} of {totalTrialDays}
          </span>
        </div>
        <div className="h-2.5 bg-dark-300 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full bg-gradient-brand rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]"
          />
        </div>
      </div>

      {/* Features You've Used */}
      <div className="space-y-3 mb-4">
        <p className="text-sm font-semibold text-text-primary">Premium Features</p>
        <div className="grid grid-cols-1 gap-2">
          {premiumFeatures.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`flex items-start gap-3 p-3 rounded-xl ${
                  feature.used
                    ? "bg-accent-purple/10 border border-accent-purple/20"
                    : "bg-dark-200/50 border border-white/[0.06]"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    feature.used
                      ? "bg-accent-purple/20 text-accent-purple"
                      : "bg-dark-300 text-text-muted"
                  }`}
                >
                  {feature.used ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary">{feature.title}</p>
                  <p className="text-xs text-text-muted">{feature.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="pt-4 border-t border-white/[0.06]">
        <div className="flex items-start gap-3 mb-3">
          <Gift className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-text-primary mb-1">
              Keep Learning Without Limits
            </p>
            <p className="text-xs text-text-secondary leading-relaxed">
              Upgrade now to continue enjoying all premium features after your trial ends.
            </p>
          </div>
        </div>
        <Link href="/#pricing">
          <Button className="w-full bg-gradient-brand text-white shadow-btn-glow hover:shadow-btn-glow-hover">
            <Crown className="w-4 h-4 mr-2" />
            View Premium Plans
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
