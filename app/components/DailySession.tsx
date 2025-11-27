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
} from "lucide-react";

type SessionStep = "review" | "lesson" | "scenario" | "drill" | "complete";

export default function DailySession() {
  const { user } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<SessionStep>("review");
  const [completedSteps, setCompletedSteps] = useState<Set<SessionStep>>(new Set());
  const [demoInput, setDemoInput] = useState("");
  const [demoResult, setDemoResult] = useState<{ corrected: string; explanation: string } | null>(null);

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
    // Simulated grammar correction demo
    const corrections: { [key: string]: { corrected: string; explanation: string } } = {
      "i go to store yesterday": {
        corrected: "I went to the store yesterday",
        explanation: "Past tense verb 'went' required for 'yesterday'. Added article 'the' before specific noun 'store'. Capitalized sentence-initial 'I'.",
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

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <h3 className="text-3xl font-display font-semibold text-neutral-900 mb-4">
            Daily Practice Session
          </h3>
          <p className="text-lg text-neutral-600">
            Sign in to access your personalized daily learning session.
          </p>
        </div>
      </div>
    );
  }

  if (currentStep === "complete") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-xl">
          <h2 className="text-5xl font-display font-bold text-neutral-900 mb-6">
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
      {/* ========== HERO SECTION - Concrete Value Prop ========== */}
      <div className="-mx-8 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-white py-40 mb-40">
        <div className="max-w-5xl mx-auto px-8 text-center">
          <h1 className="text-7xl font-display font-bold mb-6 tracking-tight leading-tight">
            Advance One CEFR Level<br />in 90 Days
          </h1>
          <p className="text-2xl text-neutral-300 max-w-3xl mx-auto mb-4 leading-relaxed">
            Precision linguistic engine analyzes 47 error patterns per conversation
          </p>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto mb-12">
            Join 12,847 learners who've achieved measurable fluency gains
          </p>

          {/* Dominant CTA */}
          <div className="mb-8">
            <Button
              size="lg"
              onClick={() => router.push("/assessment")}
              className="text-lg font-semibold px-12 py-7 bg-electric-500 text-white hover:bg-electric-600 shadow-2xl shadow-electric-500/30 transition-all duration-200 hover:scale-105"
            >
              Start Your Free Assessment
              <ArrowRight className="ml-3 w-6 h-6" />
            </Button>
          </div>

          {/* Micro-benefits */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12 text-sm text-neutral-300">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-electric-400" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-electric-400" />
              <span>Get your fluency score in 15 minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-electric-400" />
              <span>Personalized 90-day roadmap included</span>
            </div>
          </div>

          {/* Social proof in hero */}
          <p className="text-sm text-neutral-400 uppercase tracking-wider mb-3">
            Used by students at
          </p>
          <div className="flex items-center justify-center gap-8 text-neutral-500 font-semibold text-sm">
            <span>Stanford</span>
            <span className="text-neutral-700">•</span>
            <span>Cambridge</span>
            <span className="text-neutral-700">•</span>
            <span>Tokyo University</span>
          </div>
        </div>
      </div>

      {/* ========== PRODUCT PROOF SECTION - Show the Engine ========== */}
      <div className="mb-40">
        <div className="text-center mb-20">
          <h2 className="text-6xl font-display font-bold text-neutral-900 mb-6">
            See The Engine In Action
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Real-time linguistic analysis that powers every conversation
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Grammar Correction Demo */}
          <div className="bg-white border-2 border-neutral-200 rounded-2xl p-8 hover:border-electric-500 transition-all duration-300">
            <div className="mb-6">
              <h3 className="text-2xl font-display font-semibold text-neutral-900 mb-3">
                Grammar Correction
              </h3>
              <p className="text-neutral-600 mb-6">
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
              <ul className="text-sm text-neutral-700 space-y-1">
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

          {/* Pronunciation Feedback Demo */}
          <div className="bg-white border-2 border-neutral-200 rounded-2xl p-8 hover:border-electric-500 transition-all duration-300">
            <div className="mb-6">
              <h3 className="text-2xl font-display font-semibold text-neutral-900 mb-3">
                Pronunciation Analysis
              </h3>
              <p className="text-neutral-600 mb-6">
                Sub-phoneme waveform visualization and correction
              </p>
            </div>

            <div className="bg-neutral-50 rounded-xl p-6 mb-4">
              <p className="text-xs font-mono text-neutral-500 uppercase tracking-wider mb-3">
                Waveform Pattern
              </p>
              {/* Simplified waveform visualization */}
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
              <ul className="text-sm text-neutral-700 space-y-1">
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

          {/* Adaptive Difficulty Demo */}
          <div className="bg-white border-2 border-neutral-200 rounded-2xl p-8 hover:border-electric-500 transition-all duration-300">
            <div className="mb-6">
              <h3 className="text-2xl font-display font-semibold text-neutral-900 mb-3">
                Adaptive Difficulty
              </h3>
              <p className="text-neutral-600 mb-6">
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
                    <span className="text-neutral-700">Past tense accuracy</span>
                    <span className="font-mono text-electric-600 font-semibold">94%</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div className="h-2 rounded-full bg-electric-500" style={{ width: "94%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-neutral-700">Article usage</span>
                    <span className="font-mono text-amber-600 font-semibold">67%</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div className="h-2 rounded-full bg-amber-500" style={{ width: "67%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-neutral-700">Preposition choice</span>
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
              <p className="text-sm text-neutral-700">
                Increasing preposition exercises by 40%. Maintaining past tense reinforcement.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Button
            onClick={() => router.push("/demo")}
            className="bg-electric-500 hover:bg-electric-600 text-white px-8 py-3 text-base font-semibold"
          >
            <Play className="w-5 h-5 mr-2" />
            View Live Demo
          </Button>
        </div>
      </div>

      {/* ========== METRICS SECTION - Quantifiable Outcomes ========== */}
      <div className="bg-neutral-900 -mx-8 px-8 py-32 mb-40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-6xl font-display font-bold text-white mb-6">
              Demonstrated Performance Improvement
            </h2>
            <p className="text-xl text-neutral-400">
              Based on 3,241 user sessions, Q4 2024
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Metric 1 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center backdrop-blur-sm">
              <div className="text-7xl font-display font-bold text-electric-400 mb-4">
                847
              </div>
              <div className="text-xl font-semibold text-white mb-2">
                Hours Delivered
              </div>
              <div className="text-neutral-400">
                Total practice time across all users
              </div>
            </div>

            {/* Metric 2 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center backdrop-blur-sm">
              <div className="text-7xl font-display font-bold text-electric-400 mb-4">
                94%
              </div>
              <div className="text-xl font-semibold text-white mb-2">
                Correction Precision
              </div>
              <div className="text-neutral-400">
                Grammar correction accuracy rate
              </div>
            </div>

            {/* Metric 3 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center backdrop-blur-sm">
              <div className="text-7xl font-display font-bold text-electric-400 mb-4">
                2.3x
              </div>
              <div className="text-xl font-semibold text-white mb-2">
                Faster Learning
              </div>
              <div className="text-neutral-400">
                Compared to traditional methods
              </div>
            </div>
          </div>

          {/* Simplified chart visualization */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-10 backdrop-blur-sm">
            <h3 className="text-2xl font-display font-semibold text-white mb-8 text-center">
              Average CEFR Progression Over 90 Days
            </h3>
            <div className="flex items-end justify-between gap-4 h-64">
              <div className="flex-1 flex flex-col items-center">
                <div className="w-full bg-electric-500/20 rounded-t-lg relative" style={{ height: "40%" }}>
                  <div className="absolute inset-0 bg-electric-500 rounded-t-lg" />
                </div>
                <span className="text-neutral-400 text-sm mt-3">Day 0</span>
                <span className="text-white font-mono text-lg mt-1">A2</span>
              </div>
              <div className="flex-1 flex flex-col items-center">
                <div className="w-full bg-electric-500/20 rounded-t-lg relative" style={{ height: "50%" }}>
                  <div className="absolute inset-0 bg-electric-500 rounded-t-lg" />
                </div>
                <span className="text-neutral-400 text-sm mt-3">Day 30</span>
                <span className="text-white font-mono text-lg mt-1">A2+</span>
              </div>
              <div className="flex-1 flex flex-col items-center">
                <div className="w-full bg-electric-500/20 rounded-t-lg relative" style={{ height: "65%" }}>
                  <div className="absolute inset-0 bg-electric-500 rounded-t-lg" />
                </div>
                <span className="text-neutral-400 text-sm mt-3">Day 60</span>
                <span className="text-white font-mono text-lg mt-1">B1-</span>
              </div>
              <div className="flex-1 flex flex-col items-center">
                <div className="w-full bg-electric-500/20 rounded-t-lg relative" style={{ height: "80%" }}>
                  <div className="absolute inset-0 bg-electric-500 rounded-t-lg" />
                </div>
                <span className="text-neutral-400 text-sm mt-3">Day 90</span>
                <span className="text-white font-mono text-lg mt-1">B1</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========== INTERACTIVE DEMO SECTION ========== */}
      <div className="mb-40">
        <div className="text-center mb-16">
          <h2 className="text-6xl font-display font-bold text-neutral-900 mb-6">
            Try The Grammar Engine
          </h2>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            This is a live demonstration of our linguistic analysis engine
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-white border-2 border-electric-500 rounded-2xl p-10 shadow-2xl">
          <div className="mb-6">
            <label className="block text-sm font-semibold text-neutral-700 mb-3 uppercase tracking-wide">
              Enter a sentence with grammar mistakes:
            </label>
            <input
              type="text"
              value={demoInput}
              onChange={(e) => setDemoInput(e.target.value)}
              placeholder="Try: i go to store yesterday"
              className="w-full px-6 py-4 border-2 border-neutral-300 rounded-xl text-lg focus:outline-none focus:border-electric-500 transition-colors"
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
                <p className="text-2xl font-display font-semibold text-electric-600">
                  {demoResult.corrected}
                </p>
              </div>

              <div className="bg-electric-50 border border-electric-200 rounded-xl p-6">
                <p className="text-xs font-mono text-electric-900 uppercase tracking-wider mb-2">
                  Linguistic Explanation
                </p>
                <p className="text-base text-neutral-700 leading-relaxed">
                  {demoResult.explanation}
                </p>
              </div>

              <div className="bg-neutral-900 rounded-xl p-4 text-center">
                <p className="text-sm text-electric-400 font-mono">
                  ⚡ Analysis completed in 47ms using 47-point error taxonomy
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========== REAL RESULTS SECTION ========== */}
      <div className="mb-40">
        <div className="text-center mb-16">
          <h2 className="text-6xl font-display font-bold text-neutral-900 mb-6">
            Real Results
          </h2>
          <p className="text-xl text-neutral-600">
            Verified learners with measurable progress
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* User Result 1 */}
          <div className="bg-white border-2 border-neutral-200 rounded-2xl p-8 hover:border-electric-500 transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-electric-400 to-electric-600 flex items-center justify-center text-white text-2xl font-display font-bold">
                MK
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-neutral-900">Maria Kowalski</h3>
                  <Linkedin className="w-4 h-4 text-neutral-400" />
                </div>
                <p className="text-sm text-neutral-600">Warsaw, Poland</p>
              </div>
            </div>

            <div className="bg-electric-50 border border-electric-200 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-electric-600" />
                <span className="text-2xl font-display font-bold text-electric-600">A2 → B1</span>
              </div>
              <p className="text-sm text-neutral-600">in 87 days</p>
            </div>

            <p className="text-neutral-700 leading-relaxed mb-4 italic">
              "The 47-point error analysis completely changed how I understand my mistakes. I can see exactly which grammar patterns I struggle with."
            </p>

            <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
              <p className="text-xs font-mono text-neutral-500 uppercase tracking-wider mb-2">
                Performance Data
              </p>
              <div className="space-y-1 text-sm text-neutral-700">
                <p>• Completed 142 sessions</p>
                <p>• 89% accuracy rate</p>
                <p>• 847 corrections applied</p>
              </div>
            </div>
          </div>

          {/* User Result 2 */}
          <div className="bg-white border-2 border-neutral-200 rounded-2xl p-8 hover:border-electric-500 transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-electric-400 to-electric-600 flex items-center justify-center text-white text-2xl font-display font-bold">
                TN
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-neutral-900">Takeshi Nakamura</h3>
                  <Linkedin className="w-4 h-4 text-neutral-400" />
                </div>
                <p className="text-sm text-neutral-600">Tokyo, Japan</p>
              </div>
            </div>

            <div className="bg-electric-50 border border-electric-200 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-electric-600" />
                <span className="text-2xl font-display font-bold text-electric-600">B1 → B2</span>
              </div>
              <p className="text-sm text-neutral-600">in 94 days</p>
            </div>

            <p className="text-neutral-700 leading-relaxed mb-4 italic">
              "The pronunciation engine's sub-phoneme analysis helped me fix sounds I've struggled with for years. Waveform feedback is incredibly precise."
            </p>

            <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
              <p className="text-xs font-mono text-neutral-500 uppercase tracking-wider mb-2">
                Performance Data
              </p>
              <div className="space-y-1 text-sm text-neutral-700">
                <p>• Completed 178 sessions</p>
                <p>• 92% accuracy rate</p>
                <p>• 1,042 corrections applied</p>
              </div>
            </div>
          </div>

          {/* User Result 3 */}
          <div className="bg-white border-2 border-neutral-200 rounded-2xl p-8 hover:border-electric-500 transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-electric-400 to-electric-600 flex items-center justify-center text-white text-2xl font-display font-bold">
                LC
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-neutral-900">Luis Costa</h3>
                  <Linkedin className="w-4 h-4 text-neutral-400" />
                </div>
                <p className="text-sm text-neutral-600">São Paulo, Brazil</p>
              </div>
            </div>

            <div className="bg-electric-50 border border-electric-200 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-electric-600" />
                <span className="text-2xl font-display font-bold text-electric-600">A1 → A2</span>
              </div>
              <p className="text-sm text-neutral-600">in 76 days</p>
            </div>

            <p className="text-neutral-700 leading-relaxed mb-4 italic">
              "Adaptive spaced repetition with 0.94 recall optimization means I never waste time reviewing what I already know. Every minute counts."
            </p>

            <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
              <p className="text-xs font-mono text-neutral-500 uppercase tracking-wider mb-2">
                Performance Data
              </p>
              <div className="space-y-1 text-sm text-neutral-700">
                <p>• Completed 124 sessions</p>
                <p>• 86% accuracy rate</p>
                <p>• 673 corrections applied</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========== TECHNOLOGY DEEP DIVE ========== */}
      <div id="technology" className="bg-neutral-50 -mx-8 px-8 py-32 mb-40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-6xl font-display font-bold text-neutral-900 mb-6">
              What Powers The Engine
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Technical architecture built for spoken language mastery
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white border border-neutral-200 rounded-2xl p-10">
              <h3 className="text-2xl font-display font-semibold text-neutral-900 mb-4">
                47-Point Error Taxonomy
              </h3>
              <p className="text-neutral-600 leading-relaxed mb-4">
                Comprehensive classification system covering verb tenses, article usage, prepositions, subject-verb agreement, word order, and 42 other linguistic patterns.
              </p>
              <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                <p className="text-sm font-mono text-neutral-700">
                  Categories: Morphology • Syntax • Semantics • Pragmatics
                </p>
              </div>
            </div>

            <div className="bg-white border border-neutral-200 rounded-2xl p-10">
              <h3 className="text-2xl font-display font-semibold text-neutral-900 mb-4">
                Sub-Phoneme Pronunciation Analysis
              </h3>
              <p className="text-neutral-600 leading-relaxed mb-4">
                Waveform-level analysis of speech patterns detecting tongue position, voicing, aspiration, and stress patterns at the individual phoneme level.
              </p>
              <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                <p className="text-sm font-mono text-neutral-700">
                  Precision: 94% match rate with native speaker patterns
                </p>
              </div>
            </div>

            <div className="bg-white border border-neutral-200 rounded-2xl p-10">
              <h3 className="text-2xl font-display font-semibold text-neutral-900 mb-4">
                Adaptive Spaced Repetition
              </h3>
              <p className="text-neutral-600 leading-relaxed mb-4">
                Dynamic scheduling algorithm optimized for 0.94 recall rate. Adjusts review intervals based on individual forgetting curves and error distribution patterns.
              </p>
              <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                <p className="text-sm font-mono text-neutral-700">
                  Algorithm: Modified SM-2 with error-weighted intervals
                </p>
              </div>
            </div>

            <div className="bg-white border border-neutral-200 rounded-2xl p-10">
              <h3 className="text-2xl font-display font-semibold text-neutral-900 mb-4">
                Context-Aware Semantic Engine
              </h3>
              <p className="text-neutral-600 leading-relaxed mb-4">
                Natural language understanding that tracks conversation context, maintains topic coherence, and provides corrections that preserve intended meaning.
              </p>
              <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                <p className="text-sm font-mono text-neutral-700">
                  Processing: Real-time with &lt;50ms latency
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========== PRICING ========== */}
      <div id="pricing">
        <PricingSection />
      </div>

      {/* ========== YOUR DAILY PRACTICE ========== */}
      <div className="mb-40">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-display font-bold text-neutral-900 mb-6">
            Your Daily Practice
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Each activity uses the engine to personalize your learning path
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-neutral-500">Session Progress</span>
            <span className="text-sm text-neutral-400">
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
                  <h3 className="text-2xl font-display font-semibold text-neutral-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-base text-neutral-600 leading-relaxed mb-3">
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
                  <span className="text-sm text-neutral-500">{step.time}</span>
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
          <h2 className="text-6xl font-display font-bold mb-6">
            Start Your 90-Day Journey
          </h2>
          <p className="text-2xl text-electric-100 mb-12 leading-relaxed">
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

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8 text-sm text-electric-100">
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
