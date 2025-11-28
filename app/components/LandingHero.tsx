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
      <section className="bg-neutral-900 text-white py-20">
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
    </div>
  );
}
