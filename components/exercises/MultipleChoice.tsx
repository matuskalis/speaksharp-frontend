"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Lightbulb, Loader2 } from "lucide-react";
import { Exercise, ExerciseSubmitResponse } from "@/lib/types";
import { cn } from "@/lib/utils";
import { MiniConfetti } from "@/components/gamification";

interface MultipleChoiceProps {
  exercise: Exercise;
  onAnswer: (isCorrect: boolean) => void;
  onSubmitAnswer?: (answer: string) => Promise<ExerciseSubmitResponse>;
  disabled?: boolean;
}

export function MultipleChoice({ exercise, onAnswer, onSubmitAnswer, disabled }: MultipleChoiceProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [apiResult, setApiResult] = useState<ExerciseSubmitResponse | null>(null);

  // Use API result if available, otherwise fall back to local checking
  const isCorrect = apiResult ? apiResult.is_correct : selected === exercise.correctAnswer;
  const explanation = apiResult ? apiResult.explanation : exercise.explanation;
  const correctAnswer = apiResult ? apiResult.correct_answer : exercise.correctAnswer;

  const handleSelect = async (option: string) => {
    if (showResult || disabled || submitting) return;

    setSelected(option);

    // If we have an API submit handler, use it
    if (onSubmitAnswer) {
      setSubmitting(true);
      try {
        const result = await onSubmitAnswer(option);
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
          onAnswer(option === exercise.correctAnswer);
        }, 1500);
      } finally {
        setSubmitting(false);
      }
    } else {
      // Local checking (fallback)
      setShowResult(true);
      setTimeout(() => {
        onAnswer(option === exercise.correctAnswer);
      }, 1500);
    }
  };

  return (
    <div className="w-full">
      {/* Question */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <span className="text-xs font-medium text-accent-purple uppercase tracking-wide">
          Multiple Choice
        </span>
        <h2 className="text-xl font-semibold text-text-primary mt-2 leading-relaxed">
          {exercise.question}
        </h2>
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

      {/* Options */}
      <div className="space-y-3">
        {exercise.options?.map((option, index) => {
          const isSelected = selected === option;
          const isCorrectOption = option === correctAnswer;
          const showCorrectState = showResult && isCorrectOption;
          const showWrongState = showResult && isSelected && !isCorrectOption;

          return (
            <motion.button
              key={option}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleSelect(option)}
              disabled={showResult || disabled}
              className={cn(
                "w-full p-4 rounded-xl border-2 text-left transition-all relative overflow-hidden",
                "active:scale-[0.98]",
                !showResult && !disabled && "hover:border-accent-purple/50 hover:bg-accent-purple/10",
                !showResult && !isSelected && "border-white/[0.08] bg-dark-200",
                !showResult && isSelected && "border-accent-purple bg-accent-purple/20",
                showCorrectState && "border-green-500 bg-green-500/20",
                showWrongState && "border-red-500 bg-red-500/20",
                (showResult || disabled) && "cursor-default"
              )}
            >
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "font-medium",
                    showCorrectState && "text-green-300",
                    showWrongState && "text-red-300",
                    !showResult && "text-text-primary"
                  )}
                >
                  {option}
                </span>

                {showCorrectState && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                  >
                    <Check className="w-4 h-4 text-white" />
                  </motion.div>
                )}

                {showWrongState && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
                  >
                    <X className="w-4 h-4 text-white" />
                  </motion.div>
                )}
              </div>

              {/* Confetti for correct answer */}
              {showCorrectState && isSelected && <MiniConfetti show={true} />}
            </motion.button>
          );
        })}
      </div>

      {/* Explanation */}
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
