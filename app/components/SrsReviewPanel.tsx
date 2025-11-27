"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { SRSCard } from "@/lib/types";

export default function SrsReviewPanel() {
  const [cards, setCards] = useState<SRSCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now());

  // New state for answer checking
  const [userAnswer, setUserAnswer] = useState("");
  const [hasChecked, setHasChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Fetch due cards on mount
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

      // Move to next card
      if (currentIndex < cards.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setShowBack(false);
        setUserAnswer("");
        setHasChecked(false);
        setIsCorrect(null);
        setStartTime(Date.now());
      } else {
        // All cards reviewed
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

    // Check if answer is correct (simple exact match after trimming and lowercasing)
    if (trimmedAnswer === "" || trimmedAnswer.length === 0) {
      // No answer provided
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
      <div className="max-w-[1200px] mx-auto px-8">
        <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-white/[0.05] rounded mb-4"></div>
            <div className="h-32 bg-white/[0.05] rounded"></div>
          </div>
          <p className="mt-8 text-gray-600">Loading your review cards...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[1200px] mx-auto px-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-10">
          <h3 className="text-3xl font-semibold text-gray-900 mb-8">Error</h3>
          <p className="text-lg text-gray-900 mb-8">{error}</p>
          <button
            onClick={fetchDueCards}
            className="px-8 py-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (cards.length === 0 || currentIndex >= cards.length) {
    return (
      <div className="max-w-[1200px] mx-auto px-8">
        <div className="bg-green-50 border border-green-200 rounded-xl p-10 text-center">
          <div className="mb-4">
            <svg
              className="w-16 h-16 text-green-400 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-6xl font-bold text-gray-900 mb-8">
            You're all done for today!
          </h2>
          <p className="text-lg text-gray-900 mb-8">
            {cards.length > 0
              ? `You reviewed ${cards.length} card${cards.length > 1 ? "s" : ""}. Great work!`
              : "No cards are due for review right now."}
          </p>
          <button
            onClick={fetchDueCards}
            className="px-8 py-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Check Again
          </button>
        </div>
      </div>
    );
  }

  const currentCard = cards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;

  return (
    <div className="max-w-[1200px] mx-auto px-8 space-y-8">
      {/* Progress Bar */}
      <div className="bg-white border border-gray-200 hover:border-gray-300 rounded-xl p-10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-white/80">
            Card {currentIndex + 1} of {cards.length}
          </span>
          <span className="text-sm text-white/60">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-white/[0.05] rounded-full h-2">
          <div
            className="bg-gradient-to-r from-indigo-500 to-rose-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Card Display */}
      <div className="bg-white border border-gray-200 hover:border-gray-300 rounded-xl p-10">
        <div className="w-full space-y-8">
          <div className="text-center">
            <span className="inline-block px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold rounded-full">
              {currentCard.card_type}
            </span>
          </div>

          {/* Front of card */}
          <div className="text-center">
            <h3 className="text-sm font-medium text-white/50 mb-2">Question</h3>
            <p className="text-2xl font-semibold text-white">
              {currentCard.front}
            </p>
          </div>

          {/* Answer Input */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Your Answer
            </label>
            <textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Type your answer here..."
              disabled={hasChecked}
              className="w-full px-4 py-3 bg-white/[0.05] border border-white/[0.12] rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
              rows={3}
            />
          </div>

          {/* Check Answer Button */}
          {!hasChecked && (
            <div className="text-center">
              <button
                onClick={handleCheckAnswer}
                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-rose-500 text-white font-medium rounded-lg hover:from-indigo-600 hover:to-rose-600 transition-all duration-300"
              >
                Check Answer
              </button>
            </div>
          )}

          {/* Feedback after checking */}
          {hasChecked && showBack && (
            <>
              <div className="text-center pt-4 border-t border-white/[0.08]">
                <h3 className="text-sm font-medium text-white/50 mb-2">Correct Answer</h3>
                <p className="text-xl text-white/90 whitespace-pre-wrap">
                  {currentCard.back}
                </p>
              </div>

              {/* Feedback message */}
              <div className={`p-4 rounded-xl ${
                isCorrect
                  ? "bg-green-500/10 border border-green-500/20"
                  : "bg-amber-500/10 border border-amber-500/20"
              }`}>
                <p className={`text-sm ${
                  isCorrect ? "text-green-300" : "text-amber-300"
                }`}>
                  {isCorrect
                    ? "✓ Looks correct based on the reference answer."
                    : "Not exactly the same as the reference. Compare your answer with the correct one."}
                </p>
              </div>
            </>
          )}

          {/* Rating Buttons */}
          {hasChecked && (
            <div className="w-full space-y-4">
              <p className="text-center text-sm text-white/70">
                How well did you know this?
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleReview(0)}
                  disabled={reviewing || !hasChecked}
                  className="px-4 py-3 bg-red-500/20 border border-red-500/30 text-red-300 rounded-lg hover:bg-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  <div className="text-xs font-semibold mb-1">0</div>
                  <div className="text-xs">Total Blackout</div>
                </button>
                <button
                  onClick={() => handleReview(1)}
                  disabled={reviewing || !hasChecked}
                  className="px-4 py-3 bg-orange-500/20 border border-orange-500/30 text-orange-300 rounded-lg hover:bg-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  <div className="text-xs font-semibold mb-1">1</div>
                  <div className="text-xs">Incorrect</div>
                </button>
                <button
                  onClick={() => handleReview(2)}
                  disabled={reviewing || !hasChecked}
                  className="px-4 py-3 bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded-lg hover:bg-amber-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  <div className="text-xs font-semibold mb-1">2</div>
                  <div className="text-xs">Hard</div>
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleReview(3)}
                  disabled={reviewing || !hasChecked}
                  className="px-4 py-3 bg-lime-500/20 border border-lime-500/30 text-lime-300 rounded-lg hover:bg-lime-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  <div className="text-xs font-semibold mb-1">3</div>
                  <div className="text-xs">Good</div>
                </button>
                <button
                  onClick={() => handleReview(4)}
                  disabled={reviewing || !hasChecked}
                  className="px-4 py-3 bg-green-500/20 border border-green-500/30 text-green-300 rounded-lg hover:bg-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  <div className="text-xs font-semibold mb-1">4</div>
                  <div className="text-xs">Easy</div>
                </button>
                <button
                  onClick={() => handleReview(5)}
                  disabled={reviewing || !hasChecked}
                  className="px-4 py-3 bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-lg hover:bg-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  <div className="text-xs font-semibold mb-1">5</div>
                  <div className="text-xs">Perfect</div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Help Text */}
      {hasChecked && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-5 backdrop-blur-sm">
          <p className="text-sm text-blue-300">
            <strong className="text-blue-200">Tip:</strong> Rate yourself honestly based on how well you knew the answer.
            The system uses your rating to schedule the next review at the optimal time for long-term retention.
          </p>
        </div>
      )}
    </div>
  );
}
