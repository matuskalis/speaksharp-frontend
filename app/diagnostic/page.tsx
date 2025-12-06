"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { apiClient } from "@/lib/api-client";
import { DiagnosticQuestion, DiagnosticProgress, DiagnosticStats } from "@/lib/types";
import { CheckCircle, XCircle, ArrowRight, Sparkles, Target, BookOpen } from "lucide-react";

type TestState = "loading" | "in_progress" | "feedback" | "completed";

export default function DiagnosticTestPage() {
  const router = useRouter();
  const [state, setState] = useState<TestState>("loading");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<DiagnosticQuestion | null>(null);
  const [progress, setProgress] = useState<DiagnosticProgress>({ answered: 0, max: 18 });
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; correctAnswer: string } | null>(null);
  const [result, setResult] = useState<{ userLevel: string; stats: DiagnosticStats; questionsAnswered: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startTest = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.startDiagnostic();

      if (response.done) {
        // Already completed
        setResult({
          userLevel: response.user_level || "A1",
          stats: response.summary?.stats || { A1: { correct: 0, total: 0 }, A2: { correct: 0, total: 0 }, B1: { correct: 0, total: 0 } },
          questionsAnswered: response.summary?.questions_answered || 0
        });
        setState("completed");
      } else if (response.question) {
        setSessionId(response.session_id || null);
        setCurrentQuestion(response.question);
        setProgress(response.progress || { answered: 0, max: 18 });
        setState("in_progress");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start test");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    startTest();
  }, [startTest]);

  const submitAnswer = async () => {
    if (!sessionId || !currentQuestion || !selectedAnswer) return;

    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.submitDiagnosticAnswer({
        session_id: sessionId,
        exercise_id: currentQuestion.exercise_id,
        user_answer: selectedAnswer
      });

      // Show feedback
      setFeedback({
        isCorrect: response.is_correct,
        correctAnswer: response.correct_answer
      });
      setState("feedback");

      // After 1.5 seconds, move to next question or show results
      setTimeout(() => {
        if (response.done) {
          setResult({
            userLevel: response.user_level || "A1",
            stats: response.summary?.stats || { A1: { correct: 0, total: 0 }, A2: { correct: 0, total: 0 }, B1: { correct: 0, total: 0 } },
            questionsAnswered: response.summary?.questions_answered || 0
          });
          setState("completed");
        } else if (response.question) {
          setCurrentQuestion(response.question);
          setProgress(response.progress || progress);
          setSelectedAnswer(null);
          setFeedback(null);
          setState("in_progress");
        }
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit answer");
      setState("in_progress");
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (state === "loading") {
    return (
      <main className="min-h-screen bg-[#030303] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-brand rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Target className="w-8 h-8 text-white" />
          </div>
          <p className="text-text-secondary text-lg">Loading diagnostic test...</p>
        </div>
      </main>
    );
  }

  // Completed state
  if (state === "completed" && result) {
    const levelColors: Record<string, string> = {
      A1: "from-green-500 to-emerald-400",
      A2: "from-blue-500 to-cyan-400",
      B1: "from-purple-500 to-violet-400",
    };

    const totalCorrect = result.stats.A1.correct + result.stats.A2.correct + result.stats.B1.correct;
    const totalAnswered = result.stats.A1.total + result.stats.A2.total + result.stats.B1.total;

    return (
      <main className="min-h-screen bg-[#030303] py-12 px-4">
        <div className="max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass gradient-border rounded-2xl p-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-text-primary mb-2">Diagnostic Complete!</h2>
              <p className="text-text-secondary">Your skills have been assessed</p>
            </div>

            {/* Level Badge */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 10, delay: 0.2 }}
                className={`inline-block px-12 py-6 rounded-2xl bg-gradient-to-r ${levelColors[result.userLevel] || "from-purple-500 to-pink-500"} shadow-lg`}
              >
                <div className="text-white/80 text-sm mb-1">Your Level</div>
                <div className="text-5xl font-bold text-white">{result.userLevel}</div>
              </motion.div>
            </div>

            {/* Score */}
            <div className="bg-dark-200 border border-white/[0.08] rounded-xl p-6 mb-6 text-center">
              <div className="text-text-muted mb-2">Score</div>
              <div className="text-3xl font-bold text-text-primary">
                {totalCorrect} / {totalAnswered}
              </div>
            </div>

            {/* Level Breakdown */}
            <div className="space-y-3 mb-8">
              {(["A1", "A2", "B1"] as const).map((level) => {
                const stats = result.stats[level];
                const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
                return (
                  <div key={level} className="flex items-center justify-between bg-dark-200 border border-white/[0.08] rounded-lg p-4">
                    <span className="text-text-primary font-medium">{level}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-text-secondary text-sm">
                        {stats.correct}/{stats.total} correct
                      </span>
                      <span className={`font-mono font-bold ${accuracy >= 70 ? "text-green-400" : accuracy >= 40 ? "text-amber-400" : "text-red-400"}`}>
                        {accuracy}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mastery seeded message */}
            <div className="bg-accent-purple/10 border border-accent-purple/30 rounded-xl p-6 mb-8">
              <h4 className="text-accent-purple font-semibold mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Initial Mastery Set
              </h4>
              <p className="text-text-secondary text-sm">
                Based on your performance, we've calibrated your starting mastery for 120 micro-skills.
                The system will continue to adapt as you practice.
              </p>
            </div>

            {/* Continue button */}
            <button
              onClick={() => router.push("/learn")}
              className="w-full px-6 py-4 bg-gradient-brand text-white rounded-xl font-semibold shadow-btn-glow hover:shadow-btn-glow-hover transition-all flex items-center justify-center gap-2"
            >
              <BookOpen className="w-5 h-5" />
              Start Learning
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </main>
    );
  }

  // In Progress / Feedback state
  return (
    <main className="min-h-screen bg-[#030303] py-12 px-4">
      <div className="max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass gradient-border rounded-2xl p-6"
        >
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-text-secondary mb-2">
              <span>Question {progress.answered + 1} of {progress.max}</span>
              <span className="text-xs bg-accent-purple/20 text-accent-purple px-2 py-1 rounded-full">
                Level: {currentQuestion?.level}
              </span>
            </div>
            <div className="w-full bg-dark-300 rounded-full h-3">
              <motion.div
                className="bg-gradient-brand h-3 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                initial={{ width: 0 }}
                animate={{ width: `${((progress.answered + 1) / progress.max) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="mb-8">
            <h3 className="text-xl text-text-primary font-medium mb-6">
              {currentQuestion?.question}
            </h3>

            {/* Options */}
            <div className="space-y-3">
              {currentQuestion?.options.map((option, index) => {
                const isSelected = selectedAnswer === option;
                const showCorrect = state === "feedback" && feedback?.correctAnswer === option;
                const showIncorrect = state === "feedback" && isSelected && !feedback?.isCorrect;

                return (
                  <motion.button
                    key={index}
                    onClick={() => state === "in_progress" && setSelectedAnswer(option)}
                    disabled={state === "feedback" || loading}
                    whileTap={{ scale: state === "in_progress" ? 0.98 : 1 }}
                    className={`w-full p-4 rounded-xl text-left transition-all duration-200 font-medium ${
                      showCorrect
                        ? "bg-green-500/20 border-2 border-green-500 text-green-400"
                        : showIncorrect
                        ? "bg-red-500/20 border-2 border-red-500 text-red-400"
                        : isSelected
                        ? "bg-gradient-brand border-2 border-accent-purple text-white shadow-btn-glow"
                        : "bg-dark-200 border-2 border-white/[0.08] hover:border-accent-purple/50 text-text-primary hover:bg-dark-300"
                    } ${state === "feedback" ? "cursor-default" : ""}`}
                  >
                    <div className="flex items-center gap-4">
                      <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-mono text-sm ${
                        showCorrect
                          ? "bg-green-500/30 text-green-400"
                          : showIncorrect
                          ? "bg-red-500/30 text-red-400"
                          : isSelected
                          ? "bg-white/20 text-white"
                          : "bg-dark-300 text-text-muted"
                      }`}>
                        {showCorrect ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : showIncorrect ? (
                          <XCircle className="w-5 h-5" />
                        ) : (
                          String.fromCharCode(65 + index)
                        )}
                      </span>
                      <span>{option}</span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Feedback message */}
          {state === "feedback" && feedback && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-xl mb-4 text-center ${
                feedback.isCorrect
                  ? "bg-green-500/10 border border-green-500/30 text-green-400"
                  : "bg-red-500/10 border border-red-500/30 text-red-400"
              }`}
            >
              {feedback.isCorrect ? "Correct!" : `Incorrect. The answer is: ${feedback.correctAnswer}`}
            </motion.div>
          )}

          {/* Submit Button */}
          {state === "in_progress" && (
            <button
              onClick={submitAnswer}
              disabled={!selectedAnswer || loading}
              className="w-full px-6 py-4 bg-gradient-brand text-white rounded-xl font-semibold shadow-btn-glow hover:shadow-btn-glow-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Sparkles className="w-5 h-5 animate-pulse" />
                  Checking...
                </>
              ) : (
                <>
                  Submit Answer
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-center">
              {error}
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
