# Social Sharing Features

Comprehensive social sharing system for Vorex achievements, progress, and milestones.

## Components

### 1. ShareButton
Reusable button component for sharing content on multiple platforms.

**Features:**
- Twitter/X sharing
- WhatsApp sharing
- Copy to clipboard
- Native mobile share (when available)
- Three variants: `default`, `compact`, `icon`

**Usage:**
```tsx
import { ShareButton } from '@/components/social/ShareButton';

<ShareButton
  title="Achievement Title"
  text="Share text with context"
  url="https://vorex.app"
  variant="default" // or "compact" or "icon"
  onShare={(platform) => console.log(`Shared on ${platform}`)}
/>
```

### 2. ShareCard
Visual preview card for shared content with Vorex branding.

**Features:**
- Multiple card types: achievement, streak, level, session, stats
- Responsive design optimized for social media
- Vorex branding and URL
- Beautiful gradients and animations

**Usage:**
```tsx
import { ShareCard } from '@/components/social/ShareCard';

<ShareCard
  type="achievement"
  data={{
    title: "Achievement Title",
    description: "Achievement description",
    value: 100,
    tier: "gold"
  }}
  showBranding={true}
/>
```

### 3. AchievementUnlockModal
Celebration modal that appears when users unlock achievements.

**Features:**
- Animated confetti effect
- Trophy icon with tier-based styling
- Share functionality built-in
- Share preview
- Smooth animations

**Usage:**
```tsx
import { AchievementUnlockModal } from '@/components/social/AchievementUnlockModal';

<AchievementUnlockModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  achievement={{
    title: "First Steps",
    description: "Completed your first lesson!",
    points: 50,
    tier: "bronze",
    category: "milestone"
  }}
/>
```

## Utility Functions

Located in `/lib/share-utils.ts`:

### Share Text Generation
```tsx
import {
  generateAchievementShareText,
  generateStatsShareText,
  generateSessionShareText,
} from '@/lib/share-utils';

// For achievements
const achievementText = generateAchievementShareText({
  title: "Achievement",
  description: "Description",
  points: 100,
  tier: "gold",
  category: "milestone"
});

// For stats/milestones
const statsText = generateStatsShareText({
  type: 'streak',
  value: 7,
  context: 'Keep going!'
});

// For session completion
const sessionText = generateSessionShareText(8, 10, 80);
```

### Platform URLs
```tsx
import {
  createTwitterShareUrl,
  createWhatsAppShareUrl,
  copyToClipboard,
  nativeShare,
} from '@/lib/share-utils';

// Twitter share URL
const twitterUrl = createTwitterShareUrl(text, url);

// WhatsApp share URL
const whatsappUrl = createWhatsAppShareUrl(text, url);

// Copy to clipboard
const success = await copyToClipboard(text);

// Native mobile share
const shared = await nativeShare(title, text, url);
```

## Integration Points

### 1. Achievements Page (`/achievements`)
- Share icon button on each unlocked achievement
- Opens ShareModal with pre-filled achievement text
- Only visible for unlocked achievements

### 2. Progress Celebration Component
- Appears after completing practice sessions
- "Share your progress!" section with compact share button
- Shares session stats (accuracy, XP earned)

### 3. Profile Page (`/profile`)
- Share icon in Progress Stats section
- Shares overall stats (XP, level, streak)

### 4. Achievement Detail Page (`/achievements/[id]`)
- Dedicated page for each achievement
- Full share preview with ShareCard
- Prominent share button

## Open Graph Images

### Dynamic Achievement Images
Route: `/share/achievement/[id]/route.tsx`

Generates dynamic Open Graph images for shared achievements using Next.js Image Response API.

**Query Parameters:**
- `title`: Achievement title
- `description`: Achievement description
- `points`: Points earned
- `tier`: Achievement tier (platinum, gold, silver, bronze)

**Example URL:**
```
/share/achievement/abc123?title=First%20Steps&description=Completed&points=50&tier=bronze
```

## Styling

All components use Tailwind CSS with dark theme:
- Glass morphism effects
- Gradient backgrounds
- Smooth animations with Framer Motion
- Responsive design for mobile and desktop

## Best Practices

1. **Natural Sharing**: Only show share options when users achieve something meaningful
2. **Celebratory Tone**: Use positive, encouraging language
3. **Not Pushy**: Make sharing optional and easy to dismiss
4. **Mobile-First**: Use native share on mobile when available
5. **Preview**: Show users what their share will look like

## Share Text Examples

### Achievement Unlock
```
🥇 Just unlocked "7 Day Streak" on Vorex!

Completed 7 consecutive days of practice.

Mastering English with AI. Join me!
```

### Streak Milestone
```
🔥 7 day streak on Vorex! Consistency is key to mastering English.

Join me in learning:
```

### Session Completion
```
⭐ Just completed a practice session on Vorex!

✅ 8/10 correct (80%)
⚡ +80 XP earned

Mastering English one session at a time!
```

## Future Enhancements

- LinkedIn sharing
- Facebook sharing
- Instagram Stories integration
- Discord webhook sharing
- Custom share card designs
- User-generated share templates
- Share analytics and tracking
