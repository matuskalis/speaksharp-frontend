"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Lightbulb, Send, Loader2 } from "lucide-react";
import { Exercise, ExerciseSubmitResponse } from "@/lib/types";
import { cn } from "@/lib/utils";
import { MiniConfetti } from "@/components/gamification";

interface FillInBlankProps {
  exercise: Exercise;
  onAnswer: (isCorrect: boolean) => void;
  onSubmitAnswer?: (answer: string) => Promise<ExerciseSubmitResponse>;
  disabled?: boolean;
}

export function FillInBlank({ exercise, onAnswer, onSubmitAnswer, disabled }: FillInBlankProps) {
  const [answer, setAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [apiResult, setApiResult] = useState<ExerciseSubmitResponse | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Normalize answers for comparison (case-insensitive, trim whitespace)
  const normalizeAnswer = (str: string) => str.toLowerCase().trim();

  // Use API result if available, otherwise fall back to local checking
  const isCorrect = apiResult ? apiResult.is_correct : normalizeAnswer(answer) === normalizeAnswer(exercise.correctAnswer);
  const explanation = apiResult ? apiResult.explanation : exercise.explanation;
  const correctAnswer = apiResult ? apiResult.correct_answer : exercise.correctAnswer;

  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled]);

  const handleSubmit = async () => {
    if (!answer.trim() || showResult || disabled || submitting) return;

    // If we have an API submit handler, use it
    if (onSubmitAnswer) {
      setSubmitting(true);
      try {
        const result = await onSubmitAnswer(answer);
        setApiResult(result);
        setShowResult(true);
        // Delay callback to show animation
        setTimeout(() => {
          onAnswer(result.is_correct);
        }, 1500);
      } catch (error) {
        console.error("Failed to submit answer:", error);
        // Fall back to local checking
        setShowResult(true);
        setTimeout(() => {
          onAnswer(normalizeAnswer(answer) === normalizeAnswer(exercise.correctAnswer));
        }, 1500);
      } finally {
        setSubmitting(false);
      }
    } else {
      // Local checking (fallback)
      setShowResult(true);
      setTimeout(() => {
        onAnswer(normalizeAnswer(answer) === normalizeAnswer(exercise.correctAnswer));
      }, 1500);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  // Split question into parts around the blank
  const parts = exercise.question.split("_____");

  return (
    <div className="w-full">
      {/* Question type label */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <span className="text-xs font-medium text-blue-400 uppercase tracking-wide">
          Fill in the Blank
        </span>
      </motion.div>

      {/* Question with inline input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-xl font-medium text-text-primary leading-relaxed mb-6"
      >
        {parts[0]}
        <span className="relative inline-block mx-1">
          <input
            ref={inputRef}
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={showResult || disabled}
            placeholder="type here"
            className={cn(
              "w-40 px-3 py-1 border-b-2 bg-transparent text-center font-semibold focus:outline-none transition-colors placeholder-text-muted",
              !showResult && "border-accent-purple focus:border-accent-pink text-text-primary",
              showResult && isCorrect && "border-green-500 text-green-300",
              showResult && !isCorrect && "border-red-500 text-red-300"
            )}
          />
          {showResult && isCorrect && <MiniConfetti show={true} />}
        </span>
        {parts[1]}
      </motion.div>

      {/* Hint button */}
      {exercise.hint && !showResult && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          onClick={() => setShowHint(!showHint)}
          className="flex items-center gap-2 text-sm text-amber-400 mb-4 hover:text-amber-300"
        >
          <Lightbulb className="w-4 h-4" />
          {showHint ? "Hide hint" : "Show hint"}
        </motion.button>
      )}

      {/* Hint text */}
      <AnimatePresence>
        {showHint && !showResult && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-sm text-amber-300"
          >
            {exercise.hint}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit button */}
      {!showResult && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={handleSubmit}
          disabled={!answer.trim() || disabled}
          className={cn(
            "w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-semibold transition-all",
            answer.trim()
              ? "bg-gradient-brand text-white shadow-btn-glow hover:shadow-btn-glow-hover active:scale-[0.98]"
              : "bg-dark-300 text-text-muted cursor-not-allowed"
          )}
        >
          <Send className="w-5 h-5" />
          Check Answer
        </motion.button>
      )}

      {/* Result */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={cn(
              "mt-6 p-4 rounded-xl",
              isCorrect ? "bg-green-500/10 border border-green-500/30" : "bg-red-500/10 border border-red-500/30"
            )}
          >
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                  isCorrect ? "bg-green-500" : "bg-red-500"
                )}
              >
                {isCorrect ? (
                  <Check className="w-5 h-5 text-white" />
                ) : (
                  <X className="w-5 h-5 text-white" />
                )}
              </div>
              <div>
                <p
                  className={cn(
                    "font-semibold mb-1",
                    isCorrect ? "text-green-300" : "text-red-300"
                  )}
                >
                  {isCorrect ? "Correct!" : "Not quite right"}
                </p>
                {!isCorrect && (
                  <p className="text-sm text-red-200/80 mb-2">
                    The correct answer is: <strong>{correctAnswer}</strong>
                  </p>
                )}
                <p className={cn("text-sm", isCorrect ? "text-green-200/80" : "text-red-200/80")}>
                  {explanation}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
