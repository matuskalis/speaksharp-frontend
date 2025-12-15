"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { apiClient } from "@/lib/api-client";
import { AdaptiveQuestion, PlacementTestResult } from "@/lib/types";
import { CheckCircle, XCircle, ArrowRight, Sparkles, Target, Brain, TrendingUp, TrendingDown } from "lucide-react";

type TestState = "not_started" | "in_progress" | "showing_feedback" | "completed";

interface PlacementTestProps {
  onComplete?: () => void;
}

const SKILL_ICONS: Record<string, string> = {
  grammar: "Grammar",
  vocabulary: "Vocabulary",
  reading: "Reading",
  collocations: "Collocations",
};

const LEVEL_COLORS: Record<string, string> = {
  A1: "from-green-500 to-emerald-400",
  A2: "from-blue-500 to-cyan-400",
  B1: "from-purple-500 to-violet-400",
  B2: "from-indigo-500 to-blue-400",
  C1: "from-orange-500 to-amber-400",
  C2: "from-rose-500 to-pink-400",
};

export default function PlacementTest({ onComplete }: PlacementTestProps = {}) {
  const router = useRouter();
  const [state, setState] = useState<TestState>("not_started");
  const [sessionId, setSessionId] = useState<string>("");
  const [currentQuestion, setCurrentQuestion] = useState<AdaptiveQuestion | null>(null);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [currentLevel, setCurrentLevel] = useState("B1");
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{
    isCorrect: boolean;
    correctAnswer: number;
    explanation: string;
  } | null>(null);
  const [result, setResult] = useState<PlacementTestResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previousLevel, setPreviousLevel] = useState<string | null>(null);

  const startTest = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.startAdaptivePlacementTest();
      setSessionId(response.session_id);
      setCurrentQuestion(response.question);
      setQuestionNumber(response.question_number);
      setCurrentLevel(response.current_level);
      setState("in_progress");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start test");
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async (optionIndex: number) => {
    if (!currentQuestion || selectedAnswer !== null) return;

    setSelectedAnswer(optionIndex);
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.submitAdaptiveAnswer({
        session_id: sessionId,
        question_id: currentQuestion.id,
        answer: optionIndex,
      });

      setFeedback({
        isCorrect: response.is_correct,
        correctAnswer: response.correct_answer,
        explanation: response.explanation,
      });
      setState("showing_feedback");

      // Track level changes for animation
      if (response.current_level && response.current_level !== currentLevel) {
        setPreviousLevel(currentLevel);
        setCurrentLevel(response.current_level);
      } else {
        setPreviousLevel(null);
      }

      if (response.is_complete && response.final_result) {
        // Test is complete
        setTimeout(() => {
          setResult(response.final_result!);
          setState("completed");
        }, 2000);
      } else if (response.next_question) {
        // Continue to next question after showing feedback
        setTimeout(() => {
          setCurrentQuestion(response.next_question!);
          setQuestionNumber(response.question_number || questionNumber + 1);
          setSelectedAnswer(null);
          setFeedback(null);
          setState("in_progress");
        }, 2000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit answer");
      setSelectedAnswer(null);
      setState("in_progress");
    } finally {
      setLoading(false);
    }
  };

  const restartTest = () => {
    setState("not_started");
    setSessionId("");
    setCurrentQuestion(null);
    setQuestionNumber(0);
    setCurrentLevel("B1");
    setSelectedAnswer(null);
    setFeedback(null);
    setResult(null);
    setError(null);
    setPreviousLevel(null);
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
            Adaptive Placement Test
          </h2>
          <p className="text-lg text-text-secondary mb-8">
            Find your English level (A1-C2) in about 5 minutes
          </p>

          <div className="glass gradient-border rounded-2xl p-6 mb-8 text-left">
            <h3 className="font-semibold text-text-primary mb-3">How it works:</h3>
            <ul className="space-y-3 text-text-secondary">
              <li className="flex items-start gap-3">
                <Brain className="w-5 h-5 text-accent-purple flex-shrink-0 mt-0.5" />
                <span>Intelligent adaptive testing - questions adjust to your level</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span>Instant feedback after each question</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span>6-12 questions covering grammar, vocabulary, and reading</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span>More accurate placement than traditional tests</span>
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

  // In Progress / Showing Feedback State
  if ((state === "in_progress" || state === "showing_feedback") && currentQuestion) {
    const skillType = SKILL_ICONS[currentQuestion.skill_type] || currentQuestion.skill_type;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        <div className="glass gradient-border rounded-2xl p-6">
          {/* Header with level indicator */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-text-secondary">
                Question {questionNumber}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-muted">Current Level:</span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentLevel}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className={`text-sm font-bold px-3 py-1 rounded-full bg-gradient-to-r ${LEVEL_COLORS[currentLevel] || "from-purple-500 to-pink-500"} text-white`}
                  >
                    {currentLevel}
                  </motion.span>
                </AnimatePresence>
                {previousLevel && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center"
                  >
                    {currentLevel > previousLevel ? (
                      <TrendingUp className="w-4 h-4 text-green-400" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-amber-400" />
                    )}
                  </motion.span>
                )}
              </div>
            </div>

            {/* Progress dots */}
            <div className="flex gap-1.5 justify-center">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i < questionNumber
                      ? "bg-accent-purple"
                      : i === questionNumber - 1
                      ? "bg-accent-purple scale-125"
                      : "bg-dark-300"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Question */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-text-muted">
                {skillType}
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
              {currentQuestion.options.map((option, index) => {
                let buttonClass = "bg-dark-200 border-2 border-white/[0.08] hover:border-accent-purple/50 text-text-primary hover:bg-dark-300";

                if (selectedAnswer !== null) {
                  if (feedback?.isCorrect && index === selectedAnswer) {
                    buttonClass = "bg-green-500/20 border-2 border-green-500 text-green-400";
                  } else if (!feedback?.isCorrect && index === selectedAnswer) {
                    buttonClass = "bg-red-500/20 border-2 border-red-500 text-red-400";
                  } else if (!feedback?.isCorrect && index === feedback?.correctAnswer) {
                    buttonClass = "bg-green-500/20 border-2 border-green-500 text-green-400";
                  } else {
                    buttonClass = "bg-dark-200 border-2 border-white/[0.08] text-text-muted opacity-50";
                  }
                }

                return (
                  <motion.button
                    key={index}
                    onClick={() => submitAnswer(index)}
                    disabled={selectedAnswer !== null || loading}
                    whileTap={selectedAnswer === null ? { scale: 0.98 } : undefined}
                    className={`w-full p-4 rounded-xl text-left transition-all duration-200 font-medium disabled:cursor-not-allowed ${buttonClass}`}
                  >
                    <div className="flex items-center gap-4">
                      <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-mono text-sm ${
                        selectedAnswer === index
                          ? feedback?.isCorrect
                            ? "bg-green-500/30 text-green-400"
                            : "bg-red-500/30 text-red-400"
                          : selectedAnswer !== null && index === feedback?.correctAnswer
                          ? "bg-green-500/30 text-green-400"
                          : "bg-dark-300 text-text-muted"
                      }`}>
                        {selectedAnswer !== null && (
                          index === feedback?.correctAnswer ? (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          ) : index === selectedAnswer && !feedback?.isCorrect ? (
                            <XCircle className="w-5 h-5 text-red-400" />
                          ) : (
                            String.fromCharCode(65 + index)
                          )
                        )}
                        {selectedAnswer === null && String.fromCharCode(65 + index)}
                      </span>
                      <span>{option}</span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Feedback */}
          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`p-4 rounded-xl ${
                  feedback.isCorrect
                    ? "bg-green-500/10 border border-green-500/30"
                    : "bg-red-500/10 border border-red-500/30"
                }`}
              >
                <div className="flex items-start gap-3">
                  {feedback.isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className={`font-semibold ${feedback.isCorrect ? "text-green-400" : "text-red-400"}`}>
                      {feedback.isCorrect ? "Correct!" : "Incorrect"}
                    </p>
                    <p className="text-text-secondary text-sm mt-1">
                      {feedback.explanation}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {loading && selectedAnswer !== null && (
            <div className="text-center text-text-muted mt-4">
              <Sparkles className="w-5 h-5 animate-pulse inline mr-2" />
              Processing...
            </div>
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
              className={`inline-block px-12 py-6 rounded-2xl bg-gradient-to-r ${LEVEL_COLORS[result.level] || "from-purple-500 to-pink-500"} shadow-lg`}
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
