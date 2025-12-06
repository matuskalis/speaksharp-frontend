import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Extract achievement data from query parameters
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || 'Achievement Unlocked';
    const description = searchParams.get('description') || 'Completed a milestone!';
    const points = searchParams.get('points') || '100';
    const tier = searchParams.get('tier') || 'gold';

    const tierEmojis = {
      platinum: '💎',
      gold: '🥇',
      silver: '🥈',
      bronze: '🥉',
    };

    const tierGradients = {
      platinum: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
      gold: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
      silver: 'linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)',
      bronze: 'linear-gradient(135deg, #d97706 0%, #92400e 100%)',
    };

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0B0C10',
            backgroundImage:
              'radial-gradient(circle at 25% 25%, rgba(79, 70, 229, 0.2) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(236, 72, 153, 0.2) 0%, transparent 50%)',
          }}
        >
          {/* Background Grid */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0.05,
              backgroundImage:
                'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          {/* Logo and Brand */}
          <div
            style={{
              position: 'absolute',
              top: 40,
              left: 40,
              display: 'flex',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: 12,
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 32,
                fontWeight: 'bold',
                color: 'white',
              }}
            >
              V
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 28, fontWeight: 'bold', color: 'white' }}>
                Vorex
              </div>
              <div style={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.6)' }}>
                AI English Tutor
              </div>
            </div>
          </div>

          {/* Achievement Icon */}
          <div
            style={{
              width: 140,
              height: 140,
              borderRadius: 24,
              background: tierGradients[tier as keyof typeof tierGradients] || tierGradients.gold,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 32,
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
            }}
          >
            <div style={{ fontSize: 72 }}>
              {tierEmojis[tier as keyof typeof tierEmojis] || '🏆'}
            </div>
          </div>

          {/* Achievement Title */}
          <div
            style={{
              fontSize: 56,
              fontWeight: 'bold',
              color: 'white',
              marginBottom: 16,
              textAlign: 'center',
              maxWidth: 900,
              padding: '0 40px',
            }}
          >
            {title}
          </div>

          {/* Achievement Description */}
          <div
            style={{
              fontSize: 28,
              color: 'rgba(255, 255, 255, 0.7)',
              marginBottom: 32,
              textAlign: 'center',
              maxWidth: 800,
              padding: '0 40px',
            }}
          >
            {description}
          </div>

          {/* Points Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 24px',
              borderRadius: 12,
              background: 'rgba(251, 191, 36, 0.2)',
              border: '2px solid rgba(251, 191, 36, 0.3)',
            }}
          >
            <div style={{ fontSize: 24 }}>⭐</div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 'bold',
                color: '#fbbf24',
              }}
            >
              {points} points
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              position: 'absolute',
              bottom: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '0 40px',
            }}
          >
            <div style={{ fontSize: 18, color: 'rgba(255, 255, 255, 0.4)' }}>
              vorex.app
            </div>
            <div
              style={{
                fontSize: 16,
                color: 'rgba(255, 255, 255, 0.6)',
                padding: '8px 16px',
                borderRadius: 999,
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              Join me in learning!
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.error(e);
    return new Response(`Failed to generate image: ${e.message}`, {
      status: 500,
    });
  }
}
