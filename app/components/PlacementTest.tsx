"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { PlacementQuestion, PlacementTestResult } from "@/lib/types";

type TestState = "not_started" | "in_progress" | "completed";

export default function PlacementTest() {
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
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] p-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300 mb-4">
              📊 Placement Test
            </h2>
            <p className="text-white/70 mb-6 text-lg">
              Find your English level (A1-C2) in 10 minutes
            </p>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 mb-8 text-left">
              <h3 className="font-semibold text-blue-300 mb-3">What to expect:</h3>
              <ul className="space-y-2 text-white/70">
                <li className="flex items-start">
                  <span className="text-blue-300 mr-2">✓</span>
                  <span>12 questions covering grammar and vocabulary</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-300 mr-2">✓</span>
                  <span>Questions range from beginner (A1) to advanced (C2)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-300 mr-2">✓</span>
                  <span>Takes about 5-10 minutes to complete</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-300 mr-2">✓</span>
                  <span>Instant results with personalized recommendations</span>
                </li>
              </ul>
            </div>

            <button
              onClick={startTest}
              disabled={loading}
              className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-rose-500 text-white rounded-lg font-semibold hover:from-indigo-600 hover:to-rose-600 transition-all duration-300 disabled:opacity-50 text-lg"
            >
              {loading ? "Loading..." : "Start Placement Test"}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-center">
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
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] p-8">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-white/60 mb-2">
              <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <div className="w-full bg-white/[0.08] rounded-full h-2">
              <div
                className="bg-gradient-to-r from-indigo-500 to-rose-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-white/50">
                {currentQuestion.skill_type === "grammar" ? "📝 Grammar" : "📚 Vocabulary"}
              </span>
              <span className="text-xs bg-white/[0.08] text-white/60 px-2 py-1 rounded">
                Level: {currentQuestion.level}
              </span>
            </div>
            <h3 className="text-xl text-white mb-6">
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
                      ? "bg-gradient-to-r from-indigo-500/20 to-rose-500/20 border-2 border-indigo-500"
                      : "bg-white/[0.03] border-2 border-white/[0.08] hover:bg-white/[0.05]"
                  }`}
                >
                  <span className="text-white">{option}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={previousQuestion}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 bg-white/[0.05] text-white rounded-lg hover:bg-white/[0.08] disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>

            {currentQuestionIndex === questions.length - 1 ? (
              <button
                onClick={submitTest}
                disabled={!allAnswered || loading}
                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-rose-500 text-white rounded-lg font-semibold hover:from-indigo-600 hover:to-rose-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Submitting..." : "Submit Test"}
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                disabled={selectedAnswer === -1}
                className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-rose-500 text-white rounded-lg font-semibold hover:from-indigo-600 hover:to-rose-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            )}
          </div>

          {!allAnswered && currentQuestionIndex === questions.length - 1 && (
            <p className="text-center text-yellow-400 text-sm mt-4">
              ⚠️ Please answer all questions before submitting
            </p>
          )}
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-center">
            {error}
          </div>
        )}
      </div>
    );
  }

  // Completed State
  if (state === "completed" && result) {
    const levelColors: Record<string, string> = {
      A1: "from-green-400 to-emerald-500",
      A2: "from-blue-400 to-cyan-500",
      B1: "from-purple-400 to-violet-500",
      B2: "from-indigo-400 to-blue-500",
      C1: "from-orange-400 to-red-500",
      C2: "from-rose-400 to-pink-500",
    };

    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Test Complete!</h2>
            <p className="text-white/60">Here are your results</p>
          </div>

          {/* Level Badge */}
          <div className="text-center mb-8">
            <div className={`inline-block px-12 py-6 rounded-2xl bg-gradient-to-r ${levelColors[result.level] || "from-indigo-500 to-rose-500"} shadow-lg`}>
              <div className="text-white/70 text-sm mb-1">Your Level</div>
              <div className="text-5xl font-bold text-white">{result.level}</div>
            </div>
          </div>

          {/* Score */}
          <div className="bg-white/[0.05] rounded-xl p-6 mb-6 text-center">
            <div className="text-white/70 mb-2">Score</div>
            <div className="text-3xl font-bold text-white">
              {result.score} / {result.total_questions}
            </div>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
              <h4 className="text-green-300 font-semibold mb-2">✓ Strengths</h4>
              <ul className="text-white/70 text-sm space-y-1">
                {result.strengths.map((strength, idx) => (
                  <li key={idx}>• {strength}</li>
                ))}
              </ul>
            </div>
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">
              <h4 className="text-orange-300 font-semibold mb-2">⚠️ Areas to Improve</h4>
              <ul className="text-white/70 text-sm space-y-1">
                {result.weaknesses.map((weakness, idx) => (
                  <li key={idx}>• {weakness}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recommendation */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 mb-8">
            <h4 className="text-blue-300 font-semibold mb-2">📋 Recommendation</h4>
            <p className="text-white/70">{result.recommendation}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={restartTest}
              className="flex-1 px-6 py-3 bg-white/[0.05] text-white rounded-lg hover:bg-white/[0.08] transition-all"
            >
              Retake Test
            </button>
            <button
              onClick={() => window.location.href = "/"}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-500 to-rose-500 text-white rounded-lg font-semibold hover:from-indigo-600 hover:to-rose-600 transition-all"
            >
              Start Learning
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
