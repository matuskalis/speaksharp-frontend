"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, AlertCircle, Zap, Trophy, ArrowRight } from "lucide-react";
import { useGamification, useExerciseAnswer } from "@/contexts/GamificationContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { ExerciseCard } from "@/components/exercises";
import {
  ConfettiCelebration,
  XPPopup,
  WrongAnswerFlash,
  NoHeartsModal,
} from "@/components/gamification";
import { apiClient } from "@/lib/api-client";
import { Exercise, ExerciseFromAPI, LearningLesson } from "@/lib/types";
import { cn } from "@/lib/utils";
import Link from "next/link";

function convertApiExercise(apiEx: ExerciseFromAPI): Exercise {
  return {
    id: apiEx.id,
    type: apiEx.type,
    level: apiEx.level,
    skill: apiEx.skill,
    question: apiEx.question,
    options: apiEx.options,
    hint: apiEx.hint,
    correctAnswer: "",
    explanation: "",
  };
}

export default function LessonPage() {
  const router = useRouter();
  const params = useParams();
  const lessonId = params.lessonId as string;

  const { hearts, hasHearts, timeUntilRefill, showShake, checkAchievements } = useGamification();
  const { handleAnswer } = useExerciseAnswer();
  const { profile, loading: profileLoading } = useUserProfile();

  const [lesson, setLesson] = useState<LearningLesson | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [heartsLost, setHeartsLost] = useState(0);
  const [startTime] = useState(new Date());
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showNoHearts, setShowNoHearts] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [completionData, setCompletionData] = useState<{
    xpEarned: number;
    isFirstCompletion: boolean;
    score: number;
  } | null>(null);

  useEffect(() => {
    if (profileLoading || !lessonId) return;

    const loadLesson = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.getLearningPathLesson(lessonId);
        setLesson(response.lesson);
        setExercises(response.exercises.map(convertApiExercise));
      } catch (err) {
        console.error("Failed to load lesson:", err);
        setError(err instanceof Error ? err.message : "Failed to load lesson");
      } finally {
        setLoading(false);
      }
    };

    loadLesson();
  }, [profileLoading, lessonId]);

  const currentExercise = exercises[currentIndex];
  const progress = exercises.length > 0 ? ((currentIndex) / exercises.length) * 100 : 0;
  const isLastExercise = currentIndex >= exercises.length - 1;

  const completeLesson = useCallback(async (finalCorrect: number, finalHeartsLost: number) => {
    const endTime = new Date();
    const timeSpent = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
    const score = exercises.length > 0
      ? Math.round((finalCorrect / exercises.length) * 100)
      : 0;

    try {
      const result = await apiClient.completeLearningPathLesson(lessonId, {
        score,
        mistakes_count: finalHeartsLost,
        time_spent_seconds: timeSpent,
      });

      setCompletionData({
        xpEarned: result.xp_earned,
        isFirstCompletion: result.is_first_completion,
        score,
      });
      setShowCompletion(true);
      checkAchievements();
    } catch (err) {
      console.error("Failed to complete lesson:", err);
      setCompletionData({
        xpEarned: totalXP,
        isFirstCompletion: false,
        score,
      });
      setShowCompletion(true);
      checkAchievements();
    }
  }, [lessonId, startTime, exercises.length, totalXP, checkAchievements]);

  const handleSubmitAnswer = useCallback(async (answer: string) => {
    if (!currentExercise) {
      throw new Error("No current exercise");
    }
    return await apiClient.submitExercise({
      exercise_id: currentExercise.id,
      user_answer: answer,
    });
  }, [currentExercise]);

  const handleExerciseAnswer = useCallback((isCorrect: boolean) => {
    const result = handleAnswer(isCorrect);

    let newCorrect = correctCount;
    let newHeartsLost = heartsLost;

    if (isCorrect) {
      newCorrect = correctCount + 1;
      setCorrectCount(newCorrect);
      setTotalXP((prev) => prev + result.xpEarned + result.streakBonus);
    } else {
      newHeartsLost = heartsLost + 1;
      setHeartsLost(newHeartsLost);

      if (hearts.current <= 1) {
        setTimeout(() => {
          setShowNoHearts(true);
        }, 1600);
        return;
      }
    }

    setTimeout(() => {
      if (isLastExercise) {
        completeLesson(newCorrect, newHeartsLost);
      } else {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentIndex((prev) => prev + 1);
          setIsTransitioning(false);
        }, 300);
      }
    }, 1600);
  }, [handleAnswer, hearts.current, isLastExercise, correctCount, heartsLost, completeLesson]);

  const handleClose = () => {
    if (lesson?.unit_id) {
      router.push(`/path/${lesson.unit_id}`);
    } else {
      router.push("/path");
    }
  };

  const handleNoHeartsClose = () => {
    setShowNoHearts(false);
    handleClose();
  };

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-accent-purple border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark flex flex-col items-center justify-center p-4">
        <AlertCircle className="w-12 h-12 text-error mb-4" />
        <p className="text-text-secondary text-center mb-4">{error}</p>
        <button
          onClick={handleClose}
          className="px-6 py-2 bg-dark-200 rounded-xl text-text-primary"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!hasHearts && !showNoHearts) {
    return (
      <div className="min-h-screen bg-dark flex flex-col items-center justify-center p-4">
        <Heart className="w-16 h-16 text-error mb-4" />
        <h2 className="text-xl font-bold text-text-primary mb-2">No Hearts Left</h2>
        <p className="text-text-secondary text-center mb-4">
          Wait {formatCountdown(timeUntilRefill || 0)} for hearts to refill
        </p>
        <button
          onClick={handleClose}
          className="px-6 py-2 bg-dark-200 rounded-xl text-text-primary"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark">
      <WrongAnswerFlash />

      {/* Header */}
      <div className="sticky top-0 z-40 bg-dark/90 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="px-4 py-3">
          <div className="flex items-center gap-4">
            <button
              onClick={handleClose}
              className="p-2 hover:bg-dark-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-text-muted" />
            </button>

            {/* Progress Bar */}
            <div className="flex-1 h-3 bg-dark-300 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-brand rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Hearts */}
            <div
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all",
                hearts.current <= 1
                  ? "bg-error/20 text-error"
                  : "bg-dark-200 text-text-primary",
                showShake && "animate-shake"
              )}
            >
              <Heart
                className={cn("w-5 h-5", hearts.current > 0 && "fill-current")}
              />
              <span className="font-bold text-sm">{hearts.current}</span>
            </div>
          </div>

          {/* Lesson Title */}
          {lesson && (
            <div className="mt-2">
              <span className="text-xs text-text-muted">
                Lesson {lesson.lesson_number}
              </span>
              <h1 className="text-sm font-semibold text-text-primary truncate">
                {lesson.title}
              </h1>
            </div>
          )}
        </div>
      </div>

      {/* Exercise Content */}
      <div className="px-4 py-6">
        <AnimatePresence mode="wait">
          {currentExercise && !isTransitioning && (
            <motion.div
              key={currentExercise.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ExerciseCard
                exercise={currentExercise}
                onAnswer={handleExerciseAnswer}
                onSubmitAnswer={handleSubmitAnswer}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Completion Modal */}
      <AnimatePresence>
        {showCompletion && completionData && (
          <>
            <ConfettiCelebration />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="glass rounded-3xl p-6 w-full max-w-sm text-center"
              >
                <div className="w-20 h-20 bg-gradient-brand rounded-full flex items-center justify-center mx-auto mb-4 shadow-btn-glow">
                  <Trophy className="w-10 h-10 text-white" />
                </div>

                <h2 className="text-2xl font-bold text-text-primary mb-2">
                  {completionData.isFirstCompletion ? "Lesson Complete!" : "Practice Complete!"}
                </h2>

                <p className="text-text-secondary mb-6">
                  {completionData.score >= 90
                    ? "Perfect! You mastered this lesson!"
                    : completionData.score >= 70
                    ? "Great job! Keep practicing!"
                    : "Good effort! Try again to improve!"}
                </p>

                {/* Stats */}
                <div className="flex justify-center gap-6 mb-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-yellow-400 mb-1">
                      <Zap className="w-5 h-5" />
                      <span className="text-2xl font-bold">{completionData.xpEarned}</span>
                    </div>
                    <span className="text-xs text-text-muted">XP Earned</span>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-text-primary mb-1">
                      {completionData.score}%
                    </div>
                    <span className="text-xs text-text-muted">Score</span>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-text-primary mb-1">
                      {correctCount}/{exercises.length}
                    </div>
                    <span className="text-xs text-text-muted">Correct</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <Link
                    href={lesson?.unit_id ? `/path/${lesson.unit_id}` : "/path"}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-brand text-white font-semibold rounded-xl shadow-btn-glow"
                  >
                    Continue
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <button
                    onClick={() => {
                      setShowCompletion(false);
                      setCurrentIndex(0);
                      setCorrectCount(0);
                      setTotalXP(0);
                      setHeartsLost(0);
                    }}
                    className="w-full px-6 py-3 bg-dark-200 text-text-secondary font-medium rounded-xl hover:bg-dark-300 transition-colors"
                  >
                    Practice Again
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* No Hearts Modal */}
      <NoHeartsModal
        isOpen={showNoHearts}
        onClose={handleNoHeartsClose}
        onRefill={() => setShowNoHearts(false)}
      />
    </div>
  );
}
