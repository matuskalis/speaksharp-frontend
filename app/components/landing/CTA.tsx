"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function CTA() {
  return (
    <section className="relative py-24 lg:py-32 bg-dark overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-accent-purple/12 via-accent-blue/6 to-transparent blur-3xl" />
      </div>

      <div className="relative max-w-container mx-auto px-5 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          {/* Headline */}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text-primary mb-6 tracking-tight">
            Ready to improve your English?
          </h2>

          {/* Subtext */}
          <p className="text-text-secondary text-lg mb-10 max-w-md mx-auto">
            Start your free 14-day trial today.
          </p>

          {/* CTA Button */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <Link
              href="/get-started"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-brand text-white font-semibold rounded-xl transition-all duration-300 shadow-btn-glow hover:shadow-btn-glow-hover"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
