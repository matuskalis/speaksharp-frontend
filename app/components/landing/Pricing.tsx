"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import Link from "next/link";

const features = [
  "Unlimited grammar corrections",
  "Human-like explanations",
  "Personalized learning path",
  "Spaced repetition reviews",
  "Real-time writing feedback",
  "Voice tutor conversations",
  "Progress analytics",
  "All future features",
];

export function Pricing() {
  const [isYearly, setIsYearly] = useState(false);

  const monthlyPrice = 21.99;
  const yearlyPrice = 219.90; // 10 months (2 free)
  const yearlyMonthly = (yearlyPrice / 12).toFixed(2);
  const savings = ((monthlyPrice * 12) - yearlyPrice).toFixed(0);

  return (
    <section id="pricing" className="relative py-32 lg:py-40 bg-dark overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-radial from-accent-purple/10 via-accent-blue/5 to-transparent animate-glow-breathe" />
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-radial from-accent-blue/8 to-transparent blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-radial from-accent-pink/8 to-transparent blur-3xl" />
      </div>

      <div className="relative max-w-container-xl mx-auto px-5 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12 lg:mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dark-200/80 border border-dark-400/50 mb-8"
          >
            <Sparkles className="w-4 h-4 text-accent-purple" />
            <span className="text-sm font-medium text-text-muted">Simple Pricing</span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mb-6 tracking-tight">
            Start Free, Upgrade When Ready
          </h2>
          <p className="text-text-secondary text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed">
            Try everything free for 14 days. No credit card required.
          </p>
        </motion.div>

        {/* Billing Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex justify-center mb-12"
        >
          <div className="inline-flex items-center gap-4 p-1.5 rounded-full bg-dark-200/80 border border-dark-400/50">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                !isYearly
                  ? "bg-gradient-brand text-white shadow-btn-glow"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                isYearly
                  ? "bg-gradient-brand text-white shadow-btn-glow"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              Yearly
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                isYearly ? "bg-white/20" : "bg-success/20 text-success"
              }`}>
                Save ${savings}
              </span>
            </button>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
          {/* Free Trial Card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <div className="h-full gradient-border rounded-2xl">
              <div className="h-full glass rounded-2xl p-8 flex flex-col">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-text-primary mb-2">Free Trial</h3>
                  <p className="text-text-muted text-sm">Full access for 14 days</p>
                </div>

                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl lg:text-5xl font-bold text-text-primary">$0</span>
                  </div>
                  <p className="text-text-muted text-sm mt-2">No credit card required</p>
                </div>

                <ul className="space-y-4 mb-8 flex-1">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <div className="mt-0.5 w-5 h-5 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-success" />
                      </div>
                      <span className="text-text-secondary text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/get-started"
                  className="w-full py-4 rounded-xl border border-dark-400 text-text-primary font-semibold text-center hover:bg-dark-200 hover:border-dark-500 transition-all duration-300"
                >
                  Start Free Trial
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Pro Card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            {/* Popular badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
              <div className="px-4 py-1.5 rounded-full bg-gradient-brand text-white text-xs font-semibold shadow-btn-glow">
                Most Popular
              </div>
            </div>

            <div className="h-full relative">
              {/* Glow effect */}
              <div className="absolute -inset-0.5 rounded-2xl bg-gradient-brand opacity-20 blur-xl" />

              <div className="relative h-full gradient-border rounded-2xl">
                <div className="h-full glass rounded-2xl p-8 flex flex-col bg-dark-100/90">
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-text-primary mb-2">Pro</h3>
                    <p className="text-text-muted text-sm">Everything, forever</p>
                  </div>

                  <div className="mb-8">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl lg:text-5xl font-bold text-text-primary">
                        ${isYearly ? yearlyMonthly : monthlyPrice.toFixed(2)}
                      </span>
                      <span className="text-text-muted">/month</span>
                    </div>
                    {isYearly && (
                      <p className="text-text-muted text-sm mt-2">
                        Billed ${yearlyPrice.toFixed(2)} yearly
                      </p>
                    )}
                    {!isYearly && (
                      <p className="text-text-muted text-sm mt-2">
                        Billed monthly, cancel anytime
                      </p>
                    )}
                  </div>

                  <ul className="space-y-4 mb-8 flex-1">
                    {features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <div className="mt-0.5 w-5 h-5 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-success" />
                        </div>
                        <span className="text-text-secondary text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/get-started"
                    className="w-full py-4 rounded-xl bg-gradient-brand text-white font-semibold text-center shadow-btn-glow hover:shadow-btn-glow-hover transition-all duration-300"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Trust note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center text-text-muted text-sm mt-10"
        >
          Cancel anytime. No questions asked.
        </motion.p>
      </div>
    </section>
  );
}
