"use client";

import { useState, useEffect } from "react";
import { AppShell } from "@/components/app-shell";
import { apiClient } from "@/lib/api-client";
import { ReferralCode, ReferralStats } from "@/lib/types";
import { Share2, Copy, Check, UserPlus, Users, Award } from "lucide-react";

export default function ReferralsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [referralCode, setReferralCode] = useState<ReferralCode | null>(null);
  const [referralStats, setReferralStats] = useState<ReferralStats | null>(null);

  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  // Claim referral state
  const [claimCode, setClaimCode] = useState("");
  const [claiming, setClaiming] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);
  const [claimError, setClaimError] = useState<string | null>(null);

  useEffect(() => {
    loadReferralData();
  }, []);

  const loadReferralData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [code, stats] = await Promise.all([
        apiClient.getMyReferralCode(),
        apiClient.getReferralStats(),
      ]);

      setReferralCode(code);
      setReferralStats(stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load referral data");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (referralCode) {
      navigator.clipboard.writeText(referralCode.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyLink = () => {
    if (referralCode) {
      const shareableLink = `${window.location.origin}?ref=${referralCode.code}`;
      navigator.clipboard.writeText(shareableLink);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }
  };

  const handleClaimReferral = async () => {
    if (!claimCode.trim()) {
      setClaimError("Please enter a referral code");
      return;
    }

    setClaiming(true);
    setClaimError(null);
    setClaimSuccess(false);

    try {
      await apiClient.claimReferral({ referral_code: claimCode.trim().toUpperCase() });
      setClaimSuccess(true);
      setClaimCode("");
      // Reload stats to show updated conversion count
      loadReferralData();
    } catch (err) {
      setClaimError(err instanceof Error ? err.message : "Failed to claim referral code");
    } finally {
      setClaiming(false);
    }
  };

  if (loading) {
    return (
      <AppShell>
        <div className="max-w-5xl mx-auto p-6 text-center">
          <div className="text-white/60">Loading referral data...</div>
        </div>
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="max-w-5xl mx-auto p-6">
          <div className="p-5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 backdrop-blur-sm">
            {error}
          </div>
        </div>
      </AppShell>
    );
  }

  const shareableLink = referralCode ? `${typeof window !== 'undefined' ? window.location.origin : ''}?ref=${referralCode.code}` : "";

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-white/90 to-purple-300 mb-3">
            Refer Friends
          </h2>
          <p className="text-white/50 text-lg">Share SpeakSharp and help others learn</p>
        </div>

        {/* Stats Overview */}
        <div className="bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] p-7">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Referral Code */}
            <div className="text-center p-5 bg-white/[0.03] rounded-xl border border-white/[0.08]">
              <div className="text-4xl mb-2">
                <Share2 className="w-12 h-12 mx-auto text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {referralCode?.code || "N/A"}
              </div>
              <div className="text-sm text-white/60">Your Referral Code</div>
            </div>

            {/* Total Signups */}
            <div className="text-center p-5 bg-white/[0.03] rounded-xl border border-white/[0.08]">
              <div className="text-4xl mb-2">
                <UserPlus className="w-12 h-12 mx-auto text-green-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {referralStats?.total_signups || 0}
              </div>
              <div className="text-sm text-white/60">Total Signups</div>
            </div>

            {/* Total Conversions */}
            <div className="text-center p-5 bg-white/[0.03] rounded-xl border border-white/[0.08]">
              <div className="text-4xl mb-2">
                <Users className="w-12 h-12 mx-auto text-purple-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {referralStats?.total_conversions || 0}
              </div>
              <div className="text-sm text-white/60">Active Referrals</div>
            </div>
          </div>
        </div>

        {/* Your Referral Code */}
        <div className="bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] p-7">
          <div className="flex items-center gap-3 mb-6">
            <Share2 className="w-6 h-6 text-blue-400" />
            <h3 className="text-xl font-semibold text-white">Share Your Code</h3>
          </div>

          {referralCode && (
            <div className="space-y-4">
              {/* Code Display */}
              <div className="flex items-center gap-3">
                <div className="flex-1 p-4 bg-white/[0.05] rounded-xl border border-white/[0.12] font-mono text-2xl text-center text-white tracking-widest">
                  {referralCode.code}
                </div>
                <button
                  onClick={handleCopyCode}
                  className="px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium rounded-xl transition-all duration-300 flex items-center gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="w-5 h-5" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" />
                      Copy
                    </>
                  )}
                </button>
              </div>

              {/* Shareable Link */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Or share this link:
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={shareableLink}
                    readOnly
                    className="flex-1 px-4 py-3 bg-white/[0.05] border border-white/[0.12] rounded-xl text-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-6 py-3 bg-white/[0.08] hover:bg-white/[0.12] border border-white/[0.12] text-white font-medium rounded-xl transition-all flex items-center gap-2"
                  >
                    {linkCopied ? (
                      <>
                        <Check className="w-5 h-5" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-5 h-5" />
                        Copy Link
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <p className="text-sm text-blue-200">
                  💡 Share your code with friends! When they sign up and become active users, you'll both benefit from the SpeakSharp community.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Claim a Referral Code */}
        <div className="bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] p-7">
          <div className="flex items-center gap-3 mb-6">
            <Award className="w-6 h-6 text-purple-400" />
            <h3 className="text-xl font-semibold text-white">Have a Referral Code?</h3>
          </div>

          <div className="space-y-4">
            <p className="text-white/70">
              If someone referred you to SpeakSharp, enter their code here to connect.
            </p>

            <div className="flex items-center gap-3">
              <input
                type="text"
                value={claimCode}
                onChange={(e) => setClaimCode(e.target.value.toUpperCase())}
                placeholder="Enter referral code"
                maxLength={8}
                className="flex-1 px-4 py-3 bg-white/[0.05] border border-white/[0.12] rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 font-mono tracking-widest text-center"
              />
              <button
                onClick={handleClaimReferral}
                disabled={claiming || !claimCode.trim()}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all duration-300"
              >
                {claiming ? "Claiming..." : "Claim"}
              </button>
            </div>

            {claimSuccess && (
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-300 flex items-center gap-2">
                <Check className="w-5 h-5" />
                <span>Referral code claimed successfully!</span>
              </div>
            )}

            {claimError && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300">
                {claimError}
              </div>
            )}
          </div>
        </div>

        {/* How it Works */}
        <div className="bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] p-7">
          <h3 className="text-xl font-semibold text-white mb-6">How Referrals Work</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-5 bg-white/[0.03] rounded-xl border border-white/[0.08]">
              <div className="text-4xl mb-3">1️⃣</div>
              <h4 className="text-white font-semibold mb-2">Share Your Code</h4>
              <p className="text-sm text-white/60">
                Send your unique referral code or link to friends
              </p>
            </div>

            <div className="text-center p-5 bg-white/[0.03] rounded-xl border border-white/[0.08]">
              <div className="text-4xl mb-3">2️⃣</div>
              <h4 className="text-white font-semibold mb-2">They Sign Up</h4>
              <p className="text-sm text-white/60">
                Your friends create an account using your code
              </p>
            </div>

            <div className="text-center p-5 bg-white/[0.03] rounded-xl border border-white/[0.08]">
              <div className="text-4xl mb-3">3️⃣</div>
              <h4 className="text-white font-semibold mb-2">Everyone Benefits</h4>
              <p className="text-sm text-white/60">
                Track your referrals and grow the SpeakSharp community
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
