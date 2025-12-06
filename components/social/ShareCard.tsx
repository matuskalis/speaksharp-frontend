"use client";

import { motion } from 'framer-motion';
import { Trophy, Star, Flame, Zap, Target } from 'lucide-react';

export interface ShareCardProps {
  type: 'achievement' | 'streak' | 'level' | 'session' | 'stats';
  data: {
    title?: string;
    description?: string;
    value?: number;
    streak?: number;
    level?: number;
    xp?: number;
    accuracy?: number;
    category?: string;
    tier?: string;
  };
  showBranding?: boolean;
}

export function ShareCard({ type, data, showBranding = true }: ShareCardProps) {
  return (
    <div className="relative w-full max-w-lg aspect-[1.91/1] bg-gradient-to-br from-dark via-dark-100 to-dark-200 rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-radial from-purple-500 to-transparent blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-radial from-blue-500 to-transparent blur-3xl" />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-between p-8">
        {/* Top section with logo */}
        {showBranding && (
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-purple to-accent-blue flex items-center justify-center shadow-lg">
              <span className="text-2xl font-bold text-white">V</span>
            </div>
            <div>
              <div className="text-white font-bold text-xl">Vorex</div>
              <div className="text-white/60 text-xs">AI English Tutor</div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center">
          {type === 'achievement' && (
            <AchievementContent data={data} />
          )}
          {type === 'streak' && (
            <StreakContent data={data} />
          )}
          {type === 'level' && (
            <LevelContent data={data} />
          )}
          {type === 'session' && (
            <SessionContent data={data} />
          )}
          {type === 'stats' && (
            <StatsContent data={data} />
          )}
        </div>

        {/* Bottom section with URL */}
        {showBranding && (
          <div className="flex items-center justify-between">
            <div className="text-white/40 text-sm">vorex.app</div>
            <div className="px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-white/60 text-xs">
              Join me in learning!
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AchievementContent({ data }: { data: ShareCardProps['data'] }) {
  const tierColors = {
    platinum: 'from-cyan-400 to-blue-500',
    gold: 'from-yellow-400 to-orange-500',
    silver: 'from-gray-300 to-gray-500',
    bronze: 'from-amber-600 to-amber-800',
  };

  const tierColor = tierColors[data.tier as keyof typeof tierColors] || tierColors.bronze;

  return (
    <div className="text-center">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 15 }}
        className={`w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${tierColor} flex items-center justify-center shadow-lg`}
      >
        <Trophy className="w-10 h-10 text-white" />
      </motion.div>
      <h2 className="text-2xl font-bold text-white mb-2">{data.title}</h2>
      <p className="text-white/70 text-sm mb-4 max-w-md mx-auto">{data.description}</p>
      {data.value && (
        <div className="flex items-center justify-center gap-2 text-yellow-400">
          <Star className="w-5 h-5" />
          <span className="font-bold text-lg">{data.value} points</span>
        </div>
      )}
    </div>
  );
}

function StreakContent({ data }: { data: ShareCardProps['data'] }) {
  return (
    <div className="text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 15 }}
        className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-lg"
      >
        <Flame className="w-10 h-10 text-white" />
      </motion.div>
      <div className="text-6xl font-bold text-white mb-2">{data.streak || 0}</div>
      <div className="text-xl text-white/70">Day Streak!</div>
      <p className="text-white/50 text-sm mt-2">Consistency is key to mastery</p>
    </div>
  );
}

function LevelContent({ data }: { data: ShareCardProps['data'] }) {
  return (
    <div className="text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 15 }}
        className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-lg"
      >
        <Zap className="w-10 h-10 text-white" />
      </motion.div>
      <div className="text-6xl font-bold text-white mb-2">Level {data.level || 1}</div>
      <div className="text-xl text-white/70">Unlocked!</div>
      {data.xp && (
        <p className="text-white/50 text-sm mt-2">{data.xp.toLocaleString()} XP earned</p>
      )}
    </div>
  );
}

function SessionContent({ data }: { data: ShareCardProps['data'] }) {
  const accuracy = data.accuracy || 0;
  const emoji = accuracy === 100 ? '🎉' : accuracy >= 80 ? '⭐' : '💪';

  return (
    <div className="text-center">
      <div className="text-5xl mb-4">{emoji}</div>
      <div className="text-3xl font-bold text-white mb-4">Session Complete!</div>
      <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
        <div className="bg-white/[0.05] rounded-xl p-3 border border-white/[0.08]">
          <div className="text-2xl font-bold text-green-400">{accuracy}%</div>
          <div className="text-xs text-white/60">Accuracy</div>
        </div>
        <div className="bg-white/[0.05] rounded-xl p-3 border border-white/[0.08]">
          <div className="text-2xl font-bold text-yellow-400 flex items-center justify-center gap-1">
            <Zap className="w-5 h-5" />
            {data.xp || 0}
          </div>
          <div className="text-xs text-white/60">XP Earned</div>
        </div>
      </div>
    </div>
  );
}

function StatsContent({ data }: { data: ShareCardProps['data'] }) {
  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">My Progress</h2>
        <p className="text-white/60 text-sm">Mastering English with AI</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {data.xp && (
          <div className="bg-white/[0.05] rounded-xl p-4 border border-white/[0.08]">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center mb-2">
              <Star className="w-5 h-5 text-yellow-400" />
            </div>
            <div className="text-2xl font-bold text-white">{data.xp.toLocaleString()}</div>
            <div className="text-xs text-white/60">Total XP</div>
          </div>
        )}
        {data.level && (
          <div className="bg-white/[0.05] rounded-xl p-4 border border-white/[0.08]">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center mb-2">
              <Zap className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-white">Level {data.level}</div>
            <div className="text-xs text-white/60">Current</div>
          </div>
        )}
        {data.streak && (
          <div className="bg-white/[0.05] rounded-xl p-4 border border-white/[0.08]">
            <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center mb-2">
              <Flame className="w-5 h-5 text-orange-400" />
            </div>
            <div className="text-2xl font-bold text-white">{data.streak}</div>
            <div className="text-xs text-white/60">Day Streak</div>
          </div>
        )}
        {data.value && (
          <div className="bg-white/[0.05] rounded-xl p-4 border border-white/[0.08]">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center mb-2">
              <Target className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-white">{data.value}</div>
            <div className="text-xs text-white/60">Achievements</div>
          </div>
        )}
      </div>
    </div>
  );
}
