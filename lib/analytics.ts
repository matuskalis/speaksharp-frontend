/**
 * Analytics and event tracking utilities
 *
 * Tracks user interactions, conversions, and errors
 * Can be integrated with Google Analytics, Mixpanel, PostHog, etc.
 */

export type AnalyticsEvent =
  // Landing page events
  | "landing_page_view"
  | "demo_submitted"
  | "demo_success"
  | "demo_error"
  | "cta_clicked"
  | "pricing_viewed"

  // Assessment events
  | "assessment_started"
  | "assessment_question_answered"
  | "assessment_completed"
  | "assessment_abandoned"

  // User flow events
  | "signup_started"
  | "signup_completed"
  | "onboarding_started"
  | "onboarding_completed"
  | "trial_started"

  // Learning events
  | "lesson_started"
  | "lesson_completed"
  | "practice_started"
  | "practice_completed"
  | "voice_session_started"
  | "voice_session_completed"

  // Engagement events
  | "daily_goal_completed"
  | "streak_milestone"
  | "achievement_unlocked"

  // Error events
  | "api_error"
  | "page_error"
  | "auth_error";

interface EventProperties {
  [key: string]: string | number | boolean | undefined;
}

class Analytics {
  private enabled: boolean;
  private debugMode: boolean;

  constructor() {
    this.enabled = typeof window !== "undefined";
    this.debugMode = process.env.NODE_ENV === "development";
  }

  /**
   * Track a custom event
   */
  track(event: AnalyticsEvent, properties?: EventProperties): void {
    if (!this.enabled) return;

    const eventData = {
      event,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      ...properties,
    };

    // Log in development
    if (this.debugMode) {
      console.log("📊 Analytics Event:", eventData);
    }

    // Send to analytics services
    this.sendToGoogleAnalytics(event, properties);
    this.sendToDataLayer(event, properties);
  }

  /**
   * Track page view
   */
  page(pageName?: string): void {
    if (!this.enabled) return;

    const pageData = {
      page: pageName || window.location.pathname,
      title: document.title,
      url: window.location.href,
      referrer: document.referrer,
    };

    if (this.debugMode) {
      console.log("📄 Page View:", pageData);
    }

    // Send to Google Analytics
    if (typeof window.gtag !== "undefined") {
      window.gtag("event", "page_view", pageData);
    }
  }

  /**
   * Identify user
   */
  identify(userId: string, traits?: EventProperties): void {
    if (!this.enabled) return;

    if (this.debugMode) {
      console.log("👤 User Identified:", { userId, ...traits });
    }

    // Set user properties in Google Analytics
    if (typeof window.gtag !== "undefined") {
      window.gtag("set", "user_properties", {
        user_id: userId,
        ...traits,
      });
    }
  }

  /**
   * Track conversion/goal
   */
  conversion(conversionName: string, value?: number): void {
    if (!this.enabled) return;

    this.track(conversionName as AnalyticsEvent, {
      conversion: true,
      value: value,
    });

    // Send to Google Analytics as conversion
    if (typeof window.gtag !== "undefined") {
      window.gtag("event", "conversion", {
        send_to: conversionName,
        value: value,
      });
    }
  }

  /**
   * Track error
   */
  error(errorName: string, errorDetails?: EventProperties): void {
    if (!this.enabled) return;

    const errorData = {
      error: errorName,
      ...errorDetails,
    };

    if (this.debugMode) {
      console.error("❌ Error Tracked:", errorData);
    }

    this.track("api_error", errorData);
  }

  /**
   * Track timing/performance
   */
  timing(category: string, name: string, duration: number): void {
    if (!this.enabled) return;

    if (this.debugMode) {
      console.log(`⏱️ Timing: ${category}.${name} = ${duration}ms`);
    }

    if (typeof window.gtag !== "undefined") {
      window.gtag("event", "timing_complete", {
        name: name,
        value: duration,
        event_category: category,
      });
    }
  }

  /**
   * Send to Google Analytics
   */
  private sendToGoogleAnalytics(event: string, properties?: EventProperties): void {
    if (typeof window.gtag !== "undefined") {
      window.gtag("event", event, properties);
    }
  }

  /**
   * Send to data layer (for GTM)
   */
  private sendToDataLayer(event: string, properties?: EventProperties): void {
    if (typeof window.dataLayer !== "undefined") {
      window.dataLayer.push({
        event,
        ...properties,
      });
    }
  }

  /**
   * Track user session timing
   */
  startSession(): void {
    if (!this.enabled) return;

    const sessionStart = Date.now();
    sessionStorage.setItem("session_start", sessionStart.toString());

    this.track("landing_page_view");
  }

  /**
   * End session and calculate duration
   */
  endSession(): void {
    if (!this.enabled) return;

    const sessionStart = sessionStorage.getItem("session_start");
    if (sessionStart) {
      const duration = Date.now() - parseInt(sessionStart);
      this.timing("session", "duration", duration);
      sessionStorage.removeItem("session_start");
    }
  }
}

// Export singleton instance
export const analytics = new Analytics();

// Type definitions for window
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}
