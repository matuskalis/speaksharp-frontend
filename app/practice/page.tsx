"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, AlertCircle } from "lucide-react";
import { useGamification, useExerciseAnswer } from "@/contexts/GamificationContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { ExerciseCard } from "@/components/exercises";
import {
  ConfettiCelebration,
  XPPopup,
  WrongAnswerFlash,
  NoHeartsModal,
  ProgressCelebration,
} from "@/components/gamification";
import { apiClient } from "@/lib/api-client";
import { Exercise, ExerciseFromAPI, ExerciseSubmitResponse } from "@/lib/types";
import { cn } from "@/lib/utils";

const EXERCISES_PER_SESSION = 5;

// Convert API exercise format to local format (without correctAnswer until submitted)
function convertApiExercise(apiEx: ExerciseFromAPI): Exercise {
  return {
    id: apiEx.id,
    type: apiEx.type,
    level: apiEx.level,
    skill: apiEx.skill,
    question: apiEx.question,
    options: apiEx.options,
    hint: apiEx.hint,
    correctAnswer: "", // Will be filled after submission
    explanation: "", // Will be filled after submission
  };
}

// Wrapper component with Suspense for useSearchParams
export default function PracticePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-text-muted animate-pulse">Loading exercises...</div>
      </div>
    }>
      <PracticePageContent />
    </Suspense>
  );
}

function PracticePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { hearts, hasHearts, timeUntilRefill, showShake } = useGamification();
  const { handleAnswer } = useExerciseAnswer();
  const { profile, loading: profileLoading } = useUserProfile();

  // Get skill filters from URL (set by /learn Focus Skills)
  const urlDomain = searchParams.get("domain"); // "grammar" or "vocabulary"
  const urlLevel = searchParams.get("level"); // "A1", "A2", "B1"
  const urlSkillName = searchParams.get("name"); // Human-readable skill name

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

  // Get level: prefer URL param, fall back to user profile, then A1
  const effectiveLevel = urlLevel || profile?.level || "A1";

  useEffect(() => {
    // Wait for profile to load before fetching exercises
    if (profileLoading) return;

    const loadExercises = async () => {
      try {
        setLoading(true);
        setError(null);
        // Pass level and domain (if from Focus Skills) to get targeted exercises
        const response = await apiClient.getExerciseSession(
          EXERCISES_PER_SESSION,
          effectiveLevel,
          urlDomain || undefined  // "grammar" or "vocabulary" from Focus Skills
        );
        setExercises(response.exercises.map(convertApiExercise));
      } catch (err) {
        console.error("Failed to load exercises:", err);
        setError(err instanceof Error ? err.message : "Failed to load exercises");
      } finally {
        setLoading(false);
      }
    };

    loadExercises();
  }, [profileLoading, effectiveLevel, urlDomain]);

  const currentExercise = exercises[currentIndex];
  const progress = exercises.length > 0 ? ((currentIndex) / exercises.length) * 100 : 0;
  const isLastExercise = currentIndex >= exercises.length - 1;

  const handleSubmitAnswer = useCallback(async (answer: string): Promise<ExerciseSubmitResponse> => {
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

    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
      setTotalXP((prev) => prev + result.xpEarned + result.streakBonus);
    } else {
      setHeartsLost((prev) => prev + 1);

      if (hearts.current <= 1) {
        setTimeout(() => {
          setShowNoHearts(true);
        }, 1600);
        return;
      }
    }

    setTimeout(() => {
      if (isLastExercise) {
        setShowCompletion(true);
      } else {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentIndex((prev) => prev + 1);
          setIsTransitioning(false);
        }, 300);
      }
    }, 1600);
  }, [handleAnswer, hearts.current, isLastExercise]);

  const handleClose = () => {
    router.push("/learn");
  };

  const handleCompletionClose = () => {
    setShowCompletion(false);
    router.push("/learn");
  };

  const handleNoHeartsClose = () => {
    setShowNoHearts(false);
    router.push("/learn");
  };

  const handleRefillAndContinue = () => {
    setShowNoHearts(false);
  };

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-text-muted animate-pulse">Loading exercises...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center p-4">
        <div className="glass gradient-border rounded-2xl p-6 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-text-primary mb-2">Failed to Load</h2>
          <p className="text-text-secondary mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-brand text-white rounded-xl font-semibold shadow-btn-glow"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (exercises.length === 0) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center p-4">
        <div className="glass gradient-border rounded-2xl p-6 max-w-md text-center">
          <h2 className="text-xl font-bold text-text-primary mb-2">No Exercises Available</h2>
          <p className="text-text-secondary mb-4">Please try again later.</p>
          <button
            onClick={() => router.push("/learn")}
            className="px-6 py-3 bg-gradient-brand text-white rounded-xl font-semibold shadow-btn-glow"
          >
            Back to Learn
          </button>
        </div>
      </div>
    );
  }

  const elapsedSeconds = Math.floor((Date.now() - startTime.getTime()) / 1000);

  return (
    <>
      <ConfettiCelebration />
      <XPPopup />
      <WrongAnswerFlash />

      <NoHeartsModal
        isOpen={showNoHearts}
        onClose={handleNoHeartsClose}
        onRefill={handleRefillAndContinue}
      />
      <ProgressCelebration
        isOpen={showCompletion}
        onClose={handleCompletionClose}
        stats={{
          correctCount,
          totalQuestions: exercises.length,
          xpEarned: totalXP,
          timeSeconds: elapsedSeconds,
          heartsLost,
          isPerfect: heartsLost === 0 && correctCount === exercises.length,
          skillName: urlSkillName || undefined,
          skillLevel: effectiveLevel,
        }}
      />

      <div className="min-h-screen bg-dark">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-dark-100/90 backdrop-blur-xl border-b border-white/[0.06]">
          <div className="flex items-center gap-4 px-4 h-14">
            <button
              onClick={handleClose}
              className="p-2 -ml-2 text-text-muted hover:text-text-primary transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex-1">
              <div className="h-3 bg-dark-300 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-brand rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-dark-200 rounded-lg">
              <Heart
                className={cn(
                  "w-5 h-5",
                  hearts.current > 0 ? "text-red-500 fill-red-500" : "text-text-muted"
                )}
              />
              <span
                className={cn(
                  "font-bold",
                  hearts.current > 0 ? "text-red-500" : "text-text-muted"
                )}
              >
                {hearts.current}
              </span>
              {timeUntilRefill && hearts.current < hearts.max && (
                <span className="text-xs text-text-muted ml-1">
                  {formatCountdown(timeUntilRefill)}
                </span>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-lg mx-auto px-4 py-6">
          {/* Skill info if coming from Focus Skills */}
          {urlSkillName && (
            <div className="mb-3 flex items-center justify-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded-full bg-accent-purple/20 text-accent-purple font-medium">
                {effectiveLevel}
              </span>
              <span className="text-sm font-medium text-text-primary">
                {urlSkillName}
              </span>
            </div>
          )}
          <div className="mb-4 text-sm text-text-muted text-center">
            Question {currentIndex + 1} of {exercises.length}
          </div>

          <AnimatePresence mode="wait">
            {!isTransitioning && currentExercise && (
              <motion.div
                key={currentExercise.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <ExerciseCard
                  exercise={currentExercise}
                  onAnswer={handleExerciseAnswer}
                  onSubmitAnswer={handleSubmitAnswer}
                  shake={showShake}
                  disabled={!hasHearts}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {!hasHearts && !showNoHearts && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-center"
            >
              <Heart className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <p className="text-red-300 font-medium">You&apos;re out of hearts!</p>
              <p className="text-red-400/70 text-sm mt-1">
                Wait for hearts to refill or refill them now.
              </p>
              <button
                onClick={() => setShowNoHearts(true)}
                className="mt-3 px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors"
              >
                Get More Hearts
              </button>
            </motion.div>
          )}
        </main>

        <div className="fixed bottom-6 left-0 right-0 text-center pointer-events-none">
          <span className="text-xs text-text-muted">
            Press Enter to submit your answer
          </span>
        </div>
      </div>
    </>
  );
}
