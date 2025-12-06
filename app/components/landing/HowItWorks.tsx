"use client";

import { motion } from "framer-motion";
import { Pencil, Sparkles, TrendingUp } from "lucide-react";

const steps = [
  {
    number: 1,
    icon: <Pencil className="w-7 h-7" strokeWidth={1.5} />,
    title: "Write",
    description: "Type any sentence or paragraph. Express yourself naturally — no prompts needed.",
    gradient: "from-accent-blue to-accent-purple",
  },
  {
    number: 2,
    icon: <Sparkles className="w-7 h-7" strokeWidth={1.5} />,
    title: "Get Feedback",
    description: "AI instantly identifies errors and explains corrections with human-like clarity.",
    gradient: "from-accent-purple to-accent-pink",
  },
  {
    number: 3,
    icon: <TrendingUp className="w-7 h-7" strokeWidth={1.5} />,
    title: "Improve",
    description: "Review your corrections with spaced repetition. Build lasting language skills.",
    gradient: "from-accent-pink to-accent-cyan",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-20 pb-32 lg:py-32 lg:pb-40 bg-dark-50 overflow-hidden">
      {/* Section transition gradient - top */}
      <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-dark to-dark-50" />

      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-gradient-radial from-accent-purple/6 via-transparent to-transparent animate-glow-breathe" />
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-radial from-accent-blue/5 via-transparent to-transparent blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-radial from-accent-pink/5 via-transparent to-transparent blur-3xl" />
      </div>

      <div className="relative max-w-container-xl mx-auto px-5 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16 lg:mb-24"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dark-200/80 border border-dark-400/50 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-gradient-brand animate-pulse" />
            <span className="text-sm font-medium text-text-muted">Simple Process</span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mb-6 tracking-tight">
            How It Works
          </h2>
          <p className="text-text-secondary text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed">
            Three simple steps to transform your English writing
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Desktop: Animated horizontal connector line */}
          <div className="hidden lg:block absolute top-[5.5rem] left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-[2px]">
            {/* Base line */}
            <div className="absolute inset-0 bg-dark-400/30 rounded-full" />

            {/* Animated gradient line */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 bg-gradient-to-r from-accent-blue via-accent-purple to-accent-pink rounded-full origin-left"
            />

            {/* Animated pulse traveling along line */}
            <motion.div
              initial={{ left: "0%", opacity: 0 }}
              animate={{ left: "100%", opacity: [0, 1, 1, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1, ease: "easeInOut" }}
              className="absolute top-1/2 -translate-y-1/2 w-16 h-4 bg-gradient-to-r from-transparent via-white/30 to-transparent blur-sm"
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-12 lg:gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                {/* Mobile: Animated vertical connector line */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden absolute left-[2.75rem] top-28 h-[calc(100%-1rem)] w-[2px]">
                    {/* Base line */}
                    <div className="absolute inset-0 bg-dark-400/30 rounded-full" />

                    {/* Animated gradient */}
                    <motion.div
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.2 + index * 0.2 }}
                      className={`absolute inset-0 bg-gradient-to-b ${step.gradient} rounded-full origin-top`}
                    />
                  </div>
                )}

                <StepCard {...step} index={index} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Section transition gradient - bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-dark to-dark-50" />
    </section>
  );
}

function StepCard({
  number,
  icon,
  title,
  description,
  gradient,
  index,
}: {
  number: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  index: number;
}) {
  return (
    <div className="flex lg:flex-col items-start lg:items-center text-left lg:text-center gap-5 lg:gap-0">
      {/* Step Number Circle */}
      <div className="relative flex-shrink-0 lg:mb-10">
        {/* Outer pulsing ring */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 + index * 0.15 }}
          className={`absolute -inset-3 rounded-full bg-gradient-to-br ${gradient} opacity-20 animate-pulse-ring`}
        />

        {/* Glow effect */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-full blur-xl opacity-40`} />

        {/* Main circle with gradient border */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="relative"
        >
          <div className={`absolute -inset-0.5 rounded-full bg-gradient-to-br ${gradient}`} />
          <div className="relative w-[88px] h-[88px] lg:w-[96px] lg:h-[96px] rounded-full bg-dark-100 flex items-center justify-center">
            <span className="text-white">{icon}</span>
          </div>
        </motion.div>

        {/* Number badge */}
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 + index * 0.15, type: "spring", stiffness: 500 }}
          className="absolute -top-1 -right-1"
        >
          <div className={`w-8 h-8 bg-gradient-to-br ${gradient} rounded-full flex items-center justify-center shadow-lg`}>
            <span className="text-sm font-bold text-white">{number}</span>
          </div>
        </motion.div>
      </div>

      {/* Content */}
      <div className="flex-1 lg:flex-initial">
        <h3 className="text-xl lg:text-2xl font-semibold text-text-primary mb-3 tracking-tight">{title}</h3>
        <p className="text-text-secondary leading-relaxed max-w-sm lg:mx-auto">
          {description}
        </p>
      </div>
    </div>
  );
}
