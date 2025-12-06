"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import Link from "next/link";

const demoExamples = [
  {
    input: "She don't know where is the library.",
    corrections: [
      { wrong: "don't", correct: "doesn't", explanation: "Use 'doesn't' with she/he/it" },
      { wrong: "where is the library", correct: "where the library is", explanation: "In embedded questions, use statement word order" },
    ],
    corrected: "She doesn't know where the library is.",
  },
  {
    input: "I have been to Paris last year.",
    corrections: [
      { wrong: "have been", correct: "went", explanation: "'Last year' requires simple past, not present perfect" },
    ],
    corrected: "I went to Paris last year.",
  },
  {
    input: "The informations are very useful for me.",
    corrections: [
      { wrong: "informations", correct: "information", explanation: "'Information' is uncountable — no plural form" },
      { wrong: "are", correct: "is", explanation: "Use singular verb with uncountable nouns" },
    ],
    corrected: "The information is very useful for me.",
  },
];

export function GrammarDemo() {
  const [activeExample, setActiveExample] = useState(0);
  const example = demoExamples[activeExample];

  return (
    <section className="relative py-32 lg:py-40 bg-dark overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-radial from-accent-blue/8 via-transparent to-transparent animate-glow-breathe" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-radial from-accent-purple/6 to-transparent blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-radial from-accent-pink/6 to-transparent blur-3xl" />
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
            <span className="text-sm font-medium text-text-muted">Live Demo</span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mb-6 tracking-tight">
            See It in Action
          </h2>
          <p className="text-text-secondary text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed">
            Real corrections. Real explanations. See how Vorex helps you learn.
          </p>
        </motion.div>

        {/* Example Selector */}
        <div className="flex justify-center gap-3 mb-10">
          {demoExamples.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveExample(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                activeExample === index
                  ? "bg-gradient-brand w-10"
                  : "bg-dark-500 hover:bg-dark-600 w-2.5"
              }`}
            />
          ))}
        </div>

        {/* Demo Card */}
        <motion.div
          key={activeExample}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto"
        >
          <div className="gradient-border rounded-2xl">
            <div className="glass rounded-2xl overflow-hidden">
              {/* Input/Output Grid */}
              <div className="grid lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-dark-400/30">
                {/* Input Side */}
                <div className="p-6 lg:p-8">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-2.5 h-2.5 rounded-full bg-error" />
                    <span className="text-sm font-medium text-text-muted">Your Input</span>
                  </div>
                  <p className="text-lg text-text-primary leading-relaxed">
                    {example.input}
                  </p>
                </div>

                {/* Output Side */}
                <div className="p-6 lg:p-8 bg-dark-200/30">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-2.5 h-2.5 rounded-full bg-success" />
                    <span className="text-sm font-medium text-text-muted">Corrected</span>
                  </div>
                  <p className="text-lg text-text-primary leading-relaxed mb-8">
                    {example.corrected}
                  </p>

                  {/* Corrections */}
                  <div className="space-y-4">
                    {example.corrections.map((correction, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + idx * 0.1, duration: 0.4 }}
                        className="flex items-start gap-3"
                      >
                        <div className="mt-1 flex-shrink-0">
                          <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center">
                            <Check className="w-3 h-3 text-success" />
                          </div>
                        </div>
                        <div>
                          <p className="text-sm leading-relaxed">
                            <span className="text-error/80 line-through">{correction.wrong}</span>
                            <span className="text-text-muted mx-2">→</span>
                            <span className="text-success font-medium">{correction.correct}</span>
                          </p>
                          <p className="text-xs text-text-muted mt-1">
                            {correction.explanation}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* CTA Bar */}
              <div className="px-6 lg:px-8 py-5 bg-dark-200/50 border-t border-dark-400/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-text-muted">
                  <Sparkles className="w-5 h-5 text-accent-purple" />
                  <span className="text-sm">Powered by human-like AI understanding</span>
                </div>
                <Link
                  href="/get-started"
                  className="group inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-brand hover:opacity-90 text-white text-sm font-semibold rounded-xl transition-all duration-300 shadow-btn-glow hover:shadow-btn-glow-hover"
                >
                  Try It Yourself
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
