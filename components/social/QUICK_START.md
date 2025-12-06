# Social Sharing - Quick Start Guide

## Installation
All components are already installed. Import from `/components/social/`.

## Common Use Cases

### 1. Add Share Button to Any Page
```tsx
import { ShareButton } from '@/components/social';

export default function MyPage() {
  return (
    <ShareButton
      title="My Achievement"
      text="Check out what I just did on Vorex!"
      variant="compact"
    />
  );
}
```

### 2. Show Achievement Unlock Celebration
```tsx
import { AchievementUnlockModal } from '@/components/social';
import { useState } from 'react';

export default function MyComponent() {
  const [showModal, setShowModal] = useState(false);

  return (
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
  );
}
```

### 3. Notify Streak Milestone
```tsx
import { StreakMilestoneToast } from '@/components/social';
import { useState, useEffect } from 'react';

export default function MyComponent() {
  const [showToast, setShowToast] = useState(false);
  const streak = 7; // Your streak value

  useEffect(() => {
    if (streak === 7) {
      setShowToast(true);
    }
  }, [streak]);

  return (
    <StreakMilestoneToast
      isOpen={showToast}
      onClose={() => setShowToast(false)}
      streak={streak}
      milestone={7}
    />
  );
}
```

### 4. Create Share Preview Card
```tsx
import { ShareCard } from '@/components/social';

export default function PreviewPage() {
  return (
    <ShareCard
      type="achievement"
      data={{
        title: "7 Day Streak",
        description: "Completed 7 consecutive days",
        value: 100,
        tier: "gold"
      }}
    />
  );
}
```

## Generate Share Text

```tsx
import {
  generateAchievementShareText,
  generateStatsShareText,
  generateSessionShareText,
} from '@/lib/share-utils';

// For achievements
const text1 = generateAchievementShareText({
  title: "First Steps",
  description: "Completed first lesson",
  points: 50,
  tier: "bronze",
  category: "milestone"
});

// For stats
const text2 = generateStatsShareText({
  type: 'streak',
  value: 7,
  context: 'Keep going!'
});

// For sessions
const text3 = generateSessionShareText(8, 10, 80);
```

## Button Variants

```tsx
// Large with gradient (default)
<ShareButton title="..." text="..." variant="default" />

// Medium with minimal styling
<ShareButton title="..." text="..." variant="compact" />

// Icon only (for tight spaces)
<ShareButton title="..." text="..." variant="icon" />
```

## Card Types

```tsx
// Achievement card
<ShareCard type="achievement" data={{ title, description, value, tier }} />

// Streak card
<ShareCard type="streak" data={{ streak }} />

// Level card
<ShareCard type="level" data={{ level, xp }} />

// Session stats card
<ShareCard type="session" data={{ accuracy, xp }} />

// Overall stats card
<ShareCard type="stats" data={{ xp, level, streak, value }} />
```

## Tracking Shares (Optional)

```tsx
<ShareButton
  title="..."
  text="..."
  onShare={(platform) => {
    // Add your analytics here
    console.log(`Shared on ${platform}`);
    analytics.track('share', { platform });
  }}
/>
```

## Integration Checklist

When adding sharing to a new feature:

- [ ] Import ShareButton component
- [ ] Generate appropriate share text
- [ ] Choose correct variant (default/compact/icon)
- [ ] Add onShare callback for analytics (optional)
- [ ] Test on mobile and desktop
- [ ] Verify share text looks good on Twitter/WhatsApp
- [ ] Check that native share works on mobile

## Platform Support

✅ Twitter/X
✅ WhatsApp
✅ Copy to clipboard
✅ Native mobile share
🔄 LinkedIn (URL generated, use in custom flows)
🔄 Facebook (URL generated, use in custom flows)

## Need Help?

- Full docs: `/components/social/README.md`
- Implementation guide: `/SOCIAL_SHARING_IMPLEMENTATION.md`
- Utils reference: `/lib/share-utils.ts`
