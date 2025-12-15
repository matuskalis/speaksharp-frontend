"use client";

import { useGamification } from "@/contexts/GamificationContext";
import AchievementToast from "./AchievementToast";

export default function GlobalAchievementToast() {
  const { pendingAchievement, dismissAchievement } = useGamification();

  return (
    <AchievementToast
      achievement={pendingAchievement}
      onClose={dismissAchievement}
    />
  );
}
