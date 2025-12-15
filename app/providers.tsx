"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { GamificationProvider } from "@/contexts/GamificationContext";
import { VoiceSettingsProvider } from "@/contexts/VoiceSettingsContext";
import { ErrorBoundary } from "@/components/error-boundary";
import GlobalAchievementToast from "./components/GlobalAchievementToast";
import GlobalStreakMilestoneToast from "./components/GlobalStreakMilestoneToast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <GamificationProvider>
          <VoiceSettingsProvider>
            {children}
            <GlobalAchievementToast />
            <GlobalStreakMilestoneToast />
          </VoiceSettingsProvider>
        </GamificationProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
