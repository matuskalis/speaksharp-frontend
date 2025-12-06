"use client";

import { motion } from "framer-motion";
import { Exercise, ExerciseSubmitResponse } from "@/lib/types";
import { MultipleChoice } from "./MultipleChoice";
import { FillInBlank } from "./FillInBlank";
import { SentenceCorrection } from "./SentenceCorrection";
import { ShakeOnWrong } from "@/components/gamification";

interface ExerciseCardProps {
  exercise: Exercise;
  onAnswer: (isCorrect: boolean) => void;
  onSubmitAnswer?: (answer: string) => Promise<ExerciseSubmitResponse>;
  shake?: boolean;
  disabled?: boolean;
}

export function ExerciseCard({ exercise, onAnswer, onSubmitAnswer, shake = false, disabled }: ExerciseCardProps) {
  const renderExercise = () => {
    switch (exercise.type) {
      case "multiple_choice":
        return <MultipleChoice exercise={exercise} onAnswer={onAnswer} onSubmitAnswer={onSubmitAnswer} disabled={disabled} />;
      case "fill_blank":
        return <FillInBlank exercise={exercise} onAnswer={onAnswer} onSubmitAnswer={onSubmitAnswer} disabled={disabled} />;
      case "sentence_correction":
        return <SentenceCorrection exercise={exercise} onAnswer={onAnswer} onSubmitAnswer={onSubmitAnswer} disabled={disabled} />;
      default:
        return <div>Unknown exercise type</div>;
    }
  };

  return (
    <ShakeOnWrong shake={shake}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.3 }}
        className="glass gradient-border rounded-2xl p-6"
      >
        {renderExercise()}
      </motion.div>
    </ShakeOnWrong>
  );
}
