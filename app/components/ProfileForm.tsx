"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { UserProfileResponse } from "@/lib/types";

export default function ProfileForm() {
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [level, setLevel] = useState<string>("A1");
  const [nativeLanguage, setNativeLanguage] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Fetch profile on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.getCurrentUser();
      setProfile(data);
      setLevel(data.level || "A1");
      setNativeLanguage(data.native_language || "");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err) || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const updated = await apiClient.updateProfile({
        native_language: nativeLanguage.trim() || undefined,
      });
      setProfile(updated);
      setSuccess(true);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err) || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]">
        <div className="animate-pulse">
          <div className="h-6 bg-white/[0.05] rounded mb-4 w-1/3"></div>
          <div className="h-10 bg-white/[0.05] rounded mb-4"></div>
          <div className="h-10 bg-white/[0.05] rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-7 bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]">
      <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300 mb-6">Your Profile</h2>

      {/* English Level - Read Only */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-white/70 mb-2">
          English Level (CEFR)
        </label>
        <div className="flex items-center gap-4">
          <div className="flex-1 p-4 bg-white/[0.05] border border-white/[0.12] rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-2xl font-bold text-white">{level}</span>
                <span className="ml-3 text-sm text-white/50">
                  {level === "A1" && "Beginner"}
                  {level === "A2" && "Elementary"}
                  {level === "B1" && "Intermediate"}
                  {level === "B2" && "Upper-Intermediate"}
                  {level === "C1" && "Advanced"}
                  {level === "C2" && "Proficient"}
                </span>
              </div>
              <div className="text-xs bg-blue-500/10 text-blue-300 px-3 py-1 rounded border border-blue-500/20">
                Verified by test
              </div>
            </div>
          </div>
          <a
            href="/placement-test"
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-rose-500 text-white font-medium rounded-lg hover:from-indigo-600 hover:to-rose-600 transition-all duration-300 whitespace-nowrap"
          >
            {level === "A1" && profile?.created_at === profile?.updated_at
              ? "Take Test"
              : "Retake Test"}
          </a>
        </div>
        <p className="mt-2 text-xs text-white/40">
          📊 Your level is determined by our placement test to ensure accurate personalized learning.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Native Language */}
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            Native Language
          </label>
          <input
            type="text"
            value={nativeLanguage}
            onChange={(e) => setNativeLanguage(e.target.value)}
            placeholder="e.g., Spanish, Mandarin, French..."
            className="w-full px-4 py-2 bg-white/[0.05] border border-white/[0.12] rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={saving}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400">
            <p className="text-sm">Profile updated successfully!</p>
          </div>
        )}

        {/* Save Button */}
        <button
          type="submit"
          disabled={saving}
          className="w-full px-6 py-3 bg-gradient-to-r from-indigo-500 to-rose-500 text-white font-medium rounded-lg hover:from-indigo-600 hover:to-rose-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>

      {/* Profile Info */}
      {profile && (
        <div className="mt-6 pt-6 border-t border-white/[0.08]">
          <p className="text-xs text-white/50">
            User ID: <code className="text-white/70 bg-white/[0.05] px-2 py-1 rounded">{profile.user_id}</code>
          </p>
          <p className="text-xs text-white/50 mt-1">
            Created: {new Date(profile.created_at).toLocaleDateString()}
          </p>
          <p className="text-xs text-white/50 mt-1">
            Last updated: {new Date(profile.updated_at).toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  );
}
