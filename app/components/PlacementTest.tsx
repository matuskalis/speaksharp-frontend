"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { PlacementQuestion, PlacementTestResult } from "@/lib/types";

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
      }, 300); // Small delay for visual feedback
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
        <div className="text-center">
          <h2 className="text-4xl font-semibold text-neutral-900 mb-4">
            Placement Test
          </h2>
          <p className="text-lg text-neutral-600 mb-8">
            Find your English level (A1-C2) in 10 minutes
          </p>

          <div className="bg-neutral-50 border-2 border-neutral-200 rounded-lg p-6 mb-8 text-left">
            <h3 className="font-semibold text-neutral-900 mb-3">What to expect:</h3>
            <ul className="space-y-2 text-neutral-600">
              <li className="flex items-start">
                <span className="text-neutral-900 mr-2">✓</span>
                <span>12 questions covering grammar and vocabulary</span>
              </li>
              <li className="flex items-start">
                <span className="text-neutral-900 mr-2">✓</span>
                <span>Questions range from beginner (A1) to advanced (C2)</span>
              </li>
              <li className="flex items-start">
                <span className="text-neutral-900 mr-2">✓</span>
                <span>Takes about 5-10 minutes to complete</span>
              </li>
              <li className="flex items-start">
                <span className="text-neutral-900 mr-2">✓</span>
                <span>Instant results with personalized recommendations</span>
              </li>
            </ul>
          </div>

          <button
            onClick={startTest}
            disabled={loading}
            className="px-8 py-4 bg-neutral-900 text-white rounded-lg font-semibold hover:bg-neutral-800 transition-all disabled:opacity-50 text-lg"
          >
            {loading ? "Loading..." : "Start Placement Test"}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border-2 border-red-200 rounded-lg text-red-600 text-center">
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
      <div className="space-y-8">
        <div className="bg-white border-2 border-neutral-200 rounded-lg p-8">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-neutral-600 mb-2">
              <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-2">
              <div
                className="bg-neutral-900 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-neutral-600">
                {currentQuestion.skill_type === "grammar" ? "📝 Grammar" : "📚 Vocabulary"}
              </span>
              <span className="text-xs bg-neutral-100 text-neutral-600 px-2 py-1 rounded">
                Level: {currentQuestion.level}
              </span>
            </div>
            <h3 className="text-xl text-neutral-900 font-medium mb-6">
              {currentQuestion.question_text}
            </h3>

            {/* Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => selectAnswer(index)}
                  className={`w-full p-4 rounded-lg text-left transition-all duration-200 ${
                    selectedAnswer === index
                      ? "bg-neutral-50 border-2 border-neutral-900"
                      : "bg-white border-2 border-neutral-200 hover:border-neutral-400"
                  }`}
                >
                  <span className="text-neutral-900">{option}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={previousQuestion}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 bg-neutral-100 text-neutral-900 rounded-lg hover:bg-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>

            {currentQuestionIndex === questions.length - 1 && (
              <button
                onClick={submitTest}
                disabled={!allAnswered || loading}
                className="px-6 py-3 bg-neutral-900 text-white rounded-lg font-semibold hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Submitting..." : "Submit Test"}
              </button>
            )}
          </div>

          {!allAnswered && currentQuestionIndex === questions.length - 1 && (
            <p className="text-center text-amber-600 text-sm mt-4">
              ⚠️ Please answer all questions before submitting
            </p>
          )}
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border-2 border-red-200 rounded-lg text-red-600 text-center">
            {error}
          </div>
        )}
      </div>
    );
  }

  // Completed State
  if (state === "completed" && result) {
    const levelColors: Record<string, string> = {
      A1: "bg-green-500",
      A2: "bg-blue-500",
      B1: "bg-purple-500",
      B2: "bg-indigo-500",
      C1: "bg-orange-500",
      C2: "bg-rose-500",
    };

    return (
      <div className="space-y-8">
        <div className="bg-white border-2 border-neutral-200 rounded-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-neutral-900 mb-2">Test Complete!</h2>
            <p className="text-neutral-600">Here are your results</p>
          </div>

          {/* Level Badge */}
          <div className="text-center mb-8">
            <div className={`inline-block px-12 py-6 rounded-lg ${levelColors[result.level] || "bg-neutral-900"} shadow-lg`}>
              <div className="text-white/80 text-sm mb-1">Your Level</div>
              <div className="text-5xl font-bold text-white">{result.level}</div>
            </div>
          </div>

          {/* Score */}
          <div className="bg-neutral-50 border-2 border-neutral-200 rounded-lg p-6 mb-6 text-center">
            <div className="text-neutral-600 mb-2">Score</div>
            <div className="text-3xl font-bold text-neutral-900">
              {result.score} / {result.total_questions}
            </div>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
              <h4 className="text-green-700 font-semibold mb-2">✓ Strengths</h4>
              <ul className="text-neutral-600 text-sm space-y-1">
                {result.strengths.map((strength, idx) => (
                  <li key={idx}>• {strength}</li>
                ))}
              </ul>
            </div>
            <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4">
              <h4 className="text-orange-700 font-semibold mb-2">⚠️ Areas to Improve</h4>
              <ul className="text-neutral-600 text-sm space-y-1">
                {result.weaknesses.map((weakness, idx) => (
                  <li key={idx}>• {weakness}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recommendation */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-8">
            <h4 className="text-blue-700 font-semibold mb-2">📋 Recommendation</h4>
            <p className="text-neutral-600">{result.recommendation}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={restartTest}
              className="flex-1 px-6 py-3 bg-neutral-100 text-neutral-900 rounded-lg hover:bg-neutral-200 transition-all"
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
              className="flex-1 px-6 py-3 bg-neutral-900 text-white rounded-lg font-semibold hover:bg-neutral-800 transition-all"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
