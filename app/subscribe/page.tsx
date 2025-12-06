"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Zap, Trophy, MessageCircle, Mic, BarChart, Star, ChevronRight, Clock } from "lucide-react";

// Stripe Price IDs - use environment variables in production
const STRIPE_PRICE_ID_MONTHLY = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY || "price_monthly";
const STRIPE_PRICE_ID_YEARLY = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_YEARLY || "price_yearly";

const FEATURES = [
  {
    icon: MessageCircle,
    title: "AI Conversation Practice",
    description: "Chat with AI in real-world scenarios",
  },
  {
    icon: Mic,
    title: "Voice & Pronunciation",
    description: "Perfect your accent with AI feedback",
  },
  {
    icon: BarChart,
    title: "Smart Progress Tracking",
    description: "See your improvement in real-time",
  },
  {
    icon: Trophy,
    title: "Personalized Learning Path",
    description: "Lessons tailored to your level and goals",
  },
  {
    icon: Sparkles,
    title: "Spaced Repetition",
    description: "Remember what you learn forever",
  },
  {
    icon: Zap,
    title: "Daily Practice Sessions",
    description: "Quick, effective 5-30 min lessons",
  },
];

const TESTIMONIALS = [
  {
    name: "Maria Santos",
    country: "Brazil",
    avatar: "M",
    quote: "The AI tutor feels like a real teacher. I finally understand my mistakes!",
    rating: 5,
  },
  {
    name: "Kenji Yamamoto",
    country: "Japan",
    avatar: "K",
    quote: "Best investment in my career. My English improved so much in just 3 months.",
    rating: 5,
  },
  {
    name: "Sophie Chen",
    country: "Taiwan",
    avatar: "S",
    quote: "I was nervous about speaking. Now I feel confident in meetings!",
    rating: 5,
  },
];

export default function SubscribePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly" | null>(null);

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
    setLoading(true);
    setSelectedPlan(plan);

    try {
      // Determine the price ID based on the plan
      const priceId = plan === "monthly" ? STRIPE_PRICE_ID_MONTHLY : STRIPE_PRICE_ID_YEARLY;

      // Create checkout session
      const result = await apiClient.createCheckoutSession({
        price_id: priceId,
        success_url: `${window.location.origin}/subscribe/success`,
        cancel_url: `${window.location.origin}/subscribe`,
      });

      // Redirect to Stripe Checkout
      window.location.href = result.checkout_url;
    } catch (error) {
      console.error("Error creating checkout session:", error);
      alert("Failed to start checkout. Please try again.");
      setLoading(false);
      setSelectedPlan(null);
    }
  };

  if (!user) {
    router.push("/get-started");
    return null;
  }

  return (
    <div className="min-h-screen bg-dark overflow-x-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-radial from-accent-purple/15 via-transparent to-transparent blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-radial from-accent-pink/10 via-transparent to-transparent blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 lg:mb-16"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-brand/10 border border-accent-purple/30 mb-6"
          >
            <Sparkles className="w-4 h-4 text-accent-purple" />
            <span className="text-sm font-medium text-accent-purple">Limited Time Offer</span>
          </motion.div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-text-primary mb-4 sm:mb-6 tracking-tight">
            Start Your 7-Day Free Trial
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-text-secondary mb-3 sm:mb-4 max-w-3xl mx-auto">
            Experience the power of AI-powered English learning
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm sm:text-base text-text-muted">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-400" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-400" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-400" />
              <span>Full access during trial</span>
            </div>
          </div>
        </motion.div>

        {/* What's Included Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-12 lg:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary text-center mb-8 lg:mb-10">
            Everything You Need to Master English
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {FEATURES.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                  className="glass gradient-border rounded-2xl p-6 hover:bg-dark-100/90 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-brand flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-text-secondary text-sm">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Pricing Plans */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mb-12 lg:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary text-center mb-8 lg:mb-10">
            Choose Your Plan
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
            {/* Free Trial Card - Highlighted */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="md:col-span-1 relative"
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                <div className="bg-gradient-brand text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-btn-glow flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  START HERE
                </div>
              </div>

              <div className="glass gradient-border rounded-2xl p-6 sm:p-8 h-full border-2 border-accent-purple/50 relative overflow-hidden">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-brand opacity-5" />

                <div className="relative">
                  <div className="mb-6">
                    <div className="text-sm font-semibold text-accent-purple uppercase tracking-wide mb-2">
                      Free Trial
                    </div>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-4xl sm:text-5xl font-bold text-text-primary">$0</span>
                      <span className="text-text-muted">/week</span>
                    </div>
                    <div className="text-text-secondary text-sm">
                      7 days free, then $9.99/month
                    </div>
                  </div>

                  <Button
                    onClick={startFreeTrial}
                    disabled={loading}
                    className="w-full py-6 text-base sm:text-lg bg-gradient-brand hover:opacity-90 text-white mb-6 shadow-btn-glow hover:shadow-btn-glow-hover transition-all font-bold"
                  >
                    {loading ? (
                      "Starting..."
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Start Free Trial
                        <ChevronRight className="w-5 h-5" />
                      </span>
                    )}
                  </Button>

                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-text-secondary text-sm">Full access for 7 days</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-text-secondary text-sm">All premium features</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-text-secondary text-sm">No credit card required</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-text-secondary text-sm">Cancel anytime</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Monthly Plan */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="md:col-span-1"
            >
              <div className="glass gradient-border rounded-2xl p-6 sm:p-8 h-full hover:border-accent-purple/50 transition-all">
                <div className="mb-6">
                  <div className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-2">
                    Monthly
                  </div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl sm:text-5xl font-bold text-text-primary">$9.99</span>
                    <span className="text-text-muted">/month</span>
                  </div>
                  <div className="text-text-secondary text-sm">
                    Billed monthly
                  </div>
                </div>

                <Button
                  onClick={() => selectPlan("monthly")}
                  disabled={loading}
                  className="w-full py-6 text-base sm:text-lg bg-dark-300 hover:bg-dark-200 text-text-primary mb-6 border border-white/[0.08] font-semibold"
                >
                  {loading && selectedPlan === "monthly" ? "Loading..." : "Get Started"}
                </Button>

                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-text-secondary text-sm">Unlimited learning</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-text-secondary text-sm">AI tutor access</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-text-secondary text-sm">Progress tracking</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-text-secondary text-sm">Voice analysis</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Yearly Plan */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="md:col-span-1 relative"
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                <div className="bg-yellow-400 text-dark px-4 py-1.5 rounded-full text-sm font-bold">
                  BEST VALUE
                </div>
              </div>

              <div className="bg-gradient-brand border-2 border-accent-purple rounded-2xl p-6 sm:p-8 h-full text-white shadow-btn-glow">
                <div className="mb-6">
                  <div className="text-sm font-semibold uppercase tracking-wide mb-2 text-white/90">
                    Yearly
                  </div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl sm:text-5xl font-bold">$79.99</span>
                    <span className="text-white/80">/year</span>
                  </div>
                  <div className="text-white/90 text-sm">
                    $6.67/month • Save $40
                  </div>
                </div>

                <Button
                  onClick={() => selectPlan("yearly")}
                  disabled={loading}
                  className="w-full py-6 text-base sm:text-lg bg-white hover:bg-white/90 text-accent-purple mb-6 font-bold"
                >
                  {loading && selectedPlan === "yearly" ? "Loading..." : "Get Started"}
                </Button>

                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Everything in Monthly</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Save 35% annually</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Priority support</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Early feature access</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary text-center mb-8 lg:mb-10">
            Join Thousands of Successful Learners
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {TESTIMONIALS.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 + index * 0.1, duration: 0.5 }}
                className="glass gradient-border rounded-2xl p-6"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-text-secondary text-sm leading-relaxed mb-4">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-brand flex items-center justify-center">
                    <span className="text-white font-bold">{testimonial.avatar}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">{testimonial.name}</p>
                    <p className="text-xs text-text-muted">{testimonial.country}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="text-center"
        >
          <div className="glass gradient-border rounded-2xl p-8 sm:p-12 mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-4">
              Ready to Transform Your English?
            </h2>
            <p className="text-text-secondary text-lg mb-6 max-w-2xl mx-auto">
              Start your 7-day free trial today. No credit card required, cancel anytime.
            </p>
            <Button
              onClick={startFreeTrial}
              disabled={loading}
              className="px-8 py-6 text-lg bg-gradient-brand hover:opacity-90 text-white shadow-btn-glow hover:shadow-btn-glow-hover transition-all font-bold"
            >
              <span className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Start Your Free Trial
              </span>
            </Button>
          </div>

          <button
            onClick={() => router.push("/learn")}
            className="text-text-muted hover:text-text-primary underline text-sm transition-colors"
          >
            Skip for now and explore with limited access
          </button>
        </motion.div>
      </div>
    </div>
  );
}
