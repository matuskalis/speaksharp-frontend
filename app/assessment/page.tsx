"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { PlacementQuestion, PlacementTestResult } from "@/lib/types";
import { AppShell } from "@/components/app-shell";
import { Check, ArrowRight, ArrowLeft, Sparkles, Trophy, Target, TrendingUp } from "lucide-react";

type TestState = "not_started" | "in_progress" | "completed";

export default function AssessmentPage() {
  const router = useRouter();
  const [state, setState] = useState<TestState>("not_started");
  const [questions, setQuestions] = useState<PlacementQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<PlacementTestResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startTest = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.getPlacementTestQuestions();
      setQuestions(response.questions);
      setAnswers(new Array(response.questions.length).fill(-1));
      setState("in_progress");
      setCurrentQuestionIndex(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load test");
    } finally {
      setLoading(false);
    }
  };

  const selectAnswer = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }, 300);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const submitTest = async () => {
    setLoading(true);
    setError(null);
    try {
      const testResult = await apiClient.submitPlacementTest({ answers });
      setResult(testResult);
      setState("completed");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit test");
    } finally {
      setLoading(false);
    }
  };

  const restartTest = () => {
    setState("not_started");
    setQuestions([]);
    setAnswers([]);
    setCurrentQuestionIndex(0);
    setResult(null);
    setError(null);
  };

  // NOT STARTED STATE
  if (state === "not_started") {
    return (
      <AppShell>
        <div className="min-h-screen bg-white">
          <div className="max-w-4xl mx-auto px-8 py-24">
            {/* Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-electric-50 text-electric-700 px-4 py-2 rounded-full text-sm font-mono mb-6">
                <Sparkles className="w-4 h-4" />
                <span>15-MINUTE FLUENCY ASSESSMENT</span>
              </div>

              <h1 className="text-6xl font-serif font-bold text-neutral-900 mb-6 leading-tight">
                Discover Your English Level
              </h1>

              <p className="text-2xl text-neutral-600 max-w-2xl mx-auto leading-relaxed">
                AI-powered CEFR assessment with personalized learning path recommendations
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="bg-neutral-50 border-2 border-neutral-200 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-electric-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-serif font-semibold text-neutral-900 mb-2">
                      Precise CEFR Rating
                    </h3>
                    <p className="text-neutral-600">
                      Accurately determine your level from A1 (beginner) to C2 (mastery)
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-neutral-50 border-2 border-neutral-200 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-electric-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-serif font-semibold text-neutral-900 mb-2">
                      Adaptive Testing
                    </h3>
                    <p className="text-neutral-600">
                      Questions adjust difficulty based on your responses
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-neutral-50 border-2 border-neutral-200 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-electric-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-serif font-semibold text-neutral-900 mb-2">
                      Instant Results
                    </h3>
                    <p className="text-neutral-600">
                      Get your level, strengths, and improvement areas immediately
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-neutral-50 border-2 border-neutral-200 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-electric-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-serif font-semibold text-neutral-900 mb-2">
                      Personalized Path
                    </h3>
                    <p className="text-neutral-600">
                      Receive a customized 90-day learning roadmap
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* What to Expect */}
            <div className="bg-electric-50 border-2 border-electric-200 rounded-xl p-8 mb-12">
              <h3 className="text-xl font-serif font-semibold text-neutral-900 mb-4">
                What to Expect
              </h3>
              <div className="space-y-3">
                {[
                  "12 carefully designed questions covering grammar and vocabulary",
                  "Questions range from beginner (A1) to advanced (C2)",
                  "Takes approximately 10-15 minutes to complete",
                  "Detailed analysis of your strengths and areas to improve"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-electric-600 flex-shrink-0 mt-0.5" />
                    <span className="text-neutral-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <button
                onClick={startTest}
                disabled={loading}
                className="inline-flex items-center gap-3 px-12 py-5 bg-neutral-900 text-white text-lg font-semibold rounded-lg hover:bg-neutral-800 transition-all disabled:opacity-50 shadow-xl hover:shadow-2xl hover:scale-105 transform"
              >
                {loading ? "Loading Questions..." : "Begin Assessment"}
                <ArrowRight className="w-5 h-5" />
              </button>

              <p className="text-neutral-500 mt-4 text-sm">
                No credit card required • Takes 10-15 minutes
              </p>
            </div>

            {error && (
              <div className="mt-8 p-4 bg-red-50 border-2 border-red-200 rounded-lg text-red-700 text-center">
                <p className="font-semibold">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            )}
          </div>
        </div>
      </AppShell>
    );
  }

  // IN PROGRESS STATE
  if (state === "in_progress" && questions.length > 0) {
    const currentQuestion = questions[currentQuestionIndex];
    const selectedAnswer = answers[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    const allAnswered = answers.every(a => a !== -1);

    return (
      <AppShell>
        <div className="min-h-screen bg-neutral-50">
          <div className="max-w-3xl mx-auto px-8 py-12">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm font-mono text-neutral-600 mb-3">
                <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-3">
                <div
                  className="bg-electric-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-white border-2 border-neutral-200 rounded-2xl p-10 shadow-lg">
              {/* Question Type & Level */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-mono text-electric-600 bg-electric-50 px-3 py-1.5 rounded-lg">
                  {currentQuestion.skill_type === "grammar" ? "📝 GRAMMAR" : "📚 VOCABULARY"}
                </span>
                <span className="text-xs font-mono bg-neutral-100 text-neutral-600 px-3 py-1.5 rounded-lg">
                  LEVEL: {currentQuestion.level}
                </span>
              </div>

              {/* Question Text */}
              <h3 className="text-2xl font-serif font-semibold text-neutral-900 mb-8 leading-relaxed">
                {currentQuestion.question_text}
              </h3>

              {/* Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => selectAnswer(index)}
                    className={`w-full p-5 rounded-xl text-left transition-all duration-200 font-medium ${
                      selectedAnswer === index
                        ? "bg-electric-500 border-2 border-electric-600 text-white shadow-lg scale-[1.02]"
                        : "bg-neutral-50 border-2 border-neutral-200 hover:border-electric-400 text-neutral-900 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-mono text-sm ${
                        selectedAnswer === index
                          ? "bg-white text-electric-600"
                          : "bg-neutral-200 text-neutral-600"
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span>{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8">
              <button
                onClick={previousQuestion}
                disabled={currentQuestionIndex === 0}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-neutral-200 text-neutral-900 rounded-lg font-semibold hover:border-neutral-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </button>

              {currentQuestionIndex === questions.length - 1 && (
                <button
                  onClick={submitTest}
                  disabled={!allAnswered || loading}
                  className="inline-flex items-center gap-2 px-8 py-3 bg-electric-500 text-white rounded-lg font-semibold hover:bg-electric-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
                >
                  {loading ? "Analyzing..." : "Submit Assessment"}
                  <Check className="w-5 h-5" />
                </button>
              )}
            </div>

            {!allAnswered && currentQuestionIndex === questions.length - 1 && (
              <p className="text-center text-amber-700 bg-amber-50 border-2 border-amber-200 rounded-lg p-4 mt-6 font-medium">
                ⚠️ Please answer all questions before submitting
              </p>
            )}

            {error && (
              <div className="mt-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg text-red-700 text-center">
                <p className="font-semibold">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            )}
          </div>
        </div>
      </AppShell>
    );
  }

  // COMPLETED STATE
  if (state === "completed" && result) {
    const levelColors: Record<string, { bg: string; border: string; text: string }> = {
      A1: { bg: "bg-green-500", border: "border-green-500", text: "text-green-700" },
      A2: { bg: "bg-blue-500", border: "border-blue-500", text: "text-blue-700" },
      B1: { bg: "bg-purple-500", border: "border-purple-500", text: "text-purple-700" },
      B2: { bg: "bg-indigo-500", border: "border-indigo-500", text: "text-indigo-700" },
      C1: { bg: "bg-orange-500", border: "border-orange-500", text: "text-orange-700" },
      C2: { bg: "bg-rose-500", border: "border-rose-500", text: "text-rose-700" },
    };

    const colors = levelColors[result.level] || { bg: "bg-neutral-900", border: "border-neutral-900", text: "text-neutral-900" };

    return (
      <AppShell>
        <div className="min-h-screen bg-white">
          <div className="max-w-4xl mx-auto px-8 py-24">
            {/* Celebration Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-electric-50 text-electric-700 px-4 py-2 rounded-full text-sm font-mono mb-6">
                <Trophy className="w-4 h-4" />
                <span>ASSESSMENT COMPLETE</span>
              </div>

              <h1 className="text-6xl font-serif font-bold text-neutral-900 mb-6">
                Your Results Are Ready
              </h1>

              <p className="text-xl text-neutral-600">
                Here's your comprehensive English proficiency analysis
              </p>
            </div>

            {/* Level Badge */}
            <div className="text-center mb-12">
              <div className={`inline-block px-16 py-10 rounded-2xl ${colors.bg} shadow-2xl`}>
                <div className="text-white/80 text-sm font-mono mb-2 uppercase tracking-wider">
                  Your CEFR Level
                </div>
                <div className="text-7xl font-serif font-bold text-white">
                  {result.level}
                </div>
              </div>
            </div>

            {/* Score */}
            <div className={`bg-white border-4 ${colors.border} rounded-2xl p-8 mb-8 text-center`}>
              <div className="text-neutral-600 font-mono text-sm mb-2 uppercase tracking-wider">
                Assessment Score
              </div>
              <div className="text-5xl font-serif font-bold text-neutral-900">
                {result.score} / {result.total_questions}
              </div>
              <div className="text-neutral-600 mt-2">
                {Math.round((result.score / result.total_questions) * 100)}% Accuracy
              </div>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
                <h3 className="text-green-700 font-serif font-semibold text-xl mb-4 flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  Strengths
                </h3>
                <ul className="space-y-2">
                  {result.strengths.map((strength, idx) => (
                    <li key={idx} className="text-neutral-700 flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6">
                <h3 className="text-amber-700 font-serif font-semibold text-xl mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Areas to Improve
                </h3>
                <ul className="space-y-2">
                  {result.weaknesses.map((weakness, idx) => (
                    <li key={idx} className="text-neutral-700 flex items-start gap-2">
                      <span className="text-amber-600 mt-1">•</span>
                      <span>{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Recommendation */}
            <div className="bg-electric-50 border-2 border-electric-200 rounded-xl p-8 mb-10">
              <h3 className="text-electric-700 font-serif font-semibold text-xl mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Personalized Recommendation
              </h3>
              <p className="text-neutral-700 text-lg leading-relaxed">
                {result.recommendation}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={restartTest}
                className="flex-1 px-8 py-4 bg-white border-2 border-neutral-200 text-neutral-900 rounded-lg font-semibold hover:border-neutral-400 transition-all text-lg"
              >
                Retake Assessment
              </button>
              <button
                onClick={() => router.push("/learn")}
                className="flex-1 px-8 py-4 bg-neutral-900 text-white rounded-lg font-semibold hover:bg-neutral-800 transition-all shadow-xl text-lg inline-flex items-center justify-center gap-2"
              >
                Start Learning
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  return null;
}
