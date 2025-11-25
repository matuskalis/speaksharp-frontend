"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { UserProfileResponse } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ProfileForm() {
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [level, setLevel] = useState<string>("A1");
  const [nativeLanguage, setNativeLanguage] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // CEFR level descriptions
  const levelDescriptions: Record<string, string> = {
    A1: "Beginner",
    A2: "Elementary",
    B1: "Intermediate",
    B2: "Upper-Intermediate",
    C1: "Advanced",
    C2: "Proficient"
  };

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
      setFullName((data as any).full_name || "");
      setCountry((data as any).country || "");
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
        full_name: fullName.trim() || undefined,
        country: country.trim() || undefined,
      } as any);
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
      <div className="max-w-3xl mx-auto space-y-6">
        <Card className="animate-pulse">
          <CardContent>
            <div className="h-6 bg-white/[0.05] rounded mb-6 w-1/3"></div>
            <div className="h-10 bg-white/[0.05] rounded mb-4"></div>
            <div className="h-10 bg-white/[0.05] rounded"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* English Level Card */}
      <Card>
        <CardHeader>
          <CardTitle>English Level</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Level Display */}
            <div className="flex items-center justify-between p-5 bg-white/[0.03] border border-white/[0.08] rounded-xl">
              <div>
                <div className="flex items-baseline gap-3">
                  <span className="text-display font-bold text-text-primary">{level}</span>
                  <span className="text-body text-text-tertiary">
                    {levelDescriptions[level]}
                  </span>
                </div>
                <p className="text-caption text-text-quaternary mt-2">
                  Common European Framework of Reference
                </p>
              </div>
              <div className="px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-lg">
                <span className="text-caption font-medium">Verified</span>
              </div>
            </div>

            {/* Retake Test Button */}
            <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl">
              <div>
                <p className="text-body-lg text-text-secondary font-medium">
                  Update your level
                </p>
                <p className="text-caption text-text-quaternary mt-1">
                  Take our placement test to reassess your English proficiency
                </p>
              </div>
              <a href="/placement-test">
                <Button variant="secondary" size="md">
                  {level === "A1" && profile?.created_at === profile?.updated_at
                    ? "Take Test"
                    : "Retake Test"}
                </Button>
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="space-y-5">
              {/* Full Name */}
              <div className="space-y-2">
                <label htmlFor="fullName" className="block text-body-lg font-medium text-text-secondary">
                  Full Name
                  <span className="text-caption text-text-quaternary ml-2">(optional)</span>
                </label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  disabled={saving}
                  fullWidth
                />
              </div>

              {/* Country */}
              <div className="space-y-2">
                <label htmlFor="country" className="block text-body-lg font-medium text-text-secondary">
                  Country
                  <span className="text-caption text-text-quaternary ml-2">(optional)</span>
                </label>
                <Input
                  id="country"
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g., United States, Spain, Japan"
                  disabled={saving}
                  fullWidth
                />
              </div>

              {/* Native Language */}
              <div className="space-y-2">
                <label htmlFor="nativeLanguage" className="block text-body-lg font-medium text-text-secondary">
                  Native Language
                  <span className="text-caption text-text-quaternary ml-2">(required)</span>
                </label>
                <Input
                  id="nativeLanguage"
                  type="text"
                  value={nativeLanguage}
                  onChange={(e) => setNativeLanguage(e.target.value)}
                  placeholder="e.g., Spanish, Mandarin, French"
                  disabled={saving}
                  fullWidth
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-5 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                <p className="text-body text-red-400">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mt-5 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                <p className="text-body text-green-400">Profile updated successfully!</p>
              </div>
            )}
          </CardContent>

          <CardFooter>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={saving}
            >
              {saving ? "Saving changes..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Account Information Card */}
      {profile && (
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-3">
              <div className="flex justify-between py-2 border-b border-white/[0.06]">
                <dt className="text-body text-text-tertiary">User ID</dt>
                <dd className="text-body-lg font-mono text-text-secondary">{profile.user_id}</dd>
              </div>
              <div className="flex justify-between py-2 border-b border-white/[0.06]">
                <dt className="text-body text-text-tertiary">Account Created</dt>
                <dd className="text-body-lg text-text-secondary">
                  {new Date(profile.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  })}
                </dd>
              </div>
              <div className="flex justify-between py-2">
                <dt className="text-body text-text-tertiary">Last Updated</dt>
                <dd className="text-body-lg text-text-secondary">
                  {new Date(profile.updated_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  })}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
