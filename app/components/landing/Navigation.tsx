"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Menu, X, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-dark/70 backdrop-blur-2xl border-b border-white/[0.06] shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-container-xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="group flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center shadow-btn-glow group-hover:shadow-btn-glow-hover transition-shadow duration-300">
                <span className="text-white font-bold text-lg">V</span>
              </div>
              <span className="text-text-primary font-semibold text-xl tracking-tight">
                Vorex
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="relative text-text-muted hover:text-text-primary transition-colors duration-300 text-sm font-medium group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-brand group-hover:w-full transition-all duration-300" />
                </a>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-4">
              {user ? (
                <Link
                  href="/learn"
                  className="group inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-brand hover:bg-gradient-brand-hover text-white text-sm font-semibold rounded-xl transition-all duration-300 shadow-btn-glow hover:shadow-btn-glow-hover hover:scale-[1.02]"
                >
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/sign-in"
                    className="text-text-muted hover:text-text-primary transition-colors duration-300 text-sm font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/get-started"
                    className="group inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-brand hover:bg-gradient-brand-hover text-white text-sm font-semibold rounded-xl transition-all duration-300 shadow-btn-glow hover:shadow-btn-glow-hover hover:scale-[1.02]"
                  >
                    Start Free Trial
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-text-primary hover:bg-dark-300/50 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-md z-40 lg:hidden"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="fixed top-0 right-0 bottom-0 w-[300px] bg-dark-100/95 backdrop-blur-2xl border-l border-white/[0.06] z-50 lg:hidden"
            >
              <div className="flex flex-col h-full p-6">
                {/* Close Button */}
                <div className="flex justify-end mb-10">
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 text-text-muted hover:text-text-primary transition-colors rounded-lg hover:bg-dark-300/50"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Links */}
                <div className="flex flex-col gap-2">
                  {navLinks.map((link, index) => (
                    <motion.a
                      key={link.label}
                      href={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.4 }}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="px-4 py-3 text-text-secondary hover:text-text-primary hover:bg-dark-300/50 rounded-xl transition-all duration-300 font-medium text-lg"
                    >
                      {link.label}
                    </motion.a>
                  ))}
                </div>

                {/* CTAs */}
                <div className="mt-auto space-y-4">
                  {user ? (
                    <Link
                      href="/learn"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-gradient-brand text-white font-semibold rounded-xl shadow-btn-glow"
                    >
                      Go to Dashboard
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <>
                      <Link
                        href="/sign-in"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block w-full text-center px-4 py-3 text-text-secondary hover:text-text-primary transition-colors font-medium"
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/get-started"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-gradient-brand text-white font-semibold rounded-xl shadow-btn-glow"
                      >
                        Start Free Trial
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
