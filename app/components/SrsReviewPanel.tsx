"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { apiClient } from "@/lib/api-client";
import { SRSCard } from "@/lib/types";
import { CheckCircle, RotateCcw, Sparkles, BookOpen } from "lucide-react";

export default function SrsReviewPanel() {
  const [cards, setCards] = useState<SRSCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now());

  const [userAnswer, setUserAnswer] = useState("");
  const [hasChecked, setHasChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    fetchDueCards();
  }, []);

  const fetchDueCards = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.getDueCards(20);
      setCards(response.cards);
      setCurrentIndex(0);
      setShowBack(false);
      setUserAnswer("");
      setHasChecked(false);
      setIsCorrect(null);
      setStartTime(Date.now());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load cards");
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (quality: number) => {
    if (reviewing || currentIndex >= cards.length) return;

    setReviewing(true);
    setError(null);

    try {
      const currentCard = cards[currentIndex];
      const responseTime = Date.now() - startTime;

      await apiClient.reviewCard({
        card_id: currentCard.card_id,
        quality,
        response_time_ms: responseTime,
        user_response: userAnswer,
        correct: Boolean(isCorrect),
      });

      if (currentIndex < cards.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setShowBack(false);
        setUserAnswer("");
        setHasChecked(false);
        setIsCorrect(null);
        setStartTime(Date.now());
      } else {
        setCurrentIndex(cards.length);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit review");
    } finally {
      setReviewing(false);
    }
  };

  const handleCheckAnswer = () => {
    const currentCard = cards[currentIndex];
    const trimmedAnswer = userAnswer.trim().toLowerCase();
    const trimmedCorrect = currentCard.back.trim().toLowerCase();

    if (trimmedAnswer === "" || trimmedAnswer.length === 0) {
      setIsCorrect(false);
    } else if (trimmedAnswer === trimmedCorrect) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }

    setShowBack(true);
    setHasChecked(true);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-brand rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-btn-glow animate-pulse">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <p className="text-text-secondary">Loading your review cards...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="glass gradient-border rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">!</span>
          </div>
          <h3 className="text-xl font-semibold text-text-primary mb-2">Something went wrong</h3>
          <p className="text-text-secondary mb-6">{error}</p>
          <button
            onClick={fetchDueCards}
            className="px-6 py-3 bg-gradient-brand text-white rounded-xl font-medium shadow-btn-glow hover:shadow-btn-glow-hover transition-all"
          >
            <RotateCcw className="w-4 h-4 inline mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (cards.length === 0 || currentIndex >= cards.length) {
    return (
      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass gradient-border rounded-2xl p-8 text-center"
        >
          <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-success" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-3">
            You're all done!
          </h2>
          <p className="text-text-secondary mb-6">
            {cards.length > 0
              ? `You reviewed ${cards.length} card${cards.length > 1 ? "s" : ""}. Great work!`
              : "No cards are due for review right now."}
          </p>
          <button
            onClick={fetchDueCards}
            className="px-6 py-3 bg-gradient-brand text-white rounded-xl font-medium shadow-btn-glow hover:shadow-btn-glow-hover transition-all"
          >
            Check Again
          </button>
        </motion.div>
      </div>
    );
  }

  const currentCard = cards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;

  return (
    <div className="p-4 space-y-4">
      {/* Progress Bar */}
      <div className="glass rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-text-secondary">
            Card {currentIndex + 1} of {cards.length}
          </span>
          <span className="text-sm text-text-muted">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-dark-300 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-brand rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Card Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass gradient-border rounded-2xl p-6 space-y-6"
      >
        {/* Card Type Badge */}
        <div className="text-center">
          <span className="inline-block px-3 py-1.5 bg-accent-purple/20 text-accent-purple border border-accent-purple/30 text-xs font-semibold rounded-full">
            {currentCard.card_type}
          </span>
        </div>

        {/* Question */}
        <div className="text-center">
          <p className="text-xs font-medium text-text-muted mb-2">Question</p>
          <p className="text-xl font-semibold text-text-primary">
            {currentCard.front}
          </p>
        </div>

        {/* Answer Input */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Your Answer
          </label>
          <textarea
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Type your answer here..."
            disabled={hasChecked}
            className="w-full px-4 py-3 bg-dark-200 border border-white/[0.08] rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-purple/50 focus:border-accent-purple/50 resize-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            rows={3}
          />
        </div>

        {/* Check Answer Button */}
        {!hasChecked && (
          <div className="text-center">
            <button
              onClick={handleCheckAnswer}
              className="px-8 py-3 bg-gradient-brand text-white font-semibold rounded-xl shadow-btn-glow hover:shadow-btn-glow-hover transition-all"
            >
              Check Answer
            </button>
          </div>
        )}

        {/* Feedback after checking */}
        {hasChecked && showBack && (
          <>
            <div className="text-center pt-4 border-t border-white/[0.06]">
              <p className="text-xs font-medium text-text-muted mb-2">Correct Answer</p>
              <p className="text-lg text-text-primary whitespace-pre-wrap">
                {currentCard.back}
              </p>
            </div>

            {/* Feedback message */}
            <div className={`p-4 rounded-xl ${
              isCorrect
                ? "bg-success/10 border border-success/30"
                : "bg-amber-500/10 border border-amber-500/30"
            }`}>
              <p className={`text-sm ${isCorrect ? "text-success" : "text-amber-300"}`}>
                {isCorrect
                  ? "✓ Correct! Great job!"
                  : "Not quite right. Compare your answer with the correct one."}
              </p>
            </div>
          </>
        )}

        {/* Rating Buttons */}
        {hasChecked && (
          <div className="space-y-4">
            <p className="text-center text-sm text-text-muted">
              How well did you know this?
            </p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { quality: 0, label: "Forgot", color: "red" },
                { quality: 1, label: "Hard", color: "orange" },
                { quality: 2, label: "Okay", color: "amber" },
              ].map(({ quality, label, color }) => (
                <button
                  key={quality}
                  onClick={() => handleReview(quality)}
                  disabled={reviewing}
                  className={`px-3 py-3 bg-${color}-500/20 border border-${color}-500/30 text-${color}-300 rounded-xl hover:bg-${color}-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { quality: 3, label: "Good", color: "lime" },
                { quality: 4, label: "Easy", color: "green" },
                { quality: 5, label: "Perfect", color: "blue" },
              ].map(({ quality, label, color }) => (
                <button
                  key={quality}
                  onClick={() => handleReview(quality)}
                  disabled={reviewing}
                  className={`px-3 py-3 bg-${color}-500/20 border border-${color}-500/30 text-${color}-300 rounded-xl hover:bg-${color}-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Help Text */}
      {hasChecked && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-accent-purple/10 border border-accent-purple/20 rounded-xl p-4"
        >
          <p className="text-sm text-accent-purple/80">
            <strong className="text-accent-purple">Tip:</strong> Rate yourself honestly. The system uses your rating to schedule the next review at the optimal time.
          </p>
        </motion.div>
      )}
    </div>
  );
}
