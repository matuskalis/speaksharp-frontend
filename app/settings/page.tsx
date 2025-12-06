"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { MobileAppShell } from "@/components/mobile-app-shell";
import { Switch } from "@/components/ui/switch";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  User,
  Mail,
  Lock,
  Globe,
  Target,
  Clock,
  Bell,
  Volume2,
  Headphones,
  Lightbulb,
  CreditCard,
  AlertTriangle,
  Trash2,
  RotateCcw,
  ChevronRight,
  Save,
  Mic,
  Subtitles,
  Gauge,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { useVoiceSettings } from "@/contexts/VoiceSettingsContext";

export default function SettingsPage() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile();
  const { settings: voiceSettings, updateSettings: updateVoiceSettings, saveToServer: saveVoiceSettings } = useVoiceSettings();

  // Account settings
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");

  // Learning preferences
  const [nativeLanguage, setNativeLanguage] = useState("");
  const [targetLevel, setTargetLevel] = useState("A1");
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(15);
  const [preferredStudyTime, setPreferredStudyTime] = useState("evening");

  // Notification settings
  const [dailyReminder, setDailyReminder] = useState(true);
  const [reminderTime, setReminderTime] = useState("18:00");
  const [streakAlerts, setStreakAlerts] = useState(true);
  const [weeklyEmail, setWeeklyEmail] = useState(true);
  const [achievementNotifications, setAchievementNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  // App settings
  const [soundEffects, setSoundEffects] = useState(true);
  const [autoPlayAudio, setAutoPlayAudio] = useState(true);
  const [showHints, setShowHints] = useState(true);

  // UI state
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/get-started");
      return;
    }

    if (profile) {
      setDisplayName(profile.full_name || "");
      setEmail(user.email || "");
      setNativeLanguage(profile.native_language || "");
      setTargetLevel(profile.level || "A1");
      setDailyGoalMinutes(profile.daily_time_goal || 15);
      // Load other preferences from profile if they exist
    }
  }, [user, profile, router]);

  const handleSaveAccountSettings = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await apiClient.updateProfile({
        full_name: displayName.trim() || undefined,
      } as any);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveLearningPreferences = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await apiClient.updateProfile({
        native_language: nativeLanguage.trim() || undefined,
        daily_time_goal: dailyGoalMinutes,
      } as any);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save preferences");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveVoiceSettings = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await saveVoiceSettings();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save voice settings");
    } finally {
      setSaving(false);
    }
  };

  const handleResetProgress = async () => {
    // TODO: Implement reset progress API call
    setShowResetDialog(false);
    alert("Reset progress functionality will be implemented with backend support");
  };

  const handleDeleteAccount = async () => {
    // TODO: Implement delete account API call
    setShowDeleteDialog(false);
    alert("Delete account functionality will be implemented with backend support");
  };

  const handleManageSubscription = async () => {
    // TODO: Implement Stripe customer portal redirect
    router.push("/subscribe");
  };

  if (!user) return null;

  return (
    <MobileAppShell>
      <div className="min-h-screen bg-dark pb-20">
        {/* Header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-gradient-radial from-accent-purple/20 via-transparent to-transparent blur-3xl" />
            <div className="absolute top-10 right-0 w-[300px] h-[300px] bg-gradient-radial from-accent-pink/15 via-transparent to-transparent blur-3xl" />
          </div>

          <div className="relative px-4 pt-8 pb-6">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold text-text-primary"
            >
              Settings
            </motion.h1>
            <p className="text-text-muted mt-1">Manage your account and preferences</p>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 space-y-4">
          {/* Success/Error Messages */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-green-500/10 border border-green-500/30 rounded-2xl"
            >
              <p className="text-sm text-green-400">Settings saved successfully!</p>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl"
            >
              <p className="text-sm text-red-400">{error}</p>
            </motion.div>
          )}

          {/* Account Settings */}
          <SettingsSection
            title="Account Settings"
            icon={User}
            description="Manage your account information"
          >
            <div className="space-y-4">
              <SettingField label="Display Name" icon={User}>
                <Input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your name"
                  fullWidth
                />
              </SettingField>

              <SettingField label="Email" icon={Mail}>
                <Input
                  type="email"
                  value={email}
                  disabled
                  fullWidth
                  className="opacity-60"
                />
                <p className="text-xs text-text-muted mt-1">
                  Email cannot be changed directly. Please contact support.
                </p>
              </SettingField>

              <SettingRow
                icon={Lock}
                label="Change Password"
                description="Update your password"
                onClick={() => router.push("/account/password")}
              />

              <Button
                variant="primary"
                size="md"
                onClick={handleSaveAccountSettings}
                disabled={saving}
                fullWidth
              >
                <Save className="w-4 h-4 mr-2" />
                Save Account Settings
              </Button>
            </div>
          </SettingsSection>

          {/* Learning Preferences */}
          <SettingsSection
            title="Learning Preferences"
            icon={Target}
            description="Customize your learning experience"
          >
            <div className="space-y-4">
              <SettingField label="Native Language" icon={Globe}>
                <Input
                  type="text"
                  value={nativeLanguage}
                  onChange={(e) => setNativeLanguage(e.target.value)}
                  placeholder="e.g., Spanish, Mandarin"
                  fullWidth
                />
              </SettingField>

              <SettingField label="Target CEFR Level" icon={Target}>
                <Select
                  value={targetLevel}
                  onChange={(e) => setTargetLevel(e.target.value)}
                  options={[
                    { value: "A1", label: "A1 - Beginner" },
                    { value: "A2", label: "A2 - Elementary" },
                    { value: "B1", label: "B1 - Intermediate" },
                    { value: "B2", label: "B2 - Upper-Intermediate" },
                    { value: "C1", label: "C1 - Advanced" },
                    { value: "C2", label: "C2 - Proficient" },
                  ]}
                  fullWidth
                />
              </SettingField>

              <SettingField label="Daily Goal (minutes)" icon={Clock}>
                <Select
                  value={dailyGoalMinutes.toString()}
                  onChange={(e) => setDailyGoalMinutes(parseInt(e.target.value))}
                  options={[
                    { value: "5", label: "5 minutes" },
                    { value: "10", label: "10 minutes" },
                    { value: "15", label: "15 minutes" },
                    { value: "20", label: "20 minutes" },
                    { value: "30", label: "30 minutes" },
                    { value: "45", label: "45 minutes" },
                    { value: "60", label: "60 minutes" },
                  ]}
                  fullWidth
                />
              </SettingField>

              <SettingField label="Preferred Study Time" icon={Clock}>
                <Select
                  value={preferredStudyTime}
                  onChange={(e) => setPreferredStudyTime(e.target.value)}
                  options={[
                    { value: "morning", label: "Morning (6am - 12pm)" },
                    { value: "afternoon", label: "Afternoon (12pm - 6pm)" },
                    { value: "evening", label: "Evening (6pm - 10pm)" },
                    { value: "night", label: "Night (10pm - 6am)" },
                  ]}
                  fullWidth
                />
              </SettingField>

              <Button
                variant="primary"
                size="md"
                onClick={handleSaveLearningPreferences}
                disabled={saving}
                fullWidth
              >
                <Save className="w-4 h-4 mr-2" />
                Save Learning Preferences
              </Button>
            </div>
          </SettingsSection>

          {/* Notification Settings */}
          <SettingsSection
            title="Notification Settings"
            icon={Bell}
            description="Control how we communicate with you"
          >
            <div className="space-y-4">
              <SettingToggle
                label="Daily Reminder"
                description="Get reminded to practice every day"
                checked={dailyReminder}
                onCheckedChange={setDailyReminder}
              />

              {dailyReminder && (
                <SettingField label="Reminder Time" icon={Clock}>
                  <Input
                    type="time"
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    fullWidth
                  />
                </SettingField>
              )}

              <SettingToggle
                label="Streak at Risk Alerts"
                description="Get notified when your streak is about to break"
                checked={streakAlerts}
                onCheckedChange={setStreakAlerts}
              />

              <SettingToggle
                label="Weekly Progress Email"
                description="Receive a summary of your progress each week"
                checked={weeklyEmail}
                onCheckedChange={setWeeklyEmail}
              />

              <SettingToggle
                label="Achievement Notifications"
                description="Get notified when you unlock achievements"
                checked={achievementNotifications}
                onCheckedChange={setAchievementNotifications}
              />

              <SettingToggle
                label="Marketing Emails"
                description="Receive tips, updates, and special offers"
                checked={marketingEmails}
                onCheckedChange={setMarketingEmails}
              />
            </div>
          </SettingsSection>

          {/* App Settings */}
          <SettingsSection
            title="App Settings"
            icon={Volume2}
            description="Customize your app experience"
          >
            <div className="space-y-4">
              <SettingToggle
                label="Sound Effects"
                description="Play sounds for actions and feedback"
                checked={soundEffects}
                onCheckedChange={setSoundEffects}
              />

              <SettingToggle
                label="Auto-play Audio"
                description="Automatically play audio in lessons"
                checked={autoPlayAudio}
                onCheckedChange={setAutoPlayAudio}
              />

              <SettingToggle
                label="Show Hints by Default"
                description="Display hints without clicking"
                checked={showHints}
                onCheckedChange={setShowHints}
              />
            </div>
          </SettingsSection>

          {/* Voice & Speech Settings */}
          <SettingsSection
            title="Voice & Speech"
            icon={Headphones}
            description="Customize your voice tutor experience"
          >
            <div className="space-y-4">
              <SettingField label="Voice Selection" icon={Volume2}>
                <Select
                  value={voiceSettings.voice}
                  onChange={(e) => updateVoiceSettings({ voice: e.target.value })}
                  options={[
                    { value: "alloy", label: "Alloy (Neutral)" },
                    { value: "echo", label: "Echo (Male)" },
                    { value: "fable", label: "Fable (British)" },
                    { value: "onyx", label: "Onyx (Deep)" },
                    { value: "nova", label: "Nova (Female)" },
                    { value: "shimmer", label: "Shimmer (Soft)" },
                  ]}
                  fullWidth
                />
                <p className="text-xs text-text-muted mt-1">
                  Choose the AI voice that will speak to you during lessons
                </p>
              </SettingField>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-text-muted" />
                    <label className="text-sm font-medium text-text-secondary">
                      Speech Speed
                    </label>
                  </div>
                  <span className="text-sm text-accent-purple font-semibold">
                    {voiceSettings.speechSpeed}x
                  </span>
                </div>
                <Slider
                  value={[voiceSettings.speechSpeed]}
                  onValueChange={(value) => updateVoiceSettings({ speechSpeed: value[0] })}
                  min={0.5}
                  max={2.0}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-text-muted">
                  <span>0.5x (Slower)</span>
                  <span>2.0x (Faster)</span>
                </div>
                <p className="text-xs text-text-muted">
                  Adjust how fast the AI tutor speaks to you
                </p>
              </div>

              <SettingToggle
                label="Auto-play Responses"
                description="Automatically play voice responses after you speak"
                checked={voiceSettings.autoPlayResponses}
                onCheckedChange={(checked) => updateVoiceSettings({ autoPlayResponses: checked })}
              />

              <SettingToggle
                label="Show Transcription"
                description="Display text transcription of your speech"
                checked={voiceSettings.showTranscription}
                onCheckedChange={(checked) => updateVoiceSettings({ showTranscription: checked })}
              />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mic className="w-4 h-4 text-text-muted" />
                    <label className="text-sm font-medium text-text-secondary">
                      Microphone Sensitivity
                    </label>
                  </div>
                  <span className="text-sm text-accent-purple font-semibold">
                    {Math.round(voiceSettings.microphoneSensitivity * 100)}%
                  </span>
                </div>
                <Slider
                  value={[voiceSettings.microphoneSensitivity]}
                  onValueChange={(value) => updateVoiceSettings({ microphoneSensitivity: value[0] })}
                  min={0}
                  max={1}
                  step={0.05}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-text-muted">
                  <span>Low</span>
                  <span>High</span>
                </div>
                <p className="text-xs text-text-muted">
                  Adjust how sensitive the microphone is to background noise
                </p>
              </div>

              <Button
                variant="primary"
                size="md"
                onClick={handleSaveVoiceSettings}
                disabled={saving}
                fullWidth
              >
                <Save className="w-4 h-4 mr-2" />
                Save Voice Settings
              </Button>
            </div>
          </SettingsSection>

          {/* Subscription */}
          <SettingsSection
            title="Subscription"
            icon={CreditCard}
            description="Manage your subscription and billing"
          >
            <div className="space-y-4">
              <div className="p-4 bg-dark-200 border border-white/[0.08] rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-text-secondary">Current Plan</span>
                  <span className="px-3 py-1 bg-gradient-brand text-white text-xs font-semibold rounded-lg">
                    {profile?.subscription_tier || "Free"}
                  </span>
                </div>
                {profile?.trial_end_date && (
                  <p className="text-xs text-text-muted">
                    Trial ends: {new Date(profile.trial_end_date).toLocaleDateString()}
                  </p>
                )}
              </div>

              <Button
                variant="primary"
                size="md"
                onClick={handleManageSubscription}
                fullWidth
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Manage Subscription
              </Button>

              <SettingRow
                icon={CreditCard}
                label="Billing History"
                description="View past invoices and payments"
                onClick={handleManageSubscription}
              />
            </div>
          </SettingsSection>

          {/* Danger Zone */}
          <SettingsSection
            title="Danger Zone"
            icon={AlertTriangle}
            description="Irreversible actions"
            danger
          >
            <div className="space-y-3">
              <button
                onClick={() => setShowResetDialog(true)}
                className="w-full p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl flex items-center justify-between hover:bg-yellow-500/20 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <RotateCcw className="w-5 h-5 text-yellow-400" />
                  <div className="text-left">
                    <p className="font-medium text-yellow-400">Reset Progress</p>
                    <p className="text-xs text-yellow-400/70">Start over from scratch</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-yellow-400" />
              </button>

              <button
                onClick={() => setShowDeleteDialog(true)}
                className="w-full p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center justify-between hover:bg-red-500/20 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Trash2 className="w-5 h-5 text-red-400" />
                  <div className="text-left">
                    <p className="font-medium text-red-400">Delete Account</p>
                    <p className="text-xs text-red-400/70">Permanently delete your account</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-red-400" />
              </button>
            </div>
          </SettingsSection>
        </div>

        {/* Reset Progress Dialog */}
        <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reset Progress?</DialogTitle>
              <DialogDescription>
                This will permanently delete all your learning progress, including:
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Your current level and achievements</li>
                  <li>All completed lessons and drills</li>
                  <li>Your streak and statistics</li>
                  <li>All saved vocabulary cards</li>
                </ul>
                <p className="mt-2 font-semibold">This action cannot be undone.</p>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowResetDialog(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleResetProgress}
                className="bg-yellow-500 hover:bg-yellow-600"
              >
                Reset Progress
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Account Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Account?</DialogTitle>
              <DialogDescription>
                This will permanently delete your account and all associated data:
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Your profile and account information</li>
                  <li>All learning progress and achievements</li>
                  <li>Your subscription (if active)</li>
                  <li>All personal data</li>
                </ul>
                <p className="mt-2 font-semibold text-red-400">
                  This action cannot be undone and you will not be able to recover your data.
                </p>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleDeleteAccount}
                className="bg-red-500 hover:bg-red-600"
              >
                Delete Account
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MobileAppShell>
  );
}

// Helper Components

interface SettingsSectionProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  children: React.ReactNode;
  danger?: boolean;
}

function SettingsSection({
  title,
  icon: Icon,
  description,
  children,
  danger = false,
}: SettingsSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass gradient-border rounded-2xl overflow-hidden ${
        danger ? "border-red-500/30" : ""
      }`}
    >
      <div className="p-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-3 mb-1">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              danger ? "bg-red-500/20" : "bg-accent-purple/20"
            }`}
          >
            <Icon
              className={`w-4 h-4 ${danger ? "text-red-400" : "text-accent-purple"}`}
            />
          </div>
          <h2
            className={`font-semibold ${
              danger ? "text-red-400" : "text-text-primary"
            }`}
          >
            {title}
          </h2>
        </div>
        <p className="text-sm text-text-muted ml-11">{description}</p>
      </div>
      <div className="p-4">{children}</div>
    </motion.div>
  );
}

interface SettingFieldProps {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}

function SettingField({ label, icon: Icon, children }: SettingFieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-text-muted" />
        <label className="text-sm font-medium text-text-secondary">{label}</label>
      </div>
      {children}
    </div>
  );
}

interface SettingToggleProps {
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

function SettingToggle({
  label,
  description,
  checked,
  onCheckedChange,
}: SettingToggleProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-dark-200 border border-white/[0.06] rounded-xl">
      <div className="flex-1">
        <p className="font-medium text-text-primary text-sm">{label}</p>
        <p className="text-xs text-text-muted mt-0.5">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

interface SettingRowProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description?: string;
  onClick?: () => void;
}

function SettingRow({ icon: Icon, label, description, onClick }: SettingRowProps) {
  return (
    <button
      onClick={onClick}
      className="w-full p-3 bg-dark-200 border border-white/[0.06] rounded-xl flex items-center justify-between hover:bg-white/[0.02] transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-dark-300 flex items-center justify-center">
          <Icon className="w-4 h-4 text-text-muted" />
        </div>
        <div className="text-left">
          <p className="text-sm font-medium text-text-primary">{label}</p>
          {description && (
            <p className="text-xs text-text-muted mt-0.5">{description}</p>
          )}
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-text-muted" />
    </button>
  );
}
