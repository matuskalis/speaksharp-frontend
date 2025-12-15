"use client";

import { useGamification } from "@/contexts/GamificationContext";
import { StreakMilestoneToast } from "@/components/social/StreakMilestoneToast";

export default function GlobalStreakMilestoneToast() {
  const { streak, streakMilestone, dismissStreakMilestone } = useGamification();

  if (!streakMilestone) return null;

  return (
    <StreakMilestoneToast
      isOpen={!!streakMilestone}
      onClose={dismissStreakMilestone}
      streak={streak}
      milestone={streakMilestone}
      autoCloseDelay={8000}
    />
  );
}
