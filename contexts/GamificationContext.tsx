"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { HeartsState, XPState } from "@/lib/types";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "./AuthContext";

const MAX_HEARTS = 5;
const HEART_REFILL_MINUTES = 30;
const XP_PER_CORRECT = 10;
const XP_STREAK_BONUS = 5;
const XP_PER_LEVEL = 100;

interface GamificationContextType {
  // Hearts
  hearts: HeartsState;
  loseHeart: () => void;
  refillHearts: () => void;
  hasHearts: boolean;
  timeUntilRefill: number | null; // seconds

  // XP
  xp: XPState;
  addXP: (amount: number, isStreakBonus?: boolean) => void;
  syncXPFromBackend: (backendTotal: number) => void;

  // Daily streak (synced with backend)
  streak: number;
  longestStreak: number;
  syncStreak: () => Promise<void>;

  // Streak tracking within session
  correctStreak: number;
  incrementStreak: () => void;
  resetStreak: () => void;

  // Animation triggers
  showConfetti: boolean;
  triggerConfetti: () => void;
  showXPPopup: { amount: number; bonus: number } | null;
  triggerXPPopup: (amount: number, bonus?: number) => void;
  showShake: boolean;
  triggerShake: () => void;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

const STORAGE_KEY_HEARTS = "vorex_hearts";
const STORAGE_KEY_XP = "vorex_xp";
const STORAGE_KEY_STREAK = "vorex_streak";

function loadFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveToStorage(key: string, value: any) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable
  }
}

export function GamificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  // Hearts state
  const [hearts, setHearts] = useState<HeartsState>({
    current: MAX_HEARTS,
    max: MAX_HEARTS,
    lastLostTime: null,
    refillsAt: null,
  });

  // XP state
  const [xp, setXP] = useState<XPState>({
    total: 0,
    today: 0,
    level: 1,
    toNextLevel: XP_PER_LEVEL,
  });

  // Daily streak state (synced with backend)
  const [streak, setStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [lastPracticeDate, setLastPracticeDate] = useState<string | null>(null);
  const hasSyncedRef = useRef(false);

  // Session streak
  const [correctStreak, setCorrectStreak] = useState(0);

  // Animation states
  const [showConfetti, setShowConfetti] = useState(false);
  const [showXPPopup, setShowXPPopup] = useState<{ amount: number; bonus: number } | null>(null);
  const [showShake, setShowShake] = useState(false);

  // Time until refill (recalculated)
  const [timeUntilRefill, setTimeUntilRefill] = useState<number | null>(null);

  // Load from storage on mount
  useEffect(() => {
    const storedHearts = loadFromStorage<HeartsState>(STORAGE_KEY_HEARTS, {
      current: MAX_HEARTS,
      max: MAX_HEARTS,
      lastLostTime: null,
      refillsAt: null,
    });
    const storedXP = loadFromStorage<XPState>(STORAGE_KEY_XP, {
      total: 0,
      today: 0,
      level: 1,
      toNextLevel: XP_PER_LEVEL,
    });

    // Check if hearts should have refilled
    if (storedHearts.refillsAt && storedHearts.current < MAX_HEARTS) {
      const refillTime = new Date(storedHearts.refillsAt).getTime();
      const now = Date.now();
      const elapsed = now - refillTime;
      const heartsToRefill = Math.floor(elapsed / (HEART_REFILL_MINUTES * 60 * 1000));

      if (heartsToRefill > 0) {
        const newHearts = Math.min(storedHearts.current + heartsToRefill, MAX_HEARTS);
        storedHearts.current = newHearts;
        if (newHearts >= MAX_HEARTS) {
          storedHearts.refillsAt = null;
        } else {
          // Set next refill time
          const nextRefill = new Date(refillTime + (heartsToRefill + 1) * HEART_REFILL_MINUTES * 60 * 1000);
          storedHearts.refillsAt = nextRefill.toISOString();
        }
      }
    }

    setHearts(storedHearts);
    setXP(storedXP);

    // Load streak
    const storedStreak = loadFromStorage<{ count: number; lastDate: string | null }>(
      STORAGE_KEY_STREAK,
      { count: 0, lastDate: null }
    );

    // Check if streak is still valid (practiced yesterday or today)
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    if (storedStreak.lastDate === today || storedStreak.lastDate === yesterday) {
      setStreak(storedStreak.count);
      setLastPracticeDate(storedStreak.lastDate);
    } else {
      // Streak broken - reset
      setStreak(0);
      setLastPracticeDate(null);
    }
  }, []);

  // Save hearts to storage when changed
  useEffect(() => {
    saveToStorage(STORAGE_KEY_HEARTS, hearts);
  }, [hearts]);

  // Save XP to storage when changed
  useEffect(() => {
    saveToStorage(STORAGE_KEY_XP, xp);
  }, [xp]);

  // Sync streak with backend when user is authenticated
  const syncStreak = useCallback(async () => {
    if (!user) return;

    try {
      const backendStreak = await apiClient.getStreak();
      setStreak(backendStreak.current_streak);
      setLongestStreak(backendStreak.longest_streak);

      if (backendStreak.last_active_date) {
        setLastPracticeDate(new Date(backendStreak.last_active_date).toDateString());
      }

      // Update localStorage with backend data
      saveToStorage(STORAGE_KEY_STREAK, {
        count: backendStreak.current_streak,
        lastDate: backendStreak.last_active_date
          ? new Date(backendStreak.last_active_date).toDateString()
          : null,
      });
    } catch (error) {
      console.error("Failed to sync streak with backend:", error);
      // Keep using localStorage values as fallback
    }
  }, [user]);

  // Fetch streak from backend when user logs in
  useEffect(() => {
    if (user && !hasSyncedRef.current) {
      hasSyncedRef.current = true;
      syncStreak();
    }

    if (!user) {
      hasSyncedRef.current = false;
    }
  }, [user, syncStreak]);

  // Update time until refill
  useEffect(() => {
    if (!hearts.refillsAt || hearts.current >= MAX_HEARTS) {
      setTimeUntilRefill(null);
      return;
    }

    const updateTimer = () => {
      const refillTime = new Date(hearts.refillsAt!).getTime();
      const now = Date.now();
      const remaining = Math.max(0, Math.ceil((refillTime - now) / 1000));

      if (remaining <= 0) {
        // Refill one heart
        setHearts(prev => {
          const newCurrent = Math.min(prev.current + 1, MAX_HEARTS);
          return {
            ...prev,
            current: newCurrent,
            refillsAt: newCurrent < MAX_HEARTS
              ? new Date(Date.now() + HEART_REFILL_MINUTES * 60 * 1000).toISOString()
              : null,
          };
        });
      } else {
        setTimeUntilRefill(remaining);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [hearts.refillsAt, hearts.current]);

  // Lose a heart
  const loseHeart = useCallback(() => {
    setHearts(prev => {
      if (prev.current <= 0) return prev;

      const newCurrent = prev.current - 1;
      const now = new Date().toISOString();

      return {
        ...prev,
        current: newCurrent,
        lastLostTime: now,
        refillsAt: prev.refillsAt || new Date(Date.now() + HEART_REFILL_MINUTES * 60 * 1000).toISOString(),
      };
    });
  }, []);

  // Refill all hearts (for premium or watching ad)
  const refillHearts = useCallback(() => {
    setHearts(prev => ({
      ...prev,
      current: MAX_HEARTS,
      refillsAt: null,
    }));
  }, []);

  // Add XP and update daily streak
  const addXP = useCallback((amount: number, isStreakBonus = false) => {
    setXP(prev => {
      const newTotal = prev.total + amount;
      const newToday = prev.today + amount;

      // Check for level up
      let newLevel = prev.level;
      let newToNextLevel = prev.toNextLevel - amount;

      while (newToNextLevel <= 0) {
        newLevel++;
        newToNextLevel += XP_PER_LEVEL;
      }

      return {
        total: newTotal,
        today: newToday,
        level: newLevel,
        toNextLevel: newToNextLevel,
      };
    });

    // Update daily streak locally (immediate feedback)
    const today = new Date().toDateString();
    if (lastPracticeDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      const newStreak = lastPracticeDate === yesterday ? streak + 1 : 1;

      setStreak(newStreak);
      setLastPracticeDate(today);
      saveToStorage(STORAGE_KEY_STREAK, { count: newStreak, lastDate: today });
    }

    // Sync with backend (non-blocking)
    if (user) {
      apiClient.recordActivity().then((result) => {
        // Update with backend's authoritative data
        setStreak(result.current_streak);
        setLongestStreak(result.longest_streak);
        if (result.last_active_date) {
          setLastPracticeDate(new Date(result.last_active_date).toDateString());
        }
        saveToStorage(STORAGE_KEY_STREAK, {
          count: result.current_streak,
          lastDate: result.last_active_date
            ? new Date(result.last_active_date).toDateString()
            : today,
        });
      }).catch((err) => {
        console.error("Failed to record activity:", err);
        // Keep local values as fallback
      });
    }
  }, [lastPracticeDate, streak, user]);

  // Sync XP from backend (authoritative source)
  const syncXPFromBackend = useCallback((backendTotal: number) => {
    setXP(prev => {
      // Only sync if backend has higher XP (prevent regression)
      if (backendTotal <= prev.total) return prev;

      // Calculate level from backend total
      const newLevel = Math.floor(backendTotal / XP_PER_LEVEL) + 1;
      const newToNextLevel = XP_PER_LEVEL - (backendTotal % XP_PER_LEVEL);

      return {
        total: backendTotal,
        today: prev.today, // Keep today's local tracking
        level: newLevel,
        toNextLevel: newToNextLevel,
      };
    });
  }, []);

  // Streak management
  const incrementStreak = useCallback(() => {
    setCorrectStreak(prev => prev + 1);
  }, []);

  const resetStreak = useCallback(() => {
    setCorrectStreak(0);
  }, []);

  // Animation triggers
  const triggerConfetti = useCallback(() => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);
  }, []);

  const triggerXPPopup = useCallback((amount: number, bonus = 0) => {
    setShowXPPopup({ amount, bonus });
    setTimeout(() => setShowXPPopup(null), 1500);
  }, []);

  const triggerShake = useCallback(() => {
    setShowShake(true);
    setTimeout(() => setShowShake(false), 500);
  }, []);

  return (
    <GamificationContext.Provider
      value={{
        hearts,
        loseHeart,
        refillHearts,
        hasHearts: hearts.current > 0,
        timeUntilRefill,
        xp,
        addXP,
        syncXPFromBackend,
        streak,
        longestStreak,
        syncStreak,
        correctStreak,
        incrementStreak,
        resetStreak,
        showConfetti,
        triggerConfetti,
        showXPPopup,
        triggerXPPopup,
        showShake,
        triggerShake,
      }}
    >
      {children}
    </GamificationContext.Provider>
  );
}

export function useGamification() {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error("useGamification must be used within GamificationProvider");
  }
  return context;
}

// Helper hook for exercise answers
export function useExerciseAnswer() {
  const {
    loseHeart,
    addXP,
    correctStreak,
    incrementStreak,
    resetStreak,
    triggerConfetti,
    triggerXPPopup,
    triggerShake,
    hasHearts,
  } = useGamification();

  const handleAnswer = useCallback((isCorrect: boolean) => {
    if (isCorrect) {
      // Calculate XP with streak bonus
      const baseXP = XP_PER_CORRECT;
      const bonus = correctStreak >= 2 ? XP_STREAK_BONUS : 0;
      const totalXP = baseXP + bonus;

      addXP(totalXP);
      incrementStreak();
      triggerConfetti();
      triggerXPPopup(baseXP, bonus);

      return { xpEarned: baseXP, streakBonus: bonus };
    } else {
      loseHeart();
      resetStreak();
      triggerShake();

      return { xpEarned: 0, streakBonus: 0 };
    }
  }, [correctStreak, loseHeart, addXP, incrementStreak, resetStreak, triggerConfetti, triggerXPPopup, triggerShake]);

  return { handleAnswer, hasHearts };
}
