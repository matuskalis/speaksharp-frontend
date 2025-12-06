"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Zap, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthFormProps {
  onSuccess?: () => void;
  variant?: "dark" | "light";
  embedded?: boolean;
}

export default function AuthForm({ onSuccess, variant = "dark", embedded = false }: AuthFormProps = {}) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!email || !password) {
      setError("Please enter both email and password");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      if (mode === "signup") {
        const { error } = await signUp(email, password);
        if (error) {
          setError(error.message);
        } else {
          setSuccess("Account created! Check your email to confirm your account, then sign in.");
          setMode("signin");
          setPassword("");
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          setError(error.message);
        } else {
          onSuccess?.();
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Light theme (embedded in onboarding)
  if (variant === "light") {
    return (
      <div className="w-full max-w-md mx-auto">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl"
          >
            <p className="text-red-600 text-sm">{error}</p>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl"
          >
            <p className="text-green-600 text-sm">{success}</p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-600 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white border-2 border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-electric-500 transition-colors disabled:opacity-50"
              placeholder="your@email.com"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-600 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white border-2 border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-electric-500 transition-colors disabled:opacity-50"
              placeholder="••••••••"
              disabled={loading}
            />
            {mode === "signup" && (
              <p className="mt-2 text-xs text-neutral-500">Minimum 6 characters</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-4 bg-electric-500 text-white font-bold rounded-xl disabled:opacity-50 transition-all press-effect"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                {mode === "signin" ? "Sign In" : "Create Account"}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin");
              setError(null);
              setSuccess(null);
            }}
            className="text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
          >
            {mode === "signin"
              ? "Don't have an account? "
              : "Already have an account? "}
            <span className="text-electric-500 font-medium">
              {mode === "signin" ? "Sign up" : "Sign in"}
            </span>
          </button>
        </div>
      </div>
    );
  }

  // Dark theme (standalone page)
  const content = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          {mode === "signin" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="text-text-secondary">
          {mode === "signin"
            ? "Sign in to continue your learning journey"
            : "Start your free trial today"}
        </p>
      </div>

      {/* Form card */}
      <div className="glass gradient-border rounded-2xl p-6">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 p-4 bg-error/10 border border-error/20 rounded-xl"
          >
            <p className="text-error text-sm">{error}</p>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 p-4 bg-success/10 border border-success/20 rounded-xl"
          >
            <p className="text-success text-sm">{success}</p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-dark-200 border border-dark-100 rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple transition-colors disabled:opacity-50"
                placeholder="your@email.com"
                disabled={loading}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-dark-200 border border-dark-100 rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple transition-colors disabled:opacity-50"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>
            {mode === "signup" && (
              <p className="mt-2 text-xs text-text-muted">Minimum 6 characters</p>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-brand text-white font-semibold rounded-xl shadow-btn-glow hover:shadow-btn-glow-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 press-effect"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                {mode === "signin" ? "Sign In" : "Create Account"}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Toggle mode */}
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin");
              setError(null);
              setSuccess(null);
            }}
            className="text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            {mode === "signin"
              ? "Don't have an account? "
              : "Already have an account? "}
            <span className="text-accent-purple font-medium">
              {mode === "signin" ? "Sign up" : "Sign in"}
            </span>
          </button>
        </div>
      </div>

      {/* Trust indicators */}
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-8 text-sm text-text-muted">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span>7-day free trial</span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span>No credit card required</span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span>Cancel anytime</span>
        </div>
      </div>
    </motion.div>
  );

  // If embedded, just return the content
  if (embedded) {
    return content;
  }

  // Full page dark auth
  return (
    <div className="min-h-screen bg-dark flex flex-col">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-radial from-accent-purple/15 via-transparent to-transparent blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-radial from-accent-pink/10 via-transparent to-transparent blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-5">
        <a href="/" className="inline-flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center shadow-btn-glow">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-text-primary font-semibold text-xl">Vorex</span>
        </a>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 pb-12">
        {content}
      </main>
    </div>
  );
}
