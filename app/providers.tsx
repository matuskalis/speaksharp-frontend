"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { GamificationProvider } from "@/contexts/GamificationContext";
import { VoiceSettingsProvider } from "@/contexts/VoiceSettingsContext";
import { ErrorBoundary } from "@/components/error-boundary";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <GamificationProvider>
          <VoiceSettingsProvider>{children}</VoiceSettingsProvider>
        </GamificationProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
