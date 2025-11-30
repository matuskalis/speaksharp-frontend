"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export default function SubscribePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const startFreeTrial = async () => {
    setLoading(true);
    try {
      // Trial is already initialized during onboarding
      // Just redirect to learning center
      router.push("/learn");
    } finally {
      setLoading(false);
    }
  };

  const selectPlan = async (plan: "monthly" | "yearly") => {
    // TODO: Implement Stripe checkout
    console.log("Selected plan:", plan);
    router.push("/learn");
  };

  if (!user) {
    router.push("/get-started");
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6">
      <div className="max-w-5xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-neutral-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-neutral-600">
            Start your 14-day free trial • No credit card required
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Free Trial Card */}
          <div className="bg-white border-2 border-neutral-200 rounded-2xl p-8 hover:border-electric-400 transition-all">
            <div className="mb-6">
              <div className="text-sm font-semibold text-electric-600 uppercase tracking-wide mb-2">
                Free Trial
              </div>
              <div className="text-5xl font-bold text-neutral-900 mb-2">
                $0
              </div>
              <div className="text-neutral-600">
                14 days, then $19/month
              </div>
            </div>

            <Button
              onClick={startFreeTrial}
              disabled={loading}
              className="w-full py-6 text-lg bg-electric-500 hover:bg-electric-600 text-white mb-6"
            >
              {loading ? "Starting..." : "Start Free Trial"}
            </Button>

            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-neutral-700">Full access for 14 days</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-neutral-700">All learning features</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-neutral-700">Cancel anytime</span>
              </div>
            </div>
          </div>

          {/* Monthly Plan */}
          <div className="bg-white border-2 border-neutral-200 rounded-2xl p-8 hover:border-electric-400 transition-all">
            <div className="mb-6">
              <div className="text-sm font-semibold text-neutral-600 uppercase tracking-wide mb-2">
                Monthly
              </div>
              <div className="text-5xl font-bold text-neutral-900 mb-2">
                $19
              </div>
              <div className="text-neutral-600">
                per month
              </div>
            </div>

            <Button
              onClick={() => selectPlan("monthly")}
              disabled={loading}
              className="w-full py-6 text-lg bg-neutral-900 hover:bg-neutral-800 text-white mb-6"
            >
              Get Started
            </Button>

            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-neutral-700">Unlimited learning</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-neutral-700">AI tutor access</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-neutral-700">Progress tracking</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-neutral-700">Pronunciation analysis</span>
              </div>
            </div>
          </div>

          {/* Yearly Plan (Most Popular) */}
          <div className="bg-electric-500 border-2 border-electric-600 rounded-2xl p-8 relative text-white">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-neutral-900 px-4 py-1 rounded-full text-sm font-bold">
              BEST VALUE
            </div>

            <div className="mb-6">
              <div className="text-sm font-semibold uppercase tracking-wide mb-2 text-white/90">
                Yearly
              </div>
              <div className="text-5xl font-bold mb-2">
                $149
              </div>
              <div className="text-white/90">
                $12.42/month • Save $79
              </div>
            </div>

            <Button
              onClick={() => selectPlan("yearly")}
              disabled={loading}
              className="w-full py-6 text-lg bg-white hover:bg-neutral-100 text-electric-600 mb-6 font-semibold"
            >
              Get Started
            </Button>

            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>Everything in Monthly</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>Save 35% annually</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>Priority support</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>Early feature access</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => router.push("/learn")}
            className="text-neutral-600 hover:text-neutral-900 underline"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
