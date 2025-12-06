"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);

  return (
    <section ref={containerRef} className="relative min-h-screen bg-dark overflow-hidden">
      {/* Particle field */}
      <div className="particle-field" />

      {/* Cinematic gradient sweep background */}
      <div className="absolute inset-0">
        {/* Main gradient orb - animated */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1400px] h-[1400px]"
          style={{ y }}
        >
          <div className="w-full h-full bg-gradient-radial from-accent-purple/20 via-accent-blue/10 to-transparent animate-glow-breathe" />
        </motion.div>

        {/* Sweeping gradient light */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent-purple/5 to-transparent animate-gradient-sweep" />

        {/* Secondary accent */}
        <div className="absolute top-1/4 right-1/3 w-[600px] h-[600px] bg-gradient-radial from-accent-pink/10 via-transparent to-transparent blur-3xl" />

        {/* Top edge glow */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-purple/30 to-transparent" />
      </div>

      <div
        className="relative max-w-container-xl mx-auto px-5 lg:px-8 pt-36 pb-20 lg:pt-44 lg:pb-32"
      >
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text Stack */}
          <div className="text-center lg:text-left">
            {/* Logo - larger and tighter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-4 mb-8"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-brand rounded-2xl blur-xl opacity-50 animate-pulse-ring" />
                <div className="relative w-14 h-14 rounded-2xl bg-gradient-brand flex items-center justify-center shadow-btn-glow">
                  <span className="text-white font-bold text-2xl">V</span>
                </div>
              </div>
              <span className="text-text-primary font-semibold text-2xl tracking-tight">Vorex</span>
            </motion.div>

            {/* Headline - stronger hierarchy */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-[2.75rem] sm:text-5xl lg:text-6xl xl:text-[4.25rem] font-bold text-text-primary leading-[1.08] tracking-tight mb-6"
            >
              The First{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-brand bg-clip-text text-transparent bg-[length:200%_200%] animate-gradient-sweep">
                  Human-Like
                </span>
                {/* Underline glow */}
                <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-gradient-brand rounded-full opacity-60" />
              </span>
              <br className="hidden sm:block" />
              AI English Tutor
            </motion.h1>

            {/* Subcopy - tighter spacing */}
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg sm:text-xl text-text-secondary mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed"
            >
              Write naturally. Get instant corrections with human-quality explanations that actually help you improve.
            </motion.p>

            {/* CTAs - refined buttons */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link
                href="/get-started"
                className="group relative inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-gradient-brand text-white font-semibold rounded-xl overflow-hidden transition-all duration-300 shadow-btn-glow hover:shadow-btn-glow-hover press-effect"
              >
                {/* Shimmer effect */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative">Start Free Trial</span>
                <ArrowRight className="relative w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
              </Link>

              <button className="group inline-flex items-center justify-center gap-3 px-6 py-3.5 text-text-secondary hover:text-text-primary transition-colors duration-300">
                <span className="relative">
                  <span className="absolute inset-0 bg-gradient-brand rounded-full opacity-20 group-hover:opacity-30 transition-opacity" />
                  <span className="relative w-10 h-10 flex items-center justify-center">
                    <Play className="w-4 h-4 ml-0.5" />
                  </span>
                </span>
                <span className="font-medium">Watch Demo</span>
              </button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex items-center gap-6 mt-10 justify-center lg:justify-start"
            >
              <div className="flex items-center gap-2 text-sm text-text-muted">
                <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>7-day free trial</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-text-muted">
                <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>No credit card</span>
              </div>
            </motion.div>
          </div>

          {/* Right: Premium Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <PhoneMockup scrollProgress={scrollYProgress} />
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-dark via-dark/90 to-transparent pointer-events-none" />
    </section>
  );
}

function PhoneMockup({ scrollProgress }: { scrollProgress: any }) {
  const y = useTransform(scrollProgress, [0, 1], [0, 80]);
  const rotate = useTransform(scrollProgress, [0, 1], [0, 3]);

  return (
    <div className="relative mx-auto max-w-[300px] lg:max-w-[320px]">
      {/* Large backlight glow */}
      <div className="absolute -inset-20 bg-gradient-radial from-accent-purple/30 via-accent-blue/15 to-transparent blur-3xl animate-glow-breathe" />

      {/* Floating UI elements with parallax */}
      <motion.div
        animate={{ y: [-6, 6, -6] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-6 top-24 z-20"
      >
        <div className="glass gradient-border rounded-2xl px-4 py-3 shadow-card-elevated">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-success to-emerald-400 flex items-center justify-center shadow-lg shadow-success/25">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-[11px] text-text-muted font-medium">Grammar</p>
              <p className="text-sm font-semibold text-success">+3 Fixed</p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [4, -4, 4] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute -right-2 bottom-36 z-20"
      >
        <div className="glass gradient-border rounded-2xl px-4 py-3 shadow-card-elevated">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center shadow-lg shadow-accent-purple/25">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <p className="text-[11px] text-text-muted font-medium">Level Up</p>
              <p className="text-sm font-semibold text-text-primary">B1 → B2</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Phone frame with parallax */}
      <motion.div
        style={{ y, rotate }}
        className="relative transform-gpu"
      >
        {/* Outer glow ring */}
        <div className="absolute -inset-[2px] rounded-[3.2rem] bg-gradient-to-b from-white/10 via-white/5 to-transparent" />

        {/* Phone body */}
        <div className="relative bg-gradient-to-b from-dark-300 to-dark-400 rounded-[3rem] p-[3px] shadow-card-elevated">
          <div className="bg-dark-200 rounded-[2.85rem] p-3">
            {/* Dynamic island / notch */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[100px] h-[28px] bg-black rounded-full z-10 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-dark-700" />
            </div>

            {/* Screen */}
            <div className="bg-dark-50 rounded-[2.5rem] overflow-hidden relative">
              {/* Screen reflection */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-transparent pointer-events-none z-10" />

              {/* Status bar */}
              <div className="flex justify-between items-center px-8 py-3.5 text-text-primary text-xs font-semibold">
                <span>9:41</span>
                <div className="flex items-center gap-1.5">
                  <div className="flex gap-[2px]">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className={`w-[3px] rounded-sm bg-text-primary ${i === 4 ? 'h-3' : `h-${i + 1}`}`} style={{ height: `${6 + i * 2}px` }} />
                    ))}
                  </div>
                  <svg className="w-4 h-2.5" viewBox="0 0 17 10" fill="currentColor">
                    <rect x="0" y="0" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1" fill="none" />
                    <rect x="2" y="2" width="10" height="6" rx="1" fill="currentColor" />
                    <rect x="15" y="3" width="2" height="4" rx="0.5" fill="currentColor" />
                  </svg>
                </div>
              </div>

              {/* App content */}
              <div className="px-5 pb-20 pt-1 space-y-4">
                {/* App header */}
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-brand flex items-center justify-center shadow-btn-glow">
                    <span className="text-white font-bold text-sm">V</span>
                  </div>
                  <div>
                    <span className="text-text-primary font-semibold text-sm">AI Tutor</span>
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                      <span className="text-[10px] text-success">Online</span>
                    </div>
                  </div>
                </div>

                {/* User message bubble */}
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="flex justify-end"
                >
                  <div className="relative max-w-[85%]">
                    <div className="absolute inset-0 bg-gradient-brand rounded-2xl rounded-br-md blur-lg opacity-30" />
                    <div className="relative bg-gradient-brand rounded-2xl rounded-br-md px-4 py-3 shadow-lg">
                      <p className="text-white text-[13px] leading-relaxed">
                        I goed to the store yesterday and buyed some foods.
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* AI response */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3, duration: 0.5 }}
                  className="space-y-3"
                >
                  <div className="glass gradient-border rounded-2xl rounded-bl-md px-4 py-3">
                    <p className="text-text-secondary text-[13px] mb-2 leading-relaxed">
                      Great effort! Here's the corrected version:
                    </p>
                    <p className="text-[13px] leading-relaxed">
                      <span className="text-error/80 line-through">goed</span>{" "}
                      <span className="text-success font-semibold">went</span>
                      <span className="text-text-dim mx-1">/</span>
                      <span className="text-error/80 line-through">buyed</span>{" "}
                      <span className="text-success font-semibold">bought</span>
                      <span className="text-text-dim mx-1">/</span>
                      <span className="text-error/80 line-through">foods</span>{" "}
                      <span className="text-success font-semibold">food</span>
                    </p>
                  </div>

                  {/* Tip card */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.8, duration: 0.4 }}
                    className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl px-4 py-3"
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-amber-400 mt-0.5">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                        </svg>
                      </span>
                      <div>
                        <p className="text-amber-400 text-[11px] font-semibold mb-0.5">Quick Tip</p>
                        <p className="text-amber-200/80 text-[11px] leading-relaxed">
                          "Go" and "buy" are irregular verbs with unique past forms.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom shadow for depth */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[80%] h-8 bg-gradient-radial from-black/40 to-transparent blur-xl" />
      </motion.div>
    </div>
  );
}
