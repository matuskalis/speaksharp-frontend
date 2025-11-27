"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function PricingSection() {
  const router = useRouter();

  const plans = [
    {
      name: "Starter",
      price: "$19",
      period: "/month",
      description: "For beginners building foundation",
      features: [
        "20 hours/month practice time",
        "47-point error taxonomy",
        "Basic pronunciation feedback",
        "Spaced repetition system",
        "Progress tracking dashboard",
      ],
      cta: "Start Free Trial",
      popular: false,
    },
    {
      name: "Pro",
      price: "$49",
      period: "/month",
      description: "For serious learners advancing levels",
      features: [
        "Unlimited practice time",
        "Full 47-point error analysis",
        "Sub-phoneme pronunciation engine",
        "Adaptive spaced repetition (0.94 recall)",
        "Real-time conversation scenarios",
        "Personalized 90-day roadmap",
        "Priority support",
      ],
      cta: "Start Free Trial",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For institutions and teams",
      features: [
        "Everything in Pro",
        "Custom deployment options",
        "SSO and admin controls",
        "Usage analytics and reporting",
        "Dedicated success manager",
        "API access for integrations",
        "Volume pricing",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ];

  return (
    <div className="py-32 bg-neutral-50 -mx-8 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-6xl font-display font-bold text-neutral-900 mb-6">
            Transparent Pricing
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Choose the plan that matches your learning goals. All plans include 14-day free trial.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-white rounded-2xl p-10 flex flex-col relative ${
                plan.popular
                  ? "border-2 border-electric-500 shadow-2xl scale-105"
                  : "border-2 border-neutral-200"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-electric-500 text-white px-6 py-2 rounded-full text-sm font-semibold uppercase tracking-wide">
                  Most Popular
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-2xl font-display font-bold text-neutral-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-neutral-600 mb-6">{plan.description}</p>

                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-6xl font-display font-bold text-neutral-900">
                    {plan.price}
                  </span>
                  <span className="text-xl text-neutral-600">{plan.period}</span>
                </div>

                {plan.name !== "Enterprise" && (
                  <p className="text-sm text-neutral-500">Billed monthly, cancel anytime</p>
                )}
              </div>

              <ul className="space-y-4 mb-10 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-electric-500 flex-shrink-0 mt-0.5" />
                    <span className="text-neutral-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() =>
                  plan.name === "Enterprise"
                    ? router.push("/contact")
                    : router.push("/signup?plan=" + plan.name.toLowerCase())
                }
                className={`w-full py-4 text-lg font-semibold ${
                  plan.popular
                    ? "bg-electric-500 hover:bg-electric-600 text-white"
                    : "bg-neutral-900 hover:bg-neutral-800 text-white"
                }`}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-neutral-600 mb-6">
            All plans include 14-day free trial • No credit card required • Cancel anytime
          </p>
          <div className="flex items-center justify-center gap-8 text-sm text-neutral-500">
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-electric-500" />
              Money-back guarantee
            </span>
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-electric-500" />
              Secure payment
            </span>
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-electric-500" />
              Student discounts available
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
