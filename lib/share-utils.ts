/**
 * Utility functions for social sharing
 */

export interface ShareableAchievement {
  title: string;
  description: string;
  points: number;
  tier: string;
  category: string;
}

export interface ShareableStats {
  type: 'streak' | 'level' | 'xp' | 'completion';
  value: number;
  context?: string;
}

const APP_URL = 'https://vorex.app';
const APP_NAME = 'Vorex';

/**
 * Generate share text for achievements
 */
export function generateAchievementShareText(achievement: ShareableAchievement): string {
  const emoji = getAchievementEmoji(achievement);
  return `${emoji} Just unlocked "${achievement.title}" on ${APP_NAME}!\n\n${achievement.description}\n\nMastering English with AI. Join me!`;
}

/**
 * Generate share text for stats/milestones
 */
export function generateStatsShareText(stats: ShareableStats): string {
  switch (stats.type) {
    case 'streak':
      return `🔥 ${stats.value} day streak on ${APP_NAME}! Consistency is key to mastering English. ${stats.context || ''}\n\nJoin me in learning:`;
    case 'level':
      return `⚡ Just reached Level ${stats.value} on ${APP_NAME}! ${stats.context || ''}\n\nLeveling up my English skills every day:`;
    case 'xp':
      return `⭐ ${stats.value.toLocaleString()} XP earned on ${APP_NAME}! ${stats.context || ''}\n\nMastering English with AI:`;
    case 'completion':
      return `✅ ${stats.value}% complete! ${stats.context || ''}\n\nMaking real progress on ${APP_NAME}:`;
    default:
      return `📚 Making progress on ${APP_NAME}! Join me in mastering English:`;
  }
}

/**
 * Generate share text for session completion
 */
export function generateSessionShareText(
  correctCount: number,
  totalQuestions: number,
  xpEarned: number
): string {
  const accuracy = Math.round((correctCount / totalQuestions) * 100);
  const emoji = accuracy === 100 ? '🎉' : accuracy >= 80 ? '⭐' : '💪';

  return `${emoji} Just completed a practice session on ${APP_NAME}!\n\n✅ ${correctCount}/${totalQuestions} correct (${accuracy}%)\n⚡ +${xpEarned} XP earned\n\nMastering English one session at a time!`;
}

/**
 * Get emoji for achievement based on category and tier
 */
function getAchievementEmoji(achievement: ShareableAchievement): string {
  // Tier-based emojis
  if (achievement.tier === 'platinum') return '💎';
  if (achievement.tier === 'gold') return '🥇';
  if (achievement.tier === 'silver') return '🥈';
  if (achievement.tier === 'bronze') return '🥉';

  // Category-based emojis
  if (achievement.category === 'streak') return '🔥';
  if (achievement.category === 'milestone') return '🎯';
  if (achievement.category === 'mastery') return '🏆';
  if (achievement.category === 'social') return '🤝';

  return '🏆';
}

/**
 * Create Twitter/X share URL
 */
export function createTwitterShareUrl(text: string, url: string = APP_URL): string {
  const params = new URLSearchParams({
    text: text,
    url: url,
    via: 'vorexapp', // Replace with actual Twitter handle
  });
  return `https://twitter.com/intent/tweet?${params.toString()}`;
}

/**
 * Create WhatsApp share URL
 */
export function createWhatsAppShareUrl(text: string, url: string = APP_URL): string {
  const message = `${text}\n\n${url}`;
  const params = new URLSearchParams({
    text: message,
  });
  return `https://wa.me/?${params.toString()}`;
}

/**
 * Create LinkedIn share URL
 */
export function createLinkedInShareUrl(url: string = APP_URL): string {
  const params = new URLSearchParams({
    url: url,
  });
  return `https://www.linkedin.com/sharing/share-offsite/?${params.toString()}`;
}

/**
 * Create Facebook share URL
 */
export function createFacebookShareUrl(url: string = APP_URL): string {
  const params = new URLSearchParams({
    u: url,
  });
  return `https://www.facebook.com/sharer/sharer.php?${params.toString()}`;
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const result = document.execCommand('copy');
      textArea.remove();
      return result;
    }
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    return false;
  }
}

/**
 * Check if native share is available
 */
export function isNativeShareAvailable(): boolean {
  return typeof navigator !== 'undefined' && 'share' in navigator;
}

/**
 * Native share (mobile)
 */
export async function nativeShare(
  title: string,
  text: string,
  url: string = APP_URL
): Promise<boolean> {
  if (!isNativeShareAvailable()) {
    return false;
  }

  try {
    await navigator.share({
      title,
      text,
      url,
    });
    return true;
  } catch (err) {
    // User cancelled or error occurred
    console.error('Native share failed:', err);
    return false;
  }
}

/**
 * Format achievement for sharing
 */
export function formatAchievementForShare(achievement: any): ShareableAchievement {
  return {
    title: achievement.title,
    description: achievement.description,
    points: achievement.points,
    tier: achievement.tier || 'bronze',
    category: achievement.category || 'milestone',
  };
}

/**
 * Generate shareable link for achievement
 */
export function generateAchievementShareLink(achievementId: string): string {
  return `${APP_URL}/achievements?highlight=${achievementId}`;
}

/**
 * Generate shareable link for profile
 */
export function generateProfileShareLink(userId?: string): string {
  return userId ? `${APP_URL}/profile/${userId}` : `${APP_URL}`;
}
