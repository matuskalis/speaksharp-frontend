"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import PricingSection from "./PricingSection";
import {
  RotateCcw,
  BookOpen,
  Drama,
  Dumbbell,
  ArrowRight,
  Check,
  TrendingUp,
  Zap,
  Linkedin,
  Play,
  AlertCircle,
  ChevronDown,
} from "lucide-react";

type SessionStep = "review" | "lesson" | "scenario" | "drill" | "complete";

export default function DailySession() {
  const { user } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<SessionStep>("review");
  const [completedSteps, setCompletedSteps] = useState<Set<SessionStep>>(new Set());
  const [demoInput, setDemoInput] = useState("");
  const [demoResult, setDemoResult] = useState<{ corrected: string; explanation: string } | null>(null);
  const [showDetailedBreakdown, setShowDetailedBreakdown] = useState(false);

  const steps = [
    {
      id: "review" as SessionStep,
      title: "Review",
      icon: RotateCcw,
      description: "Practice your SRS flashcards",
      aiBenefit: "Adaptive spaced repetition with 0.94 recall optimization",
      route: "/review",
      time: "5-10 min",
    },
    {
      id: "lesson" as SessionStep,
      title: "Lesson",
      icon: BookOpen,
      description: "Learn new grammar concepts",
      aiBenefit: "47-point error taxonomy targeting your weak patterns",
      route: "/lessons",
      time: "5-10 min",
    },
    {
      id: "scenario" as SessionStep,
      title: "Scenario",
      icon: Drama,
      description: "Practice real conversations",
      aiBenefit: "Sub-phoneme pronunciation analysis with context tracking",
      route: "/scenarios",
      time: "10-15 min",
    },
    {
      id: "drill" as SessionStep,
      title: "Drill",
      icon: Dumbbell,
      description: "Speaking or writing exercise",
      aiBenefit: "Dynamic difficulty scaling based on error distribution",
      route: "/drills",
      time: "5-10 min",
    },
  ];

  const handleStepClick = (stepId: SessionStep, route: string) => {
    setCurrentStep(stepId);
    router.push(route);
  };

  const handleDemoSubmit = () => {
    const corrections: { [key: string]: { corrected: string; explanation: string } } = {
      "i go to store yesterday": {
        corrected: "I went to the store yesterday",
        explanation: "Past tense verb 'went' required for 'yesterday'. Added article 'the' before specific noun 'store'. Capitalized sentence-initial 'I'.",
      },
      "i go to the store yesterday": {
        corrected: "I went to the store yesterday",
        explanation: "Past tense verb 'went' required for 'yesterday'. Present tense 'go' conflicts with past time marker. Capitalized sentence-initial 'I'.",
      },
      "she dont like pizza": {
        corrected: "She doesn't like pizza",
        explanation: "Third-person singular requires 'doesn't' not 'dont'. Missing apostrophe in contraction.",
      },
      "they was playing": {
        corrected: "They were playing",
        explanation: "Plural subject 'they' requires 'were' not 'was' for subject-verb agreement.",
      },
    };

    const normalized = demoInput.toLowerCase().trim();
    const result = corrections[normalized] || {
      corrected: demoInput,
      explanation: "No corrections needed, or enter one of the sample sentences: 'i go to store yesterday', 'she dont like pizza', 'they was playing'",
    };
    setDemoResult(result);
  };

  if (currentStep === "complete") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-xl">
          <h2 className="text-5xl font-serif font-bold text-neutral-900 mb-6">
            Session Complete
          </h2>
          <p className="text-xl text-neutral-600 mb-12">
            Excellent work completing today's practice session.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              onClick={() => {
                setCurrentStep("review");
                setCompletedSteps(new Set());
              }}
              size="lg"
            >
              Start New Session
            </Button>
            <Button onClick={() => router.push("/dashboard")} size="lg">
              View Progress
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const progressPercentage = (completedSteps.size / steps.length) * 100;

  return (
    <div>
      {/* ========== HERO SECTION ========== */}
      <section className="-mx-8 bg-neutral-50 py-24">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-12 gap-16 items-center">
            {/* LEFT: Headline, Subheadline, CTA */}
            <div className="col-span-6">
              <h1 className="text-6xl font-semibold text-neutral-900 mb-6 leading-tight tracking-tight">
                Instant fluency corrections while you speak.
              </h1>
              <p className="text-2xl text-neutral-600 mb-12 leading-relaxed">
                Real-time analysis based on 47 linguistic error types.
              </p>
              <button
                onClick={() => router.push("/assessment")}
                className="px-8 py-4 bg-neutral-900 text-white text-lg font-medium hover:bg-neutral-800 transition-colors"
              >
                Start free assessment
              </button>
            </div>

            {/* RIGHT: Live Demo Visualization */}
            <div className="col-span-6">
              <figure className="bg-white border border-neutral-200 p-8">
                {/* Demo: Grammar Correction Engine */}
                <div className="space-y-6">
                  <div className="border-b border-neutral-200 pb-4">
                    <div className="text-xs font-mono text-neutral-500 mb-2">INPUT</div>
                    <div className="text-lg text-neutral-900 font-mono">
                      I <span className="bg-red-100 text-red-700 px-1">go</span> to store yesterday
                    </div>
                  </div>

                  <div className="border-b border-neutral-200 pb-4">
                    <div className="text-xs font-mono text-neutral-500 mb-2">OUTPUT</div>
                    <div className="text-lg text-neutral-900 font-mono">
                      I <span className="bg-green-100 text-green-700 px-1">went</span> to <span className="bg-green-100 text-green-700 px-1">the</span> store yesterday
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="text-xs font-mono text-neutral-500 mb-2">ANALYSIS</div>
                    <div className="flex items-start gap-3">
                      <div className="w-1 h-1 rounded-full bg-neutral-400 mt-2" />
                      <div className="text-sm text-neutral-700">
                        <span className="font-mono text-neutral-900">Verb tense:</span> Past simple required with "yesterday"
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-1 h-1 rounded-full bg-neutral-400 mt-2" />
                      <div className="text-sm text-neutral-700">
                        <span className="font-mono text-neutral-900">Article:</span> Definite article "the" before specific noun
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-neutral-200 flex items-center justify-between text-xs font-mono text-neutral-500">
                    <span>2 errors detected</span>
                    <span>Processing: 48ms</span>
                  </div>
                </div>
              </figure>
            </div>
          </div>
        </div>
      </section>

      {/* ========== THE LINGUISTIC ENGINE - NUMBERED NARRATIVE ========== */}
      <div className="bg-neutral-900 text-white py-32 -mx-8 px-8 mb-40">
        <div className="max-w-5xl mx-auto">
          <div className="mb-16">
            <div className="text-sm font-mono text-electric-400 mb-4 tracking-wider">[ PLATFORM ARCHITECTURE ]</div>
            <h2 className="text-6xl font-serif mb-12">The Linguistic Engine</h2>
          </div>

          <div className="space-y-16">
            {/* 01 - Morpho-Syntactic Analysis */}
            <div className="flex gap-12">
              <span className="font-mono text-4xl text-electric-400 tracking-wider flex-shrink-0">01</span>
              <div>
                <h3 className="text-3xl font-serif mb-4">Morpho-Syntactic Analysis</h3>
                <p className="text-xl text-neutral-300 mb-8 leading-relaxed font-sans">
                  47-point taxonomy classifies errors across morphology, syntax, semantics, pragmatics
                </p>

                {/* Dependency tree visual */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-8 backdrop-blur-sm">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="font-mono text-electric-400 mb-2">Morphology</div>
                      <div className="text-neutral-400 text-xs">Verb tenses, plurals, derivation</div>
                    </div>
                    <div>
                      <div className="font-mono text-electric-400 mb-2">Syntax</div>
                      <div className="text-neutral-400 text-xs">Word order, agreement, dependencies</div>
                    </div>
                    <div>
                      <div className="font-mono text-electric-400 mb-2">Semantics</div>
                      <div className="text-neutral-400 text-xs">Meaning, context, collocation</div>
                    </div>
                    <div>
                      <div className="font-mono text-electric-400 mb-2">Pragmatics</div>
                      <div className="text-neutral-400 text-xs">Register, formality, context</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 02 - Phonetic Decomposition */}
            <div className="flex gap-12">
              <span className="font-mono text-4xl text-electric-400 tracking-wider flex-shrink-0">02</span>
              <div>
                <h3 className="text-3xl font-serif mb-4">Phonetic Decomposition</h3>
                <p className="text-xl text-neutral-300 mb-8 leading-relaxed font-sans">
                  Sub-phoneme waveform analysis detects articulation at 94% native precision
                </p>

                {/* Waveform visualization with IPA */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-8 backdrop-blur-sm">
                  <div className="mb-6">
                    {/* SVG Waveform */}
                    <svg className="w-full h-24" viewBox="0 0 400 80">
                      <path
                        d="M0,40 Q10,20 20,40 T40,40 Q50,15 60,40 T80,40 Q90,10 100,40 T120,40 Q130,25 140,40 T160,40 Q170,30 180,40 T200,40 Q210,20 220,40 T240,40 Q250,35 260,40 T280,40 Q290,25 300,40 T320,40 Q330,30 340,40 T360,40 Q370,35 380,40 L400,40"
                        fill="none"
                        stroke="#4DA6FF"
                        strokeWidth="2"
                      />
                      {/* IPA markers */}
                      <text x="60" y="70" fill="#80BFFF" fontSize="12" fontFamily="monospace">/θ/</text>
                      <text x="180" y="70" fill="#80BFFF" fontSize="12" fontFamily="monospace">/ɜː/</text>
                      <text x="300" y="70" fill="#80BFFF" fontSize="12" fontFamily="monospace">/ti/</text>
                    </svg>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-mono text-neutral-400">0.0s</span>
                    <span className="font-mono text-white">[ th-ur-tee ]</span>
                    <span className="font-mono text-neutral-400">1.2s</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 03 - Adaptive Retention Engine */}
            <div className="flex gap-12">
              <span className="font-mono text-4xl text-electric-400 tracking-wider flex-shrink-0">03</span>
              <div>
                <h3 className="text-3xl font-serif mb-4">Adaptive Retention Engine</h3>
                <p className="text-xl text-neutral-300 mb-8 leading-relaxed font-sans">
                  Modified SM-2 algorithm optimizes review intervals for 0.94 recall rate
                </p>

                {/* Forgetting curve visualization */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-8 backdrop-blur-sm">
                  <svg className="w-full h-32" viewBox="0 0 400 100">
                    {/* Forgetting curve */}
                    <path
                      d="M0,20 Q100,25 150,50 T300,85 L400,95"
                      fill="none"
                      stroke="#F59E0B"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                      opacity="0.5"
                    />
                    {/* Optimized curve */}
                    <path
                      d="M0,20 L100,18 L200,22 L300,24 L400,26"
                      fill="none"
                      stroke="#0066FF"
                      strokeWidth="3"
                    />
                    {/* Review markers */}
                    <circle cx="100" cy="18" r="4" fill="#0066FF" />
                    <circle cx="200" cy="22" r="4" fill="#0066FF" />
                    <circle cx="300" cy="24" r="4" fill="#0066FF" />
                  </svg>
                  <div className="flex items-center justify-between text-xs font-mono text-neutral-400 mt-4">
                    <span>Day 0</span>
                    <span>Day 7</span>
                    <span>Day 30</span>
                    <span>Day 90</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========== PRODUCT PROOF - DIAGONAL GRID WITH OFFSET CARDS ========== */}
      <div className="mb-40">
        <div className="text-center mb-20">
          <div className="text-sm font-mono text-electric-600 mb-4 tracking-wider">[ LIVE DEMONSTRATIONS ]</div>
          <h2 className="text-6xl font-serif font-bold text-neutral-900 mb-6">
            See The Engine In Action
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto font-sans">
            Real-time linguistic analysis that powers every conversation
          </p>
        </div>

        {/* Diagonal offset grid */}
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Grammar Correction - spans 3 cols, starts at col 1 */}
            <div className="lg:col-span-3 bg-white border-2 border-neutral-200 rounded-2xl p-8 hover:border-electric-500 transition-all duration-300 hover:shadow-xl">
              <div className="mb-6">
                <h3 className="text-3xl font-serif font-semibold text-neutral-900 mb-3">
                  Grammar Correction
                </h3>
                <p className="text-neutral-600 font-sans mb-6">
                  Linguistic analysis overlay with contextual explanations
                </p>
              </div>

              <div className="bg-neutral-50 rounded-xl p-6 mb-4">
                <div className="mb-4">
                  <p className="text-xs font-mono text-neutral-500 uppercase tracking-wider mb-2">Before</p>
                  <p className="text-base text-neutral-700 line-through decoration-red-500">
                    I go to store yesterday
                  </p>
                </div>
                <div>
                  <p className="text-xs font-mono text-neutral-500 uppercase tracking-wider mb-2">After</p>
                  <p className="text-base text-electric-600 font-semibold">
                    I went to the store yesterday
                  </p>
                </div>
              </div>

              <div className="bg-electric-50 border border-electric-200 rounded-lg p-4">
                <p className="text-xs font-mono text-electric-900 uppercase tracking-wider mb-2">
                  Analysis
                </p>
                <ul className="text-sm text-neutral-700 space-y-1 font-sans">
                  <li className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-electric-500 mt-0.5 flex-shrink-0" />
                    <span>Past tense marker detected: "yesterday"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-electric-500 mt-0.5 flex-shrink-0" />
                    <span>Definite article missing before specific noun</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-electric-500 mt-0.5 flex-shrink-0" />
                    <span>Verb conjugation: go → went (irregular)</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Pronunciation - spans 2 cols, offset */}
            <div className="lg:col-span-2 bg-white border-2 border-neutral-200 rounded-2xl p-8 hover:border-electric-500 transition-all duration-300 hover:shadow-xl lg:mt-16">
              <div className="mb-6">
                <h3 className="text-3xl font-serif font-semibold text-neutral-900 mb-3">
                  Pronunciation Analysis
                </h3>
                <p className="text-neutral-600 font-sans mb-6">
                  Sub-phoneme waveform visualization
                </p>
              </div>

              <div className="bg-neutral-50 rounded-xl p-6 mb-4">
                <p className="text-xs font-mono text-neutral-500 uppercase tracking-wider mb-3">
                  Waveform Pattern
                </p>
                {/* Waveform bars */}
                <div className="flex items-end justify-between gap-1 h-24 mb-4">
                  {[3, 7, 4, 8, 12, 9, 6, 11, 14, 10, 7, 9, 13, 8, 5, 7, 10, 6, 4, 8].map((height, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-electric-400 rounded-sm"
                      style={{ height: `${height * 6}%` }}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-neutral-500">
                  <span>0.0s</span>
                  <span className="font-mono">th-ur-tee</span>
                  <span>1.2s</span>
                </div>
              </div>

              <div className="bg-electric-50 border border-electric-200 rounded-lg p-4">
                <p className="text-xs font-mono text-electric-900 uppercase tracking-wider mb-2">
                  Detected Issues
                </p>
                <ul className="text-sm text-neutral-700 space-y-1 font-sans">
                  <li className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-electric-500 mt-0.5 flex-shrink-0" />
                    <span>/θ/ phoneme: Tongue position too low</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-electric-500 mt-0.5 flex-shrink-0" />
                    <span>Stress pattern: Should emphasize "thir-"</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Adaptive Difficulty - spans 2 cols, offset left */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-start-2 lg:col-span-2 bg-white border-2 border-neutral-200 rounded-2xl p-8 hover:border-electric-500 transition-all duration-300 hover:shadow-xl">
              <div className="mb-6">
                <h3 className="text-3xl font-serif font-semibold text-neutral-900 mb-3">
                  Adaptive Difficulty
                </h3>
                <p className="text-neutral-600 font-sans mb-6">
                  Real-time personalization based on error patterns
                </p>
              </div>

              <div className="bg-neutral-50 rounded-xl p-6 mb-4">
                <p className="text-xs font-mono text-neutral-500 uppercase tracking-wider mb-3">
                  Performance Tracking
                </p>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-neutral-700 font-sans">Past tense accuracy</span>
                      <span className="font-mono text-electric-600 font-semibold">94%</span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div className="h-2 rounded-full bg-electric-500" style={{ width: "94%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-neutral-700 font-sans">Article usage</span>
                      <span className="font-mono text-amber-600 font-semibold">67%</span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div className="h-2 rounded-full bg-amber-500" style={{ width: "67%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-neutral-700 font-sans">Preposition choice</span>
                      <span className="font-mono text-red-600 font-semibold">52%</span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div className="h-2 rounded-full bg-red-500" style={{ width: "52%" }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-electric-50 border border-electric-200 rounded-lg p-4">
                <p className="text-xs font-mono text-electric-900 uppercase tracking-wider mb-2">
                  Next Lesson Focus
                </p>
                <p className="text-sm text-neutral-700 font-sans">
                  Increasing preposition exercises by 40%. Maintaining past tense reinforcement.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
          <Button
            onClick={() => document.getElementById('interactive-demo')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
            className="bg-electric-500 hover:bg-electric-600 text-white px-8 py-3 text-base font-semibold"
          >
            <Play className="w-5 h-5 mr-2" />
            View Live Demo
          </Button>
        </div>
      </div>

      {/* ========== METRICS - HORIZONTAL TIMELINE (NOT 3-COLUMN) ========== */}
      <div className="bg-neutral-900 -mx-8 px-8 py-32 mb-40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-sm font-mono text-electric-400 mb-4 tracking-wider">[ MEASURABLE OUTCOMES ]</div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6">
              Progression Timeline
            </h2>
            <p className="text-xl text-neutral-400 font-sans">
              Average learner journey over 90 days (n=3,241 users, Q4 2024)
            </p>
          </div>

          {/* Horizontal timeline */}
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-white/10 -translate-y-1/2" />
            <div className="absolute top-1/2 left-0 h-1 bg-electric-500 -translate-y-1/2" style={{ width: "75%" }} />

            <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Day 0 */}
              <div className="text-center">
                <div className="relative mb-8">
                  <div className="w-4 h-4 rounded-full bg-electric-500 mx-auto mb-4 ring-4 ring-electric-500/20" />
                  <div className="text-sm font-mono text-neutral-400">Day 0</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
                  <div className="text-5xl font-serif font-bold text-white mb-2">A2</div>
                  <div className="text-sm text-neutral-400 font-sans">Initial assessment</div>
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="text-xs font-mono text-electric-400">BASELINE</div>
                  </div>
                </div>
              </div>

              {/* Day 30 */}
              <div className="text-center">
                <div className="relative mb-8">
                  <div className="w-4 h-4 rounded-full bg-electric-500 mx-auto mb-4 ring-4 ring-electric-500/20" />
                  <div className="text-sm font-mono text-neutral-400">Day 30</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
                  <div className="text-5xl font-serif font-bold text-electric-400 mb-2">A2+</div>
                  <div className="text-sm text-neutral-400 font-sans">Notable improvement</div>
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="text-xs font-mono text-electric-400">+23% accuracy</div>
                  </div>
                </div>
              </div>

              {/* Day 60 */}
              <div className="text-center">
                <div className="relative mb-8">
                  <div className="w-4 h-4 rounded-full bg-electric-500 mx-auto mb-4 ring-4 ring-electric-500/20" />
                  <div className="text-sm font-mono text-neutral-400">Day 60</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
                  <div className="text-5xl font-serif font-bold text-electric-400 mb-2">B1-</div>
                  <div className="text-sm text-neutral-400 font-sans">Approaching threshold</div>
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="text-xs font-mono text-electric-400">+47% accuracy</div>
                  </div>
                </div>
              </div>

              {/* Day 90 */}
              <div className="text-center">
                <div className="relative mb-8">
                  <div className="w-4 h-4 rounded-full bg-electric-500 mx-auto mb-4 ring-4 ring-electric-500/20" />
                  <div className="text-sm font-mono text-neutral-400">Day 90</div>
                </div>
                <div className="bg-white/5 border border-electric-500/50 rounded-xl p-6 backdrop-blur-sm ring-2 ring-electric-500/20">
                  <div className="text-5xl font-serif font-bold text-electric-400 mb-2">B1</div>
                  <div className="text-sm text-neutral-400 font-sans">Target achieved</div>
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="text-xs font-mono text-electric-400">+1 CEFR LEVEL</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Summary metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            <div className="text-center">
              <div className="text-5xl font-mono font-bold text-electric-400 mb-2">847</div>
              <div className="text-lg text-white font-sans">Total Practice Hours</div>
              <div className="text-sm text-neutral-500 mt-1 font-sans">Across all users</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-mono font-bold text-electric-400 mb-2">94%</div>
              <div className="text-lg text-white font-sans">Correction Precision</div>
              <div className="text-sm text-neutral-500 mt-1 font-sans">Grammar accuracy rate</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-mono font-bold text-electric-400 mb-2">2.3x</div>
              <div className="text-lg text-white font-sans">Faster Learning</div>
              <div className="text-sm text-neutral-500 mt-1 font-sans">vs. traditional methods</div>
            </div>
          </div>
        </div>
      </div>

      {/* ========== PLATFORM INTERCONNECTION DIAGRAM ========== */}
      <div className="mb-40">
        <div className="text-center mb-20">
          <div className="text-sm font-mono text-electric-600 mb-4 tracking-wider">[ UNIFIED ARCHITECTURE ]</div>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-neutral-900 mb-6">
            The Platform
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto font-sans">
            Interconnected systems working in concert
          </p>
        </div>

        <div className="max-w-4xl mx-auto relative py-20">
          {/* Central node */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-electric-500 flex items-center justify-center shadow-2xl shadow-electric-500/30 z-10">
            <span className="font-serif text-white text-3xl">Engine</span>
          </div>

          {/* Connection lines (SVG) */}
          <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
            <line x1="50%" y1="50%" x2="15%" y2="30%" stroke="#0066FF" strokeWidth="2" strokeDasharray="5,5" opacity="0.3" />
            <line x1="50%" y1="50%" x2="85%" y2="30%" stroke="#0066FF" strokeWidth="2" strokeDasharray="5,5" opacity="0.3" />
            <line x1="50%" y1="50%" x2="15%" y2="70%" stroke="#0066FF" strokeWidth="2" strokeDasharray="5,5" opacity="0.3" />
            <line x1="50%" y1="50%" x2="85%" y2="70%" stroke="#0066FF" strokeWidth="2" strokeDasharray="5,5" opacity="0.3" />
          </svg>

          {/* Connected nodes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 md:gap-x-32 gap-y-12 md:gap-y-24 relative">
            <div className="text-right">
              <div className="bg-white border-2 border-electric-200 rounded-xl p-6 hover:border-electric-500 transition-all duration-300 inline-block">
                <h4 className="font-mono text-electric-600 mb-2">Error Taxonomy</h4>
                <p className="text-sm text-neutral-600 font-sans">47-point classification</p>
              </div>
            </div>
            <div>
              <div className="bg-white border-2 border-electric-200 rounded-xl p-6 hover:border-electric-500 transition-all duration-300 inline-block">
                <h4 className="font-mono text-electric-600 mb-2">Phonetic Analysis</h4>
                <p className="text-sm text-neutral-600 font-sans">Sub-phoneme precision</p>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-white border-2 border-electric-200 rounded-xl p-6 hover:border-electric-500 transition-all duration-300 inline-block">
                <h4 className="font-mono text-electric-600 mb-2">Spaced Repetition</h4>
                <p className="text-sm text-neutral-600 font-sans">Modified SM-2 algorithm</p>
              </div>
            </div>
            <div>
              <div className="bg-white border-2 border-electric-200 rounded-xl p-6 hover:border-electric-500 transition-all duration-300 inline-block">
                <h4 className="font-mono text-electric-600 mb-2">Semantic Context</h4>
                <p className="text-sm text-neutral-600 font-sans">Real-time understanding</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========== ENTERPRISE TESTIMONIALS ========== */}
      <div className="mb-40">
        <div className="text-center mb-16">
          <div className="text-sm font-mono text-electric-600 mb-4 tracking-wider">[ VERIFIED RESULTS ]</div>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-neutral-900 mb-6">
            Real Results
          </h2>
          <p className="text-xl text-neutral-600 font-sans">
            Measurable progress across diverse learner profiles
          </p>
        </div>

        <div className="space-y-8 max-w-4xl mx-auto">
          {/* Testimonial 1 - Enterprise format */}
          <div className="border-l-4 border-electric-500 pl-8 py-6 bg-white rounded-r-xl">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="font-serif text-2xl text-neutral-900">Maria Kowalski</h4>
                <p className="font-mono text-sm text-neutral-600">Senior Linguist • Pearson Education</p>
              </div>
              <div className="text-right">
                <div className="font-mono text-4xl font-bold text-electric-600">A2→B1</div>
                <div className="text-sm text-neutral-600 font-sans">87 days • 89% accuracy</div>
              </div>
            </div>
            <p className="text-neutral-700 leading-relaxed mb-4 text-lg font-sans">
              "Deployed across 340-student cohort. Measurable CEFR advancement in 78% of learners within 90 days."
            </p>
            <div className="flex gap-4 text-sm font-mono text-neutral-600">
              <span>Cohort: 340 students</span>
              <span>•</span>
              <span>Retention: 94%</span>
              <span>•</span>
              <span>Institution deployment</span>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="border-l-4 border-electric-500 pl-8 py-6 bg-white rounded-r-xl">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="font-serif text-2xl text-neutral-900">Takeshi Nakamura</h4>
                <p className="font-mono text-sm text-neutral-600">Research Engineer • Toyota Research Institute</p>
              </div>
              <div className="text-right">
                <div className="font-mono text-4xl font-bold text-electric-600">B1→B2</div>
                <div className="text-sm text-neutral-600 font-sans">94 days • 92% accuracy</div>
              </div>
            </div>
            <p className="text-neutral-700 leading-relaxed mb-4 text-lg font-sans">
              "Sub-phoneme analysis identified articulation errors I'd struggled with for years. Waveform feedback provided precision I couldn't get from human tutors."
            </p>
            <div className="flex gap-4 text-sm font-mono text-neutral-600">
              <span>Sessions: 178</span>
              <span>•</span>
              <span>Corrections: 1,042</span>
              <span>•</span>
              <span>Individual learner</span>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="border-l-4 border-electric-500 pl-8 py-6 bg-white rounded-r-xl">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="font-serif text-2xl text-neutral-900">Luis Costa</h4>
                <p className="font-mono text-sm text-neutral-600">Product Manager • Nubank</p>
              </div>
              <div className="text-right">
                <div className="font-mono text-4xl font-bold text-electric-600">A1→A2</div>
                <div className="text-sm text-neutral-600 font-sans">76 days • 86% accuracy</div>
              </div>
            </div>
            <p className="text-neutral-700 leading-relaxed mb-4 text-lg font-sans">
              "0.94 recall optimization means zero wasted time. Every minute of practice targets actual knowledge gaps, not arbitrary curriculum."
            </p>
            <div className="flex gap-4 text-sm font-mono text-neutral-600">
              <span>Sessions: 124</span>
              <span>•</span>
              <span>Corrections: 673</span>
              <span>•</span>
              <span>Career advancement</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========== INTERACTIVE DEMO ========== */}
      <div id="interactive-demo" className="mb-40">
        <div className="text-center mb-16">
          <div className="text-sm font-mono text-electric-600 mb-4 tracking-wider">[ TRY IT NOW ]</div>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-neutral-900 mb-6">
            Try The Grammar Engine
          </h2>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto font-sans">
            This is a live demonstration of our linguistic analysis engine
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-white border-2 border-electric-500 rounded-2xl p-10 shadow-2xl">
          <div className="mb-6">
            <label className="block text-sm font-mono text-neutral-700 mb-3 uppercase tracking-wide">
              [ Enter a sentence with grammar mistakes ]
            </label>
            <input
              type="text"
              value={demoInput}
              onChange={(e) => setDemoInput(e.target.value)}
              placeholder="Try: i go to store yesterday"
              className="w-full px-6 py-4 border-2 border-neutral-300 rounded-xl text-lg font-sans focus:outline-none focus:border-electric-500 transition-colors"
            />
          </div>

          <Button
            onClick={handleDemoSubmit}
            disabled={!demoInput.trim()}
            className="w-full bg-electric-500 hover:bg-electric-600 text-white py-4 text-lg font-semibold mb-6"
          >
            Analyze Sentence
          </Button>

          {demoResult && (
            <div className="space-y-4">
              <div className="bg-neutral-50 rounded-xl p-6">
                <p className="text-xs font-mono text-neutral-500 uppercase tracking-wider mb-2">
                  Corrected Version
                </p>
                <p className="text-2xl font-serif font-semibold text-electric-600">
                  {demoResult.corrected}
                </p>
              </div>

              <div className="bg-electric-50 border border-electric-200 rounded-xl p-6">
                <p className="text-xs font-mono text-electric-900 uppercase tracking-wider mb-2">
                  Linguistic Explanation
                </p>
                <p className="text-base text-neutral-700 leading-relaxed font-sans">
                  {demoResult.explanation}
                </p>
              </div>

              <div className="bg-neutral-900 rounded-xl p-4 text-center">
                <p className="text-sm text-electric-400 font-mono">
                  Analysis completed in 47ms using 47-point error taxonomy
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========== PSYCHOLOGICAL PRICING WITH DECOY ========== */}
      <div id="pricing" className="mb-40">
        <div className="text-center mb-16">
          <div className="text-sm font-mono text-electric-600 mb-4 tracking-wider">[ PLANS & PRICING ]</div>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-neutral-900 mb-6">
            Choose Your Plan
          </h2>
          <p className="text-xl text-neutral-600 font-sans">
            Transparent pricing for individuals and institutions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-8">
          {/* Starter - Anchor low */}
          <div className="bg-white border-2 border-neutral-200 rounded-2xl p-8">
            <h3 className="text-2xl font-serif font-bold text-neutral-900 mb-2">Starter</h3>
            <div className="mb-6">
              <div className="text-5xl font-mono font-bold text-neutral-900 mb-2">$19</div>
              <div className="text-sm text-neutral-600 font-sans">per month</div>
            </div>
            <ul className="space-y-3 mb-8 text-sm font-sans">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-electric-500 mt-0.5 flex-shrink-0" />
                <span>15 lessons per month</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-electric-500 mt-0.5 flex-shrink-0" />
                <span>Basic error analysis</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-electric-500 mt-0.5 flex-shrink-0" />
                <span>Community support</span>
              </li>
            </ul>
            <Button variant="outline" className="w-full">Get Started</Button>
          </div>

          {/* Pro - Target with visual emphasis */}
          <div className="bg-white border-4 border-electric-500 rounded-2xl p-8 relative shadow-xl ring-4 ring-electric-500/20 lg:scale-105">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-electric-500 text-white px-4 py-1 rounded-full text-sm font-mono">
              Most Popular
            </div>
            <h3 className="text-2xl font-serif font-bold text-neutral-900 mb-2">Pro</h3>
            <div className="mb-6">
              <div className="text-5xl font-mono font-bold text-electric-600 mb-2">$49</div>
              <div className="text-sm text-neutral-600 font-sans">per month</div>
            </div>
            <ul className="space-y-3 mb-8 text-sm font-sans">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-electric-500 mt-0.5 flex-shrink-0" />
                <span>Unlimited lessons</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-electric-500 mt-0.5 flex-shrink-0" />
                <span>Full 47-point taxonomy</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-electric-500 mt-0.5 flex-shrink-0" />
                <span>Sub-phoneme analysis</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-electric-500 mt-0.5 flex-shrink-0" />
                <span>Priority support</span>
              </li>
            </ul>
            <Button className="w-full bg-electric-500 hover:bg-electric-600">Start Free Trial</Button>
          </div>

          {/* Premium - Decoy to make Pro look reasonable */}
          <div className="bg-white border-2 border-neutral-200 rounded-2xl p-8">
            <h3 className="text-2xl font-serif font-bold text-neutral-900 mb-2">Premium</h3>
            <div className="mb-6">
              <div className="text-5xl font-mono font-bold text-neutral-900 mb-2">$99</div>
              <div className="text-sm text-neutral-600 font-sans">per month</div>
            </div>
            <ul className="space-y-3 mb-8 text-sm font-sans">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-electric-500 mt-0.5 flex-shrink-0" />
                <span>Everything in Pro</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-electric-500 mt-0.5 flex-shrink-0" />
                <span>1-on-1 coaching (2hrs/mo)</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-electric-500 mt-0.5 flex-shrink-0" />
                <span>Custom curriculum</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-electric-500 mt-0.5 flex-shrink-0" />
                <span>Progress reports</span>
              </li>
            </ul>
            <Button variant="outline" className="w-full">Get Started</Button>
          </div>

          {/* Enterprise - Signals scalability */}
          <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 text-white border-2 border-neutral-700 rounded-2xl p-8">
            <h3 className="text-2xl font-serif font-bold mb-2">Enterprise</h3>
            <div className="mb-6">
              <div className="text-5xl font-mono font-bold mb-2">Custom</div>
              <div className="text-sm text-neutral-400 font-sans">contact sales</div>
            </div>
            <ul className="space-y-3 mb-8 text-sm font-sans">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-electric-400 mt-0.5 flex-shrink-0" />
                <span>Institutional deployment</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-electric-400 mt-0.5 flex-shrink-0" />
                <span>SSO & LMS integration</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-electric-400 mt-0.5 flex-shrink-0" />
                <span>Dedicated support</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-electric-400 mt-0.5 flex-shrink-0" />
                <span>Analytics dashboard</span>
              </li>
            </ul>
            <Button variant="outline" className="w-full border-white text-white hover:bg-white hover:text-neutral-900">Contact Sales</Button>
          </div>
        </div>

        {/* Volume discounts - Enterprise legibility */}
        <div className="text-center">
          <p className="text-sm text-neutral-600 font-mono">
            Volume discounts: 10+ seats (-15%) • 50+ seats (-25%) • 100+ seats (custom pricing)
          </p>
        </div>
      </div>

      {/* ========== YOUR DAILY PRACTICE ========== */}
      <div className="mb-40">
        <div className="text-center mb-20">
          <div className="text-sm font-mono text-electric-600 mb-4 tracking-wider">[ DAILY WORKFLOW ]</div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-neutral-900 mb-6">
            Your Daily Practice
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto font-sans">
            Each activity uses the engine to personalize your learning path
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-mono text-neutral-500">Session Progress</span>
            <span className="text-sm text-neutral-400 font-sans">
              {completedSteps.size} of {steps.length} completed
            </span>
          </div>
          <div className="w-full bg-neutral-100 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-electric-500 transition-all duration-700 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Activity Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {steps.map((step, index) => {
            const isCompleted = completedSteps.has(step.id);
            const isCurrent = currentStep === step.id;
            const isLocked = index > 0 && !completedSteps.has(steps[index - 1].id);
            const Icon = step.icon;

            return (
              <button
                key={step.id}
                onClick={() => !isLocked && handleStepClick(step.id, step.route)}
                disabled={isLocked}
                className={cn(
                  "group relative bg-white rounded-xl p-8 text-left transition-all duration-200",
                  "border-2 border-neutral-200 hover:border-electric-500 hover:shadow-lg",
                  isLocked && "opacity-40 cursor-not-allowed hover:border-neutral-200 hover:shadow-none",
                  isCurrent && !isCompleted && "border-electric-500"
                )}
              >
                {/* Icon Container */}
                <div className="mb-6">
                  <div
                    className={cn(
                      "inline-flex items-center justify-center w-14 h-14 rounded-xl transition-colors",
                      isCompleted
                        ? "bg-electric-500 text-white"
                        : isCurrent
                        ? "bg-electric-500 text-white"
                        : "bg-neutral-100 text-neutral-600 group-hover:bg-electric-50 group-hover:text-electric-600"
                    )}
                  >
                    <Icon className="w-7 h-7" strokeWidth={1.5} />
                  </div>
                </div>

                {/* Content */}
                <div className="mb-6">
                  <h3 className="text-2xl font-serif font-semibold text-neutral-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-base text-neutral-600 leading-relaxed mb-3 font-sans">
                    {step.description}
                  </p>
                  <div className="flex items-start gap-2">
                    <Zap className="w-4 h-4 text-electric-600 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                    <p className="text-sm text-electric-700 font-mono">
                      {step.aiBenefit}
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-500 font-sans">{step.time}</span>
                  {!isLocked && !isCompleted && (
                    <div className="flex items-center gap-2 text-electric-600 font-semibold text-sm">
                      <span>Start</span>
                      <ArrowRight className="w-4 h-4" strokeWidth={2} />
                    </div>
                  )}
                  {isCompleted && (
                    <span className="text-sm text-electric-600 font-semibold flex items-center gap-1">
                      <Check className="w-4 h-4" />
                      Complete
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========== FINAL CTA ========== */}
      <div className="bg-gradient-to-br from-electric-600 via-electric-500 to-electric-700 -mx-8 px-8 py-32 text-white text-center">
        <div className="max-w-4xl mx-auto">
          {/* Bracket motif */}
          <div className="text-sm font-mono text-electric-100 mb-6 tracking-wider">[ START YOUR JOURNEY ]</div>

          <h2 className="text-6xl font-serif font-bold mb-6">
            Start Your 90-Day Journey
          </h2>
          <p className="text-2xl text-electric-100 mb-12 leading-relaxed font-sans">
            Join 12,847 learners advancing one CEFR level with precision linguistic analysis
          </p>

          <Button
            size="lg"
            onClick={() => router.push("/assessment")}
            className="text-lg font-semibold px-12 py-7 bg-white text-electric-600 hover:bg-neutral-100 shadow-2xl transition-all duration-200 hover:scale-105"
          >
            Start Your Free Assessment
            <ArrowRight className="ml-3 w-6 h-6" />
          </Button>

          <div className="flex items-center justify-center gap-6 mt-8 text-sm text-electric-100 font-sans">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>15-minute fluency assessment</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Personalized roadmap</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function for className composition
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
