"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AppShell } from "@/components/app-shell";
import { apiClient } from "@/lib/api-client";
import { Achievement } from "@/lib/types";
import { Trophy, Star, ArrowLeft, Calendar } from "lucide-react";
import { ShareButton } from "@/components/social/ShareButton";
import { ShareCard } from "@/components/social/ShareCard";
import { generateAchievementShareText, formatAchievementForShare } from "@/lib/share-utils";

export default function AchievementDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [achievement, setAchievement] = useState<Achievement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAchievement = async () => {
      try {
        setLoading(true);
        // Fetch achievement details
        const myAchievements = await apiClient.getMyAchievements();
        const found = myAchievements.achievements.find(
          (a) => a.achievement_id === params.id
        );

        if (found) {
          setAchievement(found);
        } else {
          setError("Achievement not found");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load achievement");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchAchievement();
    }
  }, [params.id]);

  if (loading) {
    return (
      <AppShell>
        <div className="max-w-4xl mx-auto p-6 text-center">
          <div className="text-white/60">Loading achievement...</div>
        </div>
      </AppShell>
    );
  }

  if (error || !achievement) {
    return (
      <AppShell>
        <div className="max-w-4xl mx-auto p-6">
          <div className="p-5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 backdrop-blur-sm">
            {error || "Achievement not found"}
          </div>
          <button
            onClick={() => router.push("/achievements")}
            className="mt-4 flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Achievements
          </button>
        </div>
      </AppShell>
    );
  }

  const tierColors = {
    platinum: 'from-cyan-400 to-blue-500',
    gold: 'from-yellow-400 to-orange-500',
    silver: 'from-gray-300 to-gray-500',
    bronze: 'from-amber-600 to-amber-800',
  };

  const tierColor = tierColors[achievement.tier as keyof typeof tierColors] || tierColors.bronze;

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Back Button */}
        <button
          onClick={() => router.push("/achievements")}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Achievements
        </button>

        {/* Achievement Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] p-8 text-center"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", damping: 15 }}
            className={`w-32 h-32 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${tierColor} flex items-center justify-center shadow-lg`}
          >
            <Trophy className="w-16 h-16 text-white" />
          </motion.div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-white mb-3">{achievement.title}</h1>

          {/* Description */}
          <p className="text-lg text-white/70 mb-6 max-w-2xl mx-auto">
            {achievement.description}
          </p>

          {/* Tier and Points */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="px-4 py-2 rounded-lg bg-white/[0.05] border border-white/[0.08]">
              <span className="text-sm text-white/60">Tier:</span>
              <span className="ml-2 font-semibold text-white capitalize">
                {achievement.tier}
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-500/20 border border-yellow-500/30">
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="font-bold text-yellow-400">{achievement.points} points</span>
            </div>
          </div>

          {/* Unlock Date */}
          {achievement.unlocked_at && (
            <div className="flex items-center justify-center gap-2 text-white/50 text-sm mb-6">
              <Calendar className="w-4 h-4" />
              <span>
                Unlocked on {new Date(achievement.unlocked_at).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>
          )}

          {/* Share Button */}
          <ShareButton
            title={achievement.title}
            text={generateAchievementShareText(formatAchievementForShare(achievement))}
            variant="default"
            onShare={(platform) => {
              console.log(`Shared achievement on ${platform}`);
            }}
          />
        </motion.div>

        {/* Share Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] p-8"
        >
          <h2 className="text-xl font-bold text-white mb-4">Share Preview</h2>
          <p className="text-white/60 text-sm mb-6">
            This is how your achievement will look when shared on social media:
          </p>
          <div className="flex justify-center">
            <ShareCard
              type="achievement"
              data={{
                title: achievement.title,
                description: achievement.description,
                value: achievement.points,
                tier: achievement.tier,
                category: achievement.category,
              }}
            />
          </div>
        </motion.div>
      </div>
    </AppShell>
  );
}
