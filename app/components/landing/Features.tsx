"use client";

import { motion } from "framer-motion";

const features = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
      </svg>
    ),
    title: "Human-Like Explanations",
    description: "Not just corrections — context-aware explanations that teach you why, like a real tutor would.",
    gradient: "from-accent-blue to-accent-purple",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
    title: "Personalized Learning",
    description: "Adaptive practice that focuses on your weak spots and builds on your strengths.",
    gradient: "from-accent-purple to-accent-pink",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
    title: "Grammar Memory",
    description: "Spaced repetition keeps your corrections fresh. Review exactly what you need, when you need it.",
    gradient: "from-accent-pink to-accent-cyan",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    title: "Real-Time Practice",
    description: "Write naturally about anything. Get instant feedback that helps you improve with every sentence.",
    gradient: "from-accent-cyan to-accent-blue",
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-32 lg:py-40 bg-dark overflow-hidden">
      {/* Section transition gradient - top */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-dark to-transparent" />

      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Central gradient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[800px] bg-gradient-radial from-accent-purple/10 via-accent-blue/5 to-transparent animate-glow-breathe" />

        {/* Accent orbs */}
        <div className="absolute top-20 left-20 w-[400px] h-[400px] bg-gradient-radial from-accent-blue/8 to-transparent blur-3xl" />
        <div className="absolute bottom-20 right-20 w-[400px] h-[400px] bg-gradient-radial from-accent-pink/8 to-transparent blur-3xl" />
      </div>

      <div className="relative max-w-container-xl mx-auto px-5 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16 lg:mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dark-200/80 border border-dark-400/50 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-gradient-brand animate-pulse" />
            <span className="text-sm font-medium text-text-muted">Powerful Features</span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mb-6 tracking-tight">
            Why Vorex Works
          </h2>
          <p className="text-text-secondary text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed">
            The tools you need to finally master English, powered by AI that understands how you learn.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-5 lg:gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <FeatureCard {...feature} index={index} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Section transition gradient - bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-dark-50 to-transparent" />
    </section>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  gradient,
  index,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  index: number;
}) {
  return (
    <div className="group relative h-full">
      {/* Outer glow on hover */}
      <div className={`absolute -inset-0.5 rounded-2xl bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl`} />

      {/* Card with gradient border */}
      <div className="relative h-full gradient-border rounded-2xl">
        {/* Glass card inner */}
        <div className="relative h-full glass rounded-2xl p-8 lg:p-10 transition-all duration-500 group-hover:bg-dark-100/90">
          {/* Icon container with glow */}
          <div className="relative inline-flex mb-8">
            {/* Icon glow */}
            <div className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-500`} />

            {/* Icon background */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className={`relative p-4 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}
            >
              <span className="text-white">{icon}</span>
            </motion.div>
          </div>

          {/* Content */}
          <h3 className="text-xl lg:text-2xl font-semibold text-text-primary mb-4 tracking-tight">
            {title}
          </h3>
          <p className="text-text-secondary text-base lg:text-lg leading-relaxed">
            {description}
          </p>

          {/* Subtle arrow indicator on hover */}
          <div className="mt-6 flex items-center gap-2 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-sm font-medium">Learn more</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
