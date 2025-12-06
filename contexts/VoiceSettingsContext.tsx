"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { apiClient } from "@/lib/api-client";

export interface VoiceSettings {
  voice: string;
  speechSpeed: number;
  autoPlayResponses: boolean;
  showTranscription: boolean;
  microphoneSensitivity: number;
}

interface VoiceSettingsContextType {
  settings: VoiceSettings;
  updateSettings: (updates: Partial<VoiceSettings>) => void;
  saveToServer: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const VoiceSettingsContext = createContext<VoiceSettingsContextType | undefined>(undefined);

const DEFAULT_SETTINGS: VoiceSettings = {
  voice: "alloy",
  speechSpeed: 1.0,
  autoPlayResponses: true,
  showTranscription: true,
  microphoneSensitivity: 0.5,
};

export function VoiceSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<VoiceSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load settings from localStorage on mount
  useEffect(() => {
    const loadSettings = () => {
      try {
        const savedSettings = localStorage.getItem("voiceSettings");
        if (savedSettings) {
          const parsed = JSON.parse(savedSettings);
          setSettings({ ...DEFAULT_SETTINGS, ...parsed });
        }
      } catch (err) {
        console.error("Failed to load voice settings from localStorage:", err);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Save to localStorage whenever settings change
  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem("voiceSettings", JSON.stringify(settings));
      } catch (err) {
        console.error("Failed to save voice settings to localStorage:", err);
      }
    }
  }, [settings, loading]);

  const updateSettings = (updates: Partial<VoiceSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  const saveToServer = async () => {
    try {
      setError(null);
      await apiClient.updateVoicePreferences(settings);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to save voice settings";
      setError(errorMessage);
      throw err;
    }
  };

  return (
    <VoiceSettingsContext.Provider
      value={{
        settings,
        updateSettings,
        saveToServer,
        loading,
        error,
      }}
    >
      {children}
    </VoiceSettingsContext.Provider>
  );
}

export function useVoiceSettings() {
  const context = useContext(VoiceSettingsContext);
  if (context === undefined) {
    throw new Error("useVoiceSettings must be used within a VoiceSettingsProvider");
  }
  return context;
}
