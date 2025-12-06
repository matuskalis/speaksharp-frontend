"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { apiClient } from "@/lib/api-client";
import { PlacementQuestion, PlacementTestResult } from "@/lib/types";
import { CheckCircle, ArrowRight, ArrowLeft, Sparkles, Target } from "lucide-react";

type TestState = "not_started" | "in_progress" | "completed";

interface PlacementTestProps {
  onComplete?: () => void;
}

export default function PlacementTest({ onComplete }: PlacementTestProps = {}) {
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

    // Auto-advance to next question if not the last one
    if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }, 300);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
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

  // Not Started State
  if (state === "not_started") {
    return (
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-gradient-brand rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-btn-glow">
            <Target className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-text-primary mb-4">
            Placement Test
          </h2>
          <p className="text-lg text-text-secondary mb-8">
            Find your English level (A1-C2) in 10 minutes
          </p>

          <div className="glass gradient-border rounded-2xl p-6 mb-8 text-left">
            <h3 className="font-semibold text-text-primary mb-3">What to expect:</h3>
            <ul className="space-y-3 text-text-secondary">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span>12 questions covering grammar and vocabulary</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span>Questions range from beginner (A1) to advanced (C2)</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span>Takes about 5-10 minutes to complete</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span>Instant results with personalized recommendations</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <button
              onClick={startTest}
              disabled={loading}
              className="px-8 py-4 bg-gradient-brand text-white rounded-xl font-semibold shadow-btn-glow hover:shadow-btn-glow-hover transition-all disabled:opacity-50 text-lg inline-flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Sparkles className="w-5 h-5 animate-pulse" />
                  Loading...
                </>
              ) : (
                <>
                  Start Placement Test
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
            <button
              onClick={() => router.push("/learn")}
              className="text-text-muted hover:text-text-primary underline text-sm transition-colors"
            >
              Skip test and start learning
            </button>
          </div>
        </motion.div>

        {error && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-center">
            {error}
          </div>
        )}
      </div>
    );
  }

  // In Progress State
  if (state === "in_progress" && questions.length > 0) {
    const currentQuestion = questions[currentQuestionIndex];
    const selectedAnswer = answers[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    const allAnswered = answers.every(a => a !== -1);

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        <div className="glass gradient-border rounded-2xl p-6">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-text-secondary mb-2">
              <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <div className="w-full bg-dark-300 rounded-full h-3">
              <motion.div
                className="bg-gradient-brand h-3 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-text-muted">
                {currentQuestion.skill_type === "grammar" ? "📝 Grammar" : "📚 Vocabulary"}
              </span>
              <span className="text-xs bg-accent-purple/20 text-accent-purple px-2 py-1 rounded-full">
                Level: {currentQuestion.level}
              </span>
            </div>
            <h3 className="text-xl text-text-primary font-medium mb-6">
              {currentQuestion.question_text}
            </h3>

            {/* Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <motion.button
                  key={index}
                  onClick={() => selectAnswer(index)}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full p-4 rounded-xl text-left transition-all duration-200 font-medium ${
                    selectedAnswer === index
                      ? "bg-gradient-brand border-2 border-accent-purple text-white shadow-btn-glow"
                      : "bg-dark-200 border-2 border-white/[0.08] hover:border-accent-purple/50 text-text-primary hover:bg-dark-300"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-mono text-sm ${
                      selectedAnswer === index
                        ? "bg-white/20 text-white"
                        : "bg-dark-300 text-text-muted"
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span>{option}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={previousQuestion}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 flex items-center gap-2 bg-dark-200 text-text-secondary rounded-lg hover:bg-dark-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>

            {currentQuestionIndex === questions.length - 1 && (
              <button
                onClick={submitTest}
                disabled={!allAnswered || loading}
                className="px-6 py-3 bg-gradient-brand text-white rounded-xl font-semibold shadow-btn-glow hover:shadow-btn-glow-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Sparkles className="w-5 h-5 animate-pulse" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Test
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            )}
          </div>

          {!allAnswered && currentQuestionIndex === questions.length - 1 && (
            <p className="text-center text-amber-400 text-sm mt-4">
              Please answer all questions before submitting
            </p>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-center">
            {error}
          </div>
        )}
      </motion.div>
    );
  }

  // Completed State
  if (state === "completed" && result) {
    const levelColors: Record<string, string> = {
      A1: "from-green-500 to-emerald-400",
      A2: "from-blue-500 to-cyan-400",
      B1: "from-purple-500 to-violet-400",
      B2: "from-indigo-500 to-blue-400",
      C1: "from-orange-500 to-amber-400",
      C2: "from-rose-500 to-pink-400",
    };

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-6"
      >
        <div className="glass gradient-border rounded-2xl p-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-text-primary mb-2">Test Complete!</h2>
            <p className="text-text-secondary">Here are your results</p>
          </div>

          {/* Level Badge */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 10 }}
              className={`inline-block px-12 py-6 rounded-2xl bg-gradient-to-r ${levelColors[result.level] || "from-purple-500 to-pink-500"} shadow-lg`}
            >
              <div className="text-white/80 text-sm mb-1">Your Level</div>
              <div className="text-5xl font-bold text-white">{result.level}</div>
            </motion.div>
          </div>

          {/* Score */}
          <div className="bg-dark-200 border border-white/[0.08] rounded-xl p-6 mb-6 text-center">
            <div className="text-text-muted mb-2">Score</div>
            <div className="text-3xl font-bold text-text-primary">
              {result.score} / {result.total_questions}
            </div>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
              <h4 className="text-green-400 font-semibold mb-2">Strengths</h4>
              <ul className="text-text-secondary text-sm space-y-1">
                {result.strengths.map((strength, idx) => (
                  <li key={idx}>• {strength}</li>
                ))}
              </ul>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
              <h4 className="text-amber-400 font-semibold mb-2">Areas to Improve</h4>
              <ul className="text-text-secondary text-sm space-y-1">
                {result.weaknesses.map((weakness, idx) => (
                  <li key={idx}>• {weakness}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recommendation */}
          <div className="bg-accent-purple/10 border border-accent-purple/30 rounded-xl p-6 mb-8">
            <h4 className="text-accent-purple font-semibold mb-2">Recommendation</h4>
            <p className="text-text-secondary">{result.recommendation}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={restartTest}
              className="flex-1 px-6 py-3 bg-dark-200 text-text-secondary rounded-xl hover:bg-dark-300 transition-colors"
            >
              Retake Test
            </button>
            <button
              onClick={() => {
                if (onComplete) {
                  onComplete();
                } else {
                  router.push("/learn");
                }
              }}
              className="flex-1 px-6 py-3 bg-gradient-brand text-white rounded-xl font-semibold shadow-btn-glow hover:shadow-btn-glow-hover transition-all flex items-center justify-center gap-2"
            >
              Start Learning
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return null;
}
