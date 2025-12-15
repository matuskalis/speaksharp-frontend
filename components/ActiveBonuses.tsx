"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Sparkles, Calendar, Gift, Zap, Star, X } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { cn } from "@/lib/utils";

interface BonusSummary {
  total_bonus_xp_today: number;
  bonuses_claimed: Array<{
    type: string;
    xp: number;
    multiplier: number;
  }>;
  available_bonuses: {
    login_bonus: { available: boolean; xp: number };
    streak_bonus: { active: boolean; multiplier: number; streak_days: number };
    weekend_bonus: { active: boolean; multiplier: number };
    event_bonus: { active: boolean; name: string | null; multiplier: number };
  };
  current_multiplier: number;
}

export function ActiveBonuses() {
  const [bonuses, setBonuses] = useState<BonusSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [claimingLogin, setClaimingLogin] = useState(false);

  useEffect(() => {
    loadBonuses();
  }, []);

  const loadBonuses = async () => {
    try {
      const data = await apiClient.getBonusSummary();
      setBonuses(data);
    } catch (error) {
      console.error("Failed to load bonuses:", error);
    } finally {
      setLoading(false);
    }
  };

  const claimLoginBonus = async () => {
    if (!bonuses?.available_bonuses.login_bonus.available) return;

    setClaimingLogin(true);
    try {
      const result = await apiClient.claimLoginBonus();
      if (result.success) {
        // Reload bonuses
        await loadBonuses();
      }
    } catch (error) {
      console.error("Failed to claim login bonus:", error);
    } finally {
      setClaimingLogin(false);
    }
  };

  if (loading || !bonuses) return null;

  const hasActiveBonuses =
    bonuses.available_bonuses.streak_bonus.active ||
    bonuses.available_bonuses.weekend_bonus.active ||
    bonuses.available_bonuses.event_bonus.active ||
    bonuses.available_bonuses.login_bonus.available;

  if (!hasActiveBonuses && bonuses.current_multiplier <= 1.0) return null;

  return (
    <>
      {/* Compact Badge */}
      <motion.button
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={() => setShowDetails(true)}
        className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-xl border border-amber-500/30 hover:border-amber-500/50 transition-colors"
      >
        <Zap className="w-4 h-4 text-amber-400" />
        <span className="text-sm font-medium text-amber-300">
          {bonuses.current_multiplier > 1 ? `${bonuses.current_multiplier}x XP` : "Bonuses Active"}
        </span>
        {bonuses.available_bonuses.login_bonus.available && (
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
          </span>
        )}
      </motion.button>

      {/* Details Modal */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-dark-100 rounded-2xl border border-white/[0.08] overflow-hidden"
            >
              {/* Header */}
              <div className="relative p-6 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-b border-white/[0.08]">
                <button
                  onClick={() => setShowDetails(false)}
                  className="absolute right-4 top-4 p-1 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-white/50" />
                </button>

                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/30 to-orange-500/30 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Active Bonuses</h3>
                    <p className="text-sm text-white/60">Your current XP multipliers</p>
                  </div>
                </div>

                {bonuses.current_multiplier > 1 && (
                  <div className="mt-4 p-3 bg-amber-500/20 rounded-xl border border-amber-500/30">
                    <div className="flex items-center justify-between">
                      <span className="text-amber-300 font-medium">Total Multiplier</span>
                      <span className="text-2xl font-bold text-amber-400">
                        {bonuses.current_multiplier}x XP
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Bonuses List */}
              <div className="p-4 space-y-3">
                {/* Login Bonus */}
                {bonuses.available_bonuses.login_bonus.available && (
                  <motion.div
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/30"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                          <Gift className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                          <p className="font-medium text-white">Daily Login Bonus</p>
                          <p className="text-sm text-white/50">
                            +{bonuses.available_bonuses.login_bonus.xp} XP available
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={claimLoginBonus}
                        disabled={claimingLogin}
                        className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 disabled:opacity-50 transition-colors"
                      >
                        {claimingLogin ? "..." : "Claim"}
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Streak Bonus */}
                {bonuses.available_bonuses.streak_bonus.active && (
                  <BonusCard
                    icon={<Flame className="w-5 h-5 text-orange-400" />}
                    title="Streak Bonus"
                    subtitle={`${bonuses.available_bonuses.streak_bonus.streak_days} day streak`}
                    multiplier={bonuses.available_bonuses.streak_bonus.multiplier}
                    color="orange"
                  />
                )}

                {/* Weekend Bonus */}
                {bonuses.available_bonuses.weekend_bonus.active && (
                  <BonusCard
                    icon={<Calendar className="w-5 h-5 text-purple-400" />}
                    title="Weekend Bonus"
                    subtitle="Extra XP on weekends"
                    multiplier={bonuses.available_bonuses.weekend_bonus.multiplier}
                    color="purple"
                  />
                )}

                {/* Event Bonus */}
                {bonuses.available_bonuses.event_bonus.active && (
                  <BonusCard
                    icon={<Star className="w-5 h-5 text-pink-400" />}
                    title={bonuses.available_bonuses.event_bonus.name || "Special Event"}
                    subtitle="Limited time bonus"
                    multiplier={bonuses.available_bonuses.event_bonus.multiplier}
                    color="pink"
                  />
                )}

                {/* Today's bonus XP */}
                {bonuses.total_bonus_xp_today > 0 && (
                  <div className="pt-3 border-t border-white/[0.08]">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/50">Bonus XP earned today</span>
                      <span className="font-semibold text-amber-400">
                        +{bonuses.total_bonus_xp_today} XP
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

interface BonusCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  multiplier: number;
  color: "orange" | "purple" | "pink" | "emerald";
}

function BonusCard({ icon, title, subtitle, multiplier, color }: BonusCardProps) {
  const colorClasses = {
    orange: "bg-orange-500/10 border-orange-500/30",
    purple: "bg-purple-500/10 border-purple-500/30",
    pink: "bg-pink-500/10 border-pink-500/30",
    emerald: "bg-emerald-500/10 border-emerald-500/30",
  };

  const iconBgClasses = {
    orange: "bg-orange-500/20",
    purple: "bg-purple-500/20",
    pink: "bg-pink-500/20",
    emerald: "bg-emerald-500/20",
  };

  const multiplierClasses = {
    orange: "text-orange-400",
    purple: "text-purple-400",
    pink: "text-pink-400",
    emerald: "text-emerald-400",
  };

  return (
    <motion.div
      initial={{ x: -10, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={cn("p-4 rounded-xl border", colorClasses[color])}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", iconBgClasses[color])}>
            {icon}
          </div>
          <div>
            <p className="font-medium text-white">{title}</p>
            <p className="text-sm text-white/50">{subtitle}</p>
          </div>
        </div>
        <span className={cn("text-xl font-bold", multiplierClasses[color])}>
          {multiplier}x
        </span>
      </div>
    </motion.div>
  );
}
