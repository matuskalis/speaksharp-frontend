"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function LandingHero() {
  const router = useRouter();

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 min-h-[60vh]">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Hero Text */}
          <div className="space-y-8">
            <h1 className="text-6xl font-bold text-neutral-900 leading-tight">
              Instant fluency corrections while you speak.
            </h1>
            <p className="text-xl text-neutral-600">
              Real-time analysis based on 47 linguistic error types.
            </p>
            <div>
              <Button
                onClick={() => router.push("/get-started")}
                size="lg"
                className="px-8 py-6 text-lg bg-neutral-900 hover:bg-neutral-800 text-white"
              >
                Start free assessment
              </Button>
            </div>
          </div>

          {/* Right Column - Demo Card */}
          <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-8 space-y-6">
            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-wide mb-2">INPUT</p>
              <p className="text-lg text-neutral-900 font-mono">
                I <span className="text-red-600 font-semibold">go</span> to store yesterday
              </p>
            </div>

            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-wide mb-2">OUTPUT</p>
              <p className="text-lg text-neutral-900 font-mono">
                I <span className="text-green-600 font-semibold">went</span> to{" "}
                <span className="text-green-600 font-semibold">the</span> store yesterday
              </p>
            </div>

            <div className="border-t border-neutral-200 pt-4">
              <p className="text-xs text-neutral-500 uppercase tracking-wide mb-3">ANALYSIS</p>
              <ul className="space-y-2 text-sm text-neutral-700">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    <span className="font-semibold">Verb tense:</span> Past simple required with &quot;yesterday&quot;
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    <span className="font-semibold">Article:</span> Definite article &quot;the&quot; before specific noun
                  </span>
                </li>
              </ul>
              <div className="mt-4 flex justify-between items-center text-xs">
                <span className="text-neutral-500">2 errors detected</span>
                <span className="text-neutral-400">Processing: 48ms</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Architecture Section */}
      <section id="technology" className="bg-neutral-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-sm text-cyan-400 uppercase tracking-wide mb-2">
              [ PLATFORM ARCHITECTURE ]
            </p>
            <h2 className="text-5xl font-serif font-bold">The Linguistic Engine</h2>
          </div>

          <div className="space-y-12">
            {/* Feature 1 */}
            <div>
              <div className="flex items-baseline mb-4">
                <span className="text-3xl font-mono text-cyan-400 mr-4">01</span>
                <h3 className="text-2xl font-semibold">Morpho-Syntactic Analysis</h3>
              </div>
              <p className="text-neutral-400 text-lg ml-16">
                47-point taxonomy classifies errors across morphology, syntax, semantics, pragmatics
              </p>
            </div>

            {/* Feature 2 */}
            <div>
              <div className="flex items-baseline mb-4">
                <span className="text-3xl font-mono text-cyan-400 mr-4">02</span>
                <h3 className="text-2xl font-semibold">Spaced Repetition Integration</h3>
              </div>
              <p className="text-neutral-400 text-lg ml-16">
                SuperMemo SM-2 algorithm schedules review of persistent error patterns
              </p>
            </div>

            {/* Feature 3 */}
            <div>
              <div className="flex items-baseline mb-4">
                <span className="text-3xl font-mono text-cyan-400 mr-4">03</span>
                <h3 className="text-2xl font-semibold">Voice-First Design</h3>
              </div>
              <p className="text-neutral-400 text-lg ml-16">
                Real-time transcription and analysis enables natural conversation practice
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-neutral-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-neutral-600">Start with a 14-day free trial. No credit card required.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter Plan */}
            <div className="border border-neutral-200 rounded-lg p-8 bg-white">
              <h3 className="text-2xl font-bold text-neutral-900 mb-2">Starter</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-neutral-900">$19</span>
                <span className="text-neutral-600">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span className="text-neutral-700">Real-time error correction</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span className="text-neutral-700">Voice practice sessions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span className="text-neutral-700">Basic lessons library</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span className="text-neutral-700">Progress tracking</span>
                </li>
              </ul>
              <Button
                onClick={() => router.push("/get-started")}
                variant="outline"
                className="w-full"
              >
                Start Free Trial
              </Button>
            </div>

            {/* Pro Plan */}
            <div className="border-2 border-electric-500 rounded-lg p-8 bg-white relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-electric-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-2">Pro</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-neutral-900">$39</span>
                <span className="text-neutral-600">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span className="text-neutral-700">Everything in Starter</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span className="text-neutral-700">Advanced scenarios</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span className="text-neutral-700">Spaced repetition drills</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span className="text-neutral-700">Detailed analytics</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span className="text-neutral-700">Priority support</span>
                </li>
              </ul>
              <Button
                onClick={() => router.push("/get-started")}
                className="w-full bg-electric-500 hover:bg-electric-600 text-white"
              >
                Start Free Trial
              </Button>
            </div>

            {/* Premium Plan */}
            <div className="border border-neutral-200 rounded-lg p-8 bg-white">
              <h3 className="text-2xl font-bold text-neutral-900 mb-2">Premium</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-neutral-900">$79</span>
                <span className="text-neutral-600">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span className="text-neutral-700">Everything in Pro</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span className="text-neutral-700">Unlimited practice</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span className="text-neutral-700">Custom lesson creation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span className="text-neutral-700">1-on-1 coaching sessions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span className="text-neutral-700">API access</span>
                </li>
              </ul>
              <Button
                onClick={() => router.push("/get-started")}
                variant="outline"
                className="w-full"
              >
                Start Free Trial
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
