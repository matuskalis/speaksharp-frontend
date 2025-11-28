"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Lock, Check, ArrowRight } from "lucide-react";

export function Paywall() {
  return (
    <div className="fixed inset-0 z-50 bg-white flex items-center justify-center p-8">
      <div className="max-w-3xl mx-auto text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-electric-100 mb-6">
            <Lock className="w-10 h-10 text-electric-600" />
          </div>
          <h1 className="text-5xl font-serif font-bold text-neutral-900 mb-4">
            Your Free Trial Has Ended
          </h1>
          <p className="text-xl text-neutral-600">
            Continue your English learning journey with full access to all features
          </p>
        </div>

        <div className="bg-neutral-50 border-2 border-neutral-200 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-serif font-semibold text-neutral-900 mb-6">
            Unlock All Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mb-6">
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-electric-600 mt-0.5 flex-shrink-0" />
              <span className="text-neutral-700">Unlimited lessons & practice</span>
            </div>
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-electric-600 mt-0.5 flex-shrink-0" />
              <span className="text-neutral-700">Real-time voice corrections</span>
            </div>
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-electric-600 mt-0.5 flex-shrink-0" />
              <span className="text-neutral-700">47-point error taxonomy</span>
            </div>
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-electric-600 mt-0.5 flex-shrink-0" />
              <span className="text-neutral-700">Personalized learning path</span>
            </div>
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-electric-600 mt-0.5 flex-shrink-0" />
              <span className="text-neutral-700">Progress tracking & analytics</span>
            </div>
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-electric-600 mt-0.5 flex-shrink-0" />
              <span className="text-neutral-700">Priority support</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/#pricing">
            <Button
              size="lg"
              className="bg-electric-600 hover:bg-electric-700 text-white px-8 py-6 text-lg font-semibold"
            >
              View Plans & Pricing
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Link href="/">
            <Button size="lg" variant="outline" className="px-8 py-6 text-lg">
              Go to Homepage
            </Button>
          </Link>
        </div>

        <p className="mt-6 text-sm text-neutral-500">
          Questions? <Link href="/contact" className="text-electric-600 hover:underline">Contact our team</Link>
        </p>
      </div>
    </div>
  );
}
