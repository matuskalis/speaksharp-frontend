"use client";

import { useState } from "react";
import { Bell, BellOff, Flame, Swords, Trophy, Target, AlertCircle } from "lucide-react";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { cn } from "@/lib/utils";

export function NotificationSettings() {
  const {
    isSupported,
    permission,
    isSubscribed,
    isLoading,
    preferences,
    subscribe,
    unsubscribe,
    updatePreferences,
    sendTestNotification,
  } = usePushNotifications();

  const [testSent, setTestSent] = useState(false);

  const handleToggleNotifications = async () => {
    if (isSubscribed) {
      await unsubscribe();
    } else {
      await subscribe();
    }
  };

  const handleTestNotification = async () => {
    const success = await sendTestNotification();
    if (success) {
      setTestSent(true);
      setTimeout(() => setTestSent(false), 3000);
    }
  };

  const handleTogglePreference = async (key: keyof typeof preferences) => {
    if (key === "enabled") return; // Use subscribe/unsubscribe for this
    await updatePreferences({ [key]: !preferences[key] });
  };

  if (!isSupported) {
    return (
      <div className="p-6 bg-white/[0.03] rounded-2xl border border-white/[0.08]">
        <div className="flex items-center gap-3 text-amber-400">
          <AlertCircle className="w-5 h-5" />
          <div>
            <p className="font-medium">Push notifications not supported</p>
            <p className="text-sm text-white/50">
              Your browser doesn't support push notifications.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (permission === "denied") {
    return (
      <div className="p-6 bg-white/[0.03] rounded-2xl border border-white/[0.08]">
        <div className="flex items-center gap-3 text-red-400">
          <BellOff className="w-5 h-5" />
          <div>
            <p className="font-medium">Notifications blocked</p>
            <p className="text-sm text-white/50">
              You've blocked notifications. Enable them in your browser settings to receive updates.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main toggle */}
      <div className="p-6 bg-white/[0.03] rounded-2xl border border-white/[0.08]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center",
              isSubscribed
                ? "bg-gradient-to-br from-emerald-500/20 to-emerald-400/10"
                : "bg-white/[0.05]"
            )}>
              {isSubscribed ? (
                <Bell className="w-6 h-6 text-emerald-400" />
              ) : (
                <BellOff className="w-6 h-6 text-white/40" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Push Notifications</h3>
              <p className="text-sm text-white/50">
                {isSubscribed
                  ? "You'll receive notifications about your learning progress"
                  : "Enable to get reminders and updates"}
              </p>
            </div>
          </div>

          <button
            onClick={handleToggleNotifications}
            disabled={isLoading}
            className={cn(
              "relative w-14 h-8 rounded-full transition-colors duration-200",
              isSubscribed ? "bg-emerald-500" : "bg-white/10",
              isLoading && "opacity-50 cursor-wait"
            )}
          >
            <span
              className={cn(
                "absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-200",
                isSubscribed ? "left-7" : "left-1"
              )}
            />
          </button>
        </div>

        {/* Test notification button */}
        {isSubscribed && (
          <div className="mt-4 pt-4 border-t border-white/[0.06]">
            <button
              onClick={handleTestNotification}
              disabled={isLoading || testSent}
              className="text-sm text-accent-purple hover:text-accent-purple/80 disabled:text-white/30"
            >
              {testSent ? "Test notification sent!" : "Send test notification"}
            </button>
          </div>
        )}
      </div>

      {/* Notification types */}
      {isSubscribed && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-white/60 uppercase tracking-wider">
            Notification Types
          </h4>

          <NotificationTypeToggle
            icon={<Flame className="w-5 h-5" />}
            label="Streak Reminders"
            description="Get reminded before your streak is at risk"
            enabled={preferences.streak_reminders}
            onToggle={() => handleTogglePreference("streak_reminders")}
            disabled={isLoading}
          />

          <NotificationTypeToggle
            icon={<Swords className="w-5 h-5" />}
            label="Friend Challenges"
            description="When friends challenge you to compete"
            enabled={preferences.friend_challenges}
            onToggle={() => handleTogglePreference("friend_challenges")}
            disabled={isLoading}
          />

          <NotificationTypeToggle
            icon={<Trophy className="w-5 h-5" />}
            label="Achievements"
            description="When you unlock new achievements"
            enabled={preferences.achievements}
            onToggle={() => handleTogglePreference("achievements")}
            disabled={isLoading}
          />

          <NotificationTypeToggle
            icon={<Target className="w-5 h-5" />}
            label="Daily Goals"
            description="Reminders about your daily learning goals"
            enabled={preferences.daily_goals}
            onToggle={() => handleTogglePreference("daily_goals")}
            disabled={isLoading}
          />
        </div>
      )}
    </div>
  );
}

interface NotificationTypeToggleProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

function NotificationTypeToggle({
  icon,
  label,
  description,
  enabled,
  onToggle,
  disabled,
}: NotificationTypeToggleProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-white/[0.03] rounded-xl border border-white/[0.08]">
      <div className="flex items-center gap-3">
        <div className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center",
          enabled ? "bg-accent-purple/20 text-accent-purple" : "bg-white/[0.05] text-white/40"
        )}>
          {icon}
        </div>
        <div>
          <p className="font-medium text-white">{label}</p>
          <p className="text-sm text-white/50">{description}</p>
        </div>
      </div>

      <button
        onClick={onToggle}
        disabled={disabled}
        className={cn(
          "relative w-12 h-7 rounded-full transition-colors duration-200",
          enabled ? "bg-accent-purple" : "bg-white/10",
          disabled && "opacity-50 cursor-wait"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-200",
            enabled ? "left-5" : "left-0.5"
          )}
        />
      </button>
    </div>
  );
}
