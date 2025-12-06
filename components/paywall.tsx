"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useUserProfile } from "@/hooks/useUserProfile";
import {
  Lock,
  Check,
  ArrowRight,
  Crown,
  MessageCircle,
  Mic,
  TrendingUp,
  Zap,
  Users,
  Gift,
  Copy,
  CheckCircle,
} from "lucide-react";

interface PaywallProps {
  variant?: "full" | "soft";
  onClose?: () => void;
}

export function Paywall({ variant = "full", onClose }: PaywallProps) {
  const { profile } = useUserProfile();
  const [referralCodeCopied, setReferralCodeCopied] = useState(false);

  // Mock referral code - in real app, this would come from API
  const referralCode = profile?.user_id?.slice(0, 8).toUpperCase() || "DEMO1234";

  const handleCopyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    setReferralCodeCopied(true);
    setTimeout(() => setReferralCodeCopied(false), 2000);
  };

  const premiumFeatures = [
    {
      icon: MessageCircle,
      title: "Unlimited AI Conversations",
      description: "Practice with AI tutor anytime, anywhere",
    },
    {
      icon: Mic,
      title: "Real-time Voice Feedback",
      description: "Perfect your pronunciation with instant corrections",
    },
    {
      icon: TrendingUp,
      title: "Advanced Analytics",
      description: "Track your progress with detailed insights",
    },
    {
      icon: Zap,
      title: "Personalized Learning Path",
      description: "AI-powered curriculum tailored to your goals",
    },
  ];

  if (variant === "soft") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-electric-50 to-electric-100/50 border-2 border-electric-200 rounded-2xl p-6 mb-6"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-electric-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Crown className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-neutral-900 mb-1">
              Premium Feature
            </h3>
            <p className="text-sm text-neutral-600 mb-4">
              Upgrade to premium to unlock this feature and continue your learning journey.
            </p>
            <div className="flex gap-3">
              <Link href="/#pricing">
                <Button className="bg-electric-600 hover:bg-electric-700 text-white">
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade to Premium
                </Button>
              </Link>
              {onClose && (
                <Button variant="outline" onClick={onClose}>
                  Go Back
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-white flex items-center justify-center p-4 md:p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto w-full py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-electric-100 to-electric-200 mb-6 shadow-lg">
            <Crown className="w-10 h-10 text-electric-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-neutral-900 mb-4">
            Your Free Trial Has Ended
          </h1>
          <p className="text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto">
            Continue your English learning journey with full access to all premium features
          </p>
        </motion.div>

        {/* Premium Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-neutral-50 border-2 border-neutral-200 rounded-2xl p-6 md:p-8 mb-6"
        >
          <h2 className="text-2xl font-serif font-semibold text-neutral-900 mb-6 text-center">
            What You'll Keep With Premium
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {premiumFeatures.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + idx * 0.1 }}
                  className="flex items-start gap-3 p-4 bg-white rounded-xl border border-neutral-200"
                >
                  <div className="w-10 h-10 bg-electric-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-electric-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-1">{feature.title}</h3>
                    <p className="text-sm text-neutral-600">{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Additional benefits */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-6 border-t border-neutral-200">
            {[
              "Priority support",
              "Offline access",
              "Custom lessons",
              "Advanced analytics",
              "Certificates",
              "Community access",
            ].map((benefit, idx) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + idx * 0.05 }}
                className="flex items-center gap-2"
              >
                <Check className="w-4 h-4 text-electric-600 flex-shrink-0" />
                <span className="text-sm text-neutral-700">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Referral Extension Option */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-amber-50 to-amber-100/50 border-2 border-amber-200 rounded-2xl p-6 mb-6"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-neutral-900 mb-2">
                Get 7 Extra Days Free!
              </h3>
              <p className="text-sm text-neutral-700 mb-4">
                Share Vorex with friends and get 7 additional days of premium access for each
                friend who signs up using your referral code.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 flex items-center gap-2 bg-white rounded-lg px-4 py-2 border-2 border-amber-300">
                  <Users className="w-4 h-4 text-amber-600" />
                  <span className="font-mono font-bold text-neutral-900">{referralCode}</span>
                  <button
                    onClick={handleCopyReferralCode}
                    className="ml-auto text-amber-600 hover:text-amber-700"
                  >
                    {referralCodeCopied ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <Button
                  variant="outline"
                  className="border-amber-300 text-amber-700 hover:bg-amber-50"
                  onClick={handleCopyReferralCode}
                >
                  {referralCodeCopied ? "Copied!" : "Copy Code"}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/#pricing" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-electric-600 hover:bg-electric-700 text-white px-8 py-6 text-lg font-semibold shadow-lg"
            >
              <Crown className="mr-2 w-5 h-5" />
              View Plans & Pricing
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Link href="/" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto px-8 py-6 text-lg border-2"
            >
              Back to Homepage
            </Button>
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center text-sm text-neutral-500"
        >
          Questions?{" "}
          <Link href="/contact" className="text-electric-600 hover:underline font-medium">
            Contact our team
          </Link>
        </motion.p>
      </div>
    </div>
  );
}
