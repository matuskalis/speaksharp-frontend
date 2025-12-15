"use client";

import { useState, useEffect, useCallback } from "react";
import {
  isPushSupported,
  getNotificationPermission,
  requestNotificationPermission,
  subscribeToPush,
  unsubscribeFromPush,
  isSubscribedToPush,
  PushPreferences,
  DEFAULT_PUSH_PREFERENCES,
} from "@/lib/push-notifications";
import { apiClient } from "@/lib/api-client";

interface UsePushNotificationsReturn {
  isSupported: boolean;
  permission: NotificationPermission;
  isSubscribed: boolean;
  isLoading: boolean;
  preferences: PushPreferences;
  subscribe: () => Promise<boolean>;
  unsubscribe: () => Promise<boolean>;
  updatePreferences: (prefs: Partial<PushPreferences>) => Promise<void>;
  sendTestNotification: () => Promise<boolean>;
}

export function usePushNotifications(): UsePushNotificationsReturn {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [preferences, setPreferences] = useState<PushPreferences>(DEFAULT_PUSH_PREFERENCES);

  // Check initial state
  useEffect(() => {
    const checkState = async () => {
      setIsLoading(true);

      const supported = isPushSupported();
      setIsSupported(supported);

      if (supported) {
        setPermission(getNotificationPermission());
        const subscribed = await isSubscribedToPush();
        setIsSubscribed(subscribed);

        // Load preferences from backend
        try {
          const prefs = await apiClient.getPushPreferences();
          setPreferences({
            enabled: prefs.enabled,
            streak_reminders: prefs.streak_reminders,
            friend_challenges: prefs.friend_challenges,
            achievements: prefs.achievements,
            daily_goals: prefs.daily_goals,
          });
        } catch (error) {
          // Use defaults if not logged in or error
          console.error("Failed to load push preferences:", error);
        }
      }

      setIsLoading(false);
    };

    checkState();
  }, []);

  const subscribe = useCallback(async (): Promise<boolean> => {
    if (!isSupported) return false;

    setIsLoading(true);
    try {
      // Request permission if not granted
      if (permission !== "granted") {
        const newPermission = await requestNotificationPermission();
        setPermission(newPermission);
        if (newPermission !== "granted") {
          setIsLoading(false);
          return false;
        }
      }

      // Subscribe to push
      const subscription = await subscribeToPush();
      if (subscription) {
        setIsSubscribed(true);
        // Update backend preferences
        await apiClient.updatePushPreferences({ enabled: true });
        setPreferences((prev) => ({ ...prev, enabled: true }));
        setIsLoading(false);
        return true;
      }
    } catch (error) {
      console.error("Failed to subscribe to push:", error);
    }

    setIsLoading(false);
    return false;
  }, [isSupported, permission]);

  const unsubscribe = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      const success = await unsubscribeFromPush();
      if (success) {
        setIsSubscribed(false);
        // Update backend preferences
        await apiClient.updatePushPreferences({ enabled: false });
        setPreferences((prev) => ({ ...prev, enabled: false }));
      }
      setIsLoading(false);
      return success;
    } catch (error) {
      console.error("Failed to unsubscribe from push:", error);
      setIsLoading(false);
      return false;
    }
  }, []);

  const updatePreferences = useCallback(
    async (prefs: Partial<PushPreferences>): Promise<void> => {
      try {
        const updated = await apiClient.updatePushPreferences(prefs);
        setPreferences({
          enabled: updated.enabled,
          streak_reminders: updated.streak_reminders,
          friend_challenges: updated.friend_challenges,
          achievements: updated.achievements,
          daily_goals: updated.daily_goals,
        });
      } catch (error) {
        console.error("Failed to update push preferences:", error);
        throw error;
      }
    },
    []
  );

  const sendTestNotification = useCallback(async (): Promise<boolean> => {
    try {
      const result = await apiClient.sendTestPush();
      return result.success;
    } catch (error) {
      console.error("Failed to send test notification:", error);
      return false;
    }
  }, []);

  return {
    isSupported,
    permission,
    isSubscribed,
    isLoading,
    preferences,
    subscribe,
    unsubscribe,
    updatePreferences,
    sendTestNotification,
  };
}
