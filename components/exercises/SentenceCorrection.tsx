"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Lightbulb, Send, AlertCircle, Loader2 } from "lucide-react";
import { Exercise, ExerciseSubmitResponse } from "@/lib/types";
import { cn } from "@/lib/utils";
import { MiniConfetti } from "@/components/gamification";

interface SentenceCorrectionProps {
  exercise: Exercise;
  onAnswer: (isCorrect: boolean) => void;
  onSubmitAnswer?: (answer: string) => Promise<ExerciseSubmitResponse>;
  disabled?: boolean;
}

// Similarity check function - allows for minor variations
function isSimilarEnough(userAnswer: string, correctAnswer: string): boolean {
  const normalize = (s: string) =>
    s
      .toLowerCase()
      .trim()
      .replace(/[.,!?'"]/g, "")
      .replace(/\s+/g, " ");

  const user = normalize(userAnswer);
  const correct = normalize(correctAnswer);

  // Exact match after normalization
  if (user === correct) return true;

  // Check if user answer contains all key words from correct answer
  const correctWords = correct.split(" ");
  const userWords = user.split(" ");

  // Allow for 80% word match
  const matchingWords = correctWords.filter((word) =>
    userWords.some((uw) => uw.includes(word) || word.includes(uw))
  );

  return matchingWords.length >= correctWords.length * 0.8;
}

export function SentenceCorrection({ exercise, onAnswer, onSubmitAnswer, disabled }: SentenceCorrectionProps) {
  const [answer, setAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [apiResult, setApiResult] = useState<ExerciseSubmitResponse | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Use API result if available, otherwise fall back to local checking
  const isCorrect = apiResult ? apiResult.is_correct : isSimilarEnough(answer, exercise.correctAnswer);
  const explanation = apiResult ? apiResult.explanation : exercise.explanation;
  const correctAnswer = apiResult ? apiResult.correct_answer : exercise.correctAnswer;

  useEffect(() => {
    if (!disabled && textareaRef.current) {
      textareaRef.current.focus();
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
        setTimeout(() => {
          onAnswer(result.is_correct);
        }, 1500);
      } catch (error) {
        console.error("Failed to submit answer:", error);
        // Fall back to local checking
        setShowResult(true);
        setTimeout(() => {
          onAnswer(isSimilarEnough(answer, exercise.correctAnswer));
        }, 1500);
      } finally {
        setSubmitting(false);
      }
    } else {
      // Local checking (fallback)
      setShowResult(true);
      setTimeout(() => {
        onAnswer(isSimilarEnough(answer, exercise.correctAnswer));
      }, 1500);
    }
  };

  // Extract the sentence to correct from the question
  const sentenceMatch = exercise.question.match(/'([^']+)'/);
  const sentenceToCorrect = sentenceMatch ? sentenceMatch[1] : "";

  return (
    <div className="w-full">
      {/* Question type label */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4"
      >
        <span className="text-xs font-medium text-orange-400 uppercase tracking-wide">
          Sentence Correction
        </span>
      </motion.div>

      {/* Instructions */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="text-lg text-text-secondary mb-4"
      >
        Correct the error in this sentence:
      </motion.p>

      {/* Original sentence with error */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl"
      >
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-lg font-medium text-red-300 italic">
            &ldquo;{sentenceToCorrect}&rdquo;
          </p>
        </div>
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

      {/* Answer input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="relative mb-4"
      >
        <textarea
          ref={textareaRef}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          disabled={showResult || disabled}
          placeholder="Type the corrected sentence here..."
          rows={3}
          className={cn(
            "w-full p-4 rounded-xl border-2 resize-none transition-colors bg-dark-200 placeholder-text-muted",
            "focus:outline-none focus:ring-0",
            !showResult && "border-white/[0.08] focus:border-accent-purple text-text-primary",
            showResult && isCorrect && "border-green-500 bg-green-500/10 text-green-300",
            showResult && !isCorrect && "border-red-500 bg-red-500/10 text-red-300"
          )}
        />
        {showResult && isCorrect && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <MiniConfetti show={true} />
          </div>
        )}
      </motion.div>

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
              "mt-4 p-4 rounded-xl",
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
                  <p className="text-sm text-text-secondary mb-2">
                    Correct answer: <strong className="text-green-300">&ldquo;{correctAnswer}&rdquo;</strong>
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
