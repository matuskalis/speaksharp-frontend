/**
 * API client for SpeakSharp Core backend.
 *
 * Provides typed fetch wrappers for all API endpoints.
 * Automatically includes JWT token from Supabase session.
 */

import {
  TutorTextRequest,
  TutorTextResponse,
  CreateUserRequest,
  UserProfileResponse,
  HealthResponse,
  ApiError,
  SRSDueResponse,
  SRSReviewRequest,
  SRSReviewResponse,
  UpdateProfileRequest,
  VoiceTutorResponse,
  LessonsListResponse,
  LessonDetail,
  LessonTaskSubmitRequest,
  LessonTaskSubmitResponse,
  ErrorStatsResponse,
  SrsStatsResponse,
  WeakSkillsResponse,
  ScenariosListResponse,
  ScenarioDetail,
  ScenarioRespondRequest,
  ScenarioRespondResponse,
  MonologuePromptsResponse,
  JournalPromptsResponse,
  MonologueSubmitRequest,
  JournalSubmitRequest,
  DrillSubmitResponse,
  PlacementTestQuestionsResponse,
  PlacementTestSubmitRequest,
  PlacementTestResult,
  AdaptiveTestStartResponse,
  AdaptiveTestAnswerRequest,
  AdaptiveTestAnswerResponse,
  StreakResponse,
  AchievementsResponse,
  DailyGoal,
  UpdateGoalTargetsRequest,
  ReferralCode,
  ReferralStats,
  ClaimReferralRequest,
  LearningDashboardResponse,
  ExerciseSessionResponse,
  ExerciseSubmitRequest,
  ExerciseSubmitResponse,
  CreateCheckoutSessionRequest,
  CheckoutSessionResponse,
  PortalSessionRequest,
  PortalSessionResponse,
  SubscriptionStatusResponse,
  CancelSubscriptionRequest,
  LeaderboardResponse,
  NotificationsResponse,
  UnreadCountResponse,
  MarkNotificationReadResponse,
  MarkAllReadResponse,
  VoicePreferences,
  UpdateVoicePreferencesRequest,
  DailyChallenge,
  ChallengeHistoryRecord,
  LearningPathUnitsResponse,
  LearningPathUnitDetailResponse,
  LearningPathLessonResponse,
  CompleteLessonRequest,
  CompleteLessonResponse,
  NextLessonResponse,
  DiagnosticStartResponse,
  DiagnosticAnswerRequest,
  DiagnosticAnswerResponse,
  GuidedLearningResponse,
  ProgressSummaryResponse,
  DiagnosticStatusResponse,
  ThinkStartResponse,
  ThinkRespondRequest,
  ThinkRespondResponse,
  ThinkEndResponse,
  ThinkingSession,
} from "./types";
import { supabase } from "./supabase-client";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async getAuthHeaders(): Promise<Record<string, string>> {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.access_token) {
      return {
        Authorization: `Bearer ${session.access_token}`,
      };
    }

    return {};
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    // Get auth headers
    const authHeaders = await this.getAuthHeaders();

    const config: RequestInit = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
        ...options?.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const error: ApiError = await response.json().catch(() => ({
          detail: `HTTP ${response.status}: ${response.statusText}`,
        }));
        throw new Error(error.detail || `Request failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Network error - please check your connection");
    }
  }

  // Health check
  async health(): Promise<HealthResponse> {
    return this.request<HealthResponse>("/health");
  }

  // User endpoints
  async createUser(data: CreateUserRequest): Promise<UserProfileResponse> {
    return this.request<UserProfileResponse>("/api/users", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getUser(userId: string): Promise<UserProfileResponse> {
    return this.request<UserProfileResponse>(`/api/users/${userId}`);
  }

  async getCurrentUser(): Promise<UserProfileResponse> {
    return this.request<UserProfileResponse>("/api/users/me");
  }

  async updateProfile(data: UpdateProfileRequest): Promise<UserProfileResponse> {
    return this.request<UserProfileResponse>("/api/users/me/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async updateVoicePreferences(data: UpdateVoicePreferencesRequest): Promise<VoicePreferences> {
    return this.request<VoicePreferences>("/api/users/me/voice-preferences", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async getVoicePreferences(): Promise<VoicePreferences> {
    return this.request<VoicePreferences>("/api/users/me/voice-preferences");
  }

  // Tutor endpoints
  async submitText(data: TutorTextRequest): Promise<TutorTextResponse> {
    return this.request<TutorTextResponse>("/api/tutor/text", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async tutorVoice(formData: FormData): Promise<VoiceTutorResponse> {
    const url = `${this.baseUrl}/api/tutor/voice`;

    // Get auth headers
    const authHeaders = await this.getAuthHeaders();

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          ...authHeaders,
          // Don't set Content-Type - let browser set it with boundary for multipart/form-data
        },
        body: formData,
      });

      if (!response.ok) {
        const error: ApiError = await response.json().catch(() => ({
          detail: `HTTP ${response.status}: ${response.statusText}`,
        }));
        throw new Error(error.detail || `Request failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Network error - please check your connection");
    }
  }

  // SRS endpoints (user ID from JWT token)
  async getDueCards(limit: number = 20): Promise<SRSDueResponse> {
    return this.request<SRSDueResponse>(`/api/srs/due?limit=${limit}`);
  }

  async reviewCard(data: SRSReviewRequest): Promise<SRSReviewResponse> {
    return this.request<SRSReviewResponse>("/api/srs/review", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Lessons endpoints
  async getLessons(): Promise<LessonsListResponse> {
    return this.request<LessonsListResponse>("/api/lessons");
  }

  async getLesson(lessonId: string): Promise<LessonDetail> {
    return this.request<LessonDetail>(`/api/lessons/${lessonId}`);
  }

  async submitLessonTask(
    lessonId: string,
    data: LessonTaskSubmitRequest
  ): Promise<LessonTaskSubmitResponse> {
    return this.request<LessonTaskSubmitResponse>(`/api/lessons/${lessonId}/submit`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Stats & Analytics endpoints
  async getErrorStats(): Promise<ErrorStatsResponse> {
    return this.request<ErrorStatsResponse>("/api/stats/errors");
  }

  async getSrsStats(): Promise<SrsStatsResponse> {
    return this.request<SrsStatsResponse>("/api/stats/srs");
  }

  async getWeakSkills(limit: number = 3): Promise<WeakSkillsResponse> {
    return this.request<WeakSkillsResponse>(`/api/skills/weakest?limit=${limit}`);
  }

  async getStreak(): Promise<StreakResponse> {
    return this.request<StreakResponse>("/api/streaks/current");
  }

  async recordActivity(): Promise<StreakResponse> {
    return this.request<StreakResponse>("/api/streaks/record-activity", {
      method: "POST",
    });
  }

  // Achievements endpoints
  async getAchievements(): Promise<AchievementsResponse> {
    return this.request<AchievementsResponse>("/api/achievements");
  }

  async getMyAchievements(): Promise<AchievementsResponse> {
    return this.request<AchievementsResponse>("/api/achievements/mine");
  }

  // Daily Goals endpoints
  async getTodayGoal(): Promise<DailyGoal> {
    return this.request<DailyGoal>("/api/goals/today");
  }

  async updateTodayGoal(targets: UpdateGoalTargetsRequest): Promise<DailyGoal> {
    return this.request<DailyGoal>("/api/goals/today", {
      method: "POST",
      body: JSON.stringify(targets),
    });
  }

  // Referrals endpoints
  async getMyReferralCode(): Promise<ReferralCode> {
    return this.request<ReferralCode>("/api/referrals/my-code");
  }

  async getReferralStats(): Promise<ReferralStats> {
    return this.request<ReferralStats>("/api/referrals/stats");
  }

  async claimReferral(data: ClaimReferralRequest): Promise<{status: string; message: string}> {
    return this.request<{status: string; message: string}>("/api/referrals/claim", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Scenarios endpoints
  async getScenarios(): Promise<ScenariosListResponse> {
    return this.request<ScenariosListResponse>("/api/scenarios");
  }

  async getScenario(scenarioId: string): Promise<ScenarioDetail> {
    return this.request<ScenarioDetail>(`/api/scenarios/${scenarioId}`);
  }

  async submitScenarioResponse(
    scenarioId: string,
    data: ScenarioRespondRequest
  ): Promise<ScenarioRespondResponse> {
    return this.request<ScenarioRespondResponse>(`/api/scenarios/${scenarioId}/respond`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Drills endpoints
  async getMonologuePrompts(): Promise<MonologuePromptsResponse> {
    return this.request<MonologuePromptsResponse>("/api/drills/monologue");
  }

  async submitMonologue(data: MonologueSubmitRequest): Promise<DrillSubmitResponse> {
    return this.request<DrillSubmitResponse>("/api/drills/monologue/submit", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getJournalPrompts(): Promise<JournalPromptsResponse> {
    return this.request<JournalPromptsResponse>("/api/drills/journal");
  }

  async submitJournal(data: JournalSubmitRequest): Promise<DrillSubmitResponse> {
    return this.request<DrillSubmitResponse>("/api/drills/journal/submit", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Placement Test endpoints
  async getPlacementTestQuestions(): Promise<PlacementTestQuestionsResponse> {
    return this.request<PlacementTestQuestionsResponse>("/api/placement-test/questions");
  }

  async submitPlacementTest(data: PlacementTestSubmitRequest): Promise<PlacementTestResult> {
    return this.request<PlacementTestResult>("/api/placement-test/submit", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Adaptive Placement Test endpoints
  async startAdaptivePlacementTest(): Promise<AdaptiveTestStartResponse> {
    return this.request<AdaptiveTestStartResponse>("/api/placement-test/adaptive/start", {
      method: "POST",
    });
  }

  async submitAdaptiveAnswer(data: AdaptiveTestAnswerRequest): Promise<AdaptiveTestAnswerResponse> {
    return this.request<AdaptiveTestAnswerResponse>("/api/placement-test/adaptive/answer", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getLearningDashboard(): Promise<LearningDashboardResponse> {
    return this.request<LearningDashboardResponse>("/api/learning/dashboard");
  }

  // Exercise endpoints
  async getExerciseSession(
    count: number = 5,
    level?: string,
    skill?: string,
    exerciseType?: string
  ): Promise<ExerciseSessionResponse> {
    const params = new URLSearchParams();
    params.set("count", count.toString());
    if (level) params.set("level", level);
    if (skill) params.set("skill", skill);
    if (exerciseType) params.set("exercise_type", exerciseType);

    return this.request<ExerciseSessionResponse>(`/api/exercises/session?${params.toString()}`);
  }

  async submitExercise(data: ExerciseSubmitRequest): Promise<ExerciseSubmitResponse> {
    return this.request<ExerciseSubmitResponse>("/api/exercises/submit", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Leaderboard endpoints
  async getWeeklyLeaderboard(limit: number = 50): Promise<LeaderboardResponse> {
    return this.request<LeaderboardResponse>(`/api/leaderboard/weekly?limit=${limit}`);
  }

  async getMonthlyLeaderboard(limit: number = 50): Promise<LeaderboardResponse> {
    return this.request<LeaderboardResponse>(`/api/leaderboard/monthly?limit=${limit}`);
  }

  async getAllTimeLeaderboard(limit: number = 50): Promise<LeaderboardResponse> {
    return this.request<LeaderboardResponse>(`/api/leaderboard/alltime?limit=${limit}`);
  }

  async getStreakLeaderboard(limit: number = 50): Promise<LeaderboardResponse> {
    return this.request<LeaderboardResponse>(`/api/leaderboard/streaks?limit=${limit}`);
  }

  // Payment endpoints
  async createCheckoutSession(data: CreateCheckoutSessionRequest): Promise<CheckoutSessionResponse> {
    return this.request<CheckoutSessionResponse>("/api/payments/create-checkout-session", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getSubscription(): Promise<SubscriptionStatusResponse> {
    return this.request<SubscriptionStatusResponse>("/api/payments/subscription");
  }

  async cancelSubscription(data: CancelSubscriptionRequest): Promise<{status: string; message: string}> {
    return this.request<{status: string; message: string}>("/api/payments/cancel", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async createPortalSession(data: PortalSessionRequest): Promise<PortalSessionResponse> {
    return this.request<PortalSessionResponse>("/api/payments/create-portal-session", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Notification endpoints
  async getNotifications(
    limit: number = 20,
    offset: number = 0,
    unreadOnly: boolean = false
  ): Promise<NotificationsResponse> {
    const params = new URLSearchParams();
    params.set("limit", limit.toString());
    params.set("offset", offset.toString());
    params.set("unread_only", unreadOnly.toString());

    return this.request<NotificationsResponse>(`/api/notifications?${params.toString()}`);
  }

  async markNotificationAsRead(notificationId: string): Promise<MarkNotificationReadResponse> {
    return this.request<MarkNotificationReadResponse>(`/api/notifications/${notificationId}/read`, {
      method: "POST",
    });
  }

  async markAllNotificationsAsRead(): Promise<MarkAllReadResponse> {
    return this.request<MarkAllReadResponse>("/api/notifications/read-all", {
      method: "POST",
    });
  }

  async getUnreadNotificationCount(): Promise<UnreadCountResponse> {
    return this.request<UnreadCountResponse>("/api/notifications/unread-count");
  }

  // Daily Challenge endpoints
  async getTodayChallenge(): Promise<{
    challenge: DailyChallenge;
    progress: number;
    completed: boolean;
    completed_at?: string;
    seconds_until_reset: number;
  }> {
    return this.request("/api/challenges/today");
  }

  async completeChallenge(): Promise<{
    success: boolean;
    message: string;
    reward_xp?: number;
    completed_at?: string;
    already_completed: boolean;
  }> {
    return this.request("/api/challenges/complete", {
      method: "POST",
    });
  }

  async getChallengeHistory(limit: number = 30): Promise<{
    history: ChallengeHistoryRecord[];
    current_streak: number;
    total_completed: number;
  }> {
    return this.request(`/api/challenges/history?limit=${limit}`);
  }

  async updateChallengeProgress(
    challengeType: string,
    progress: number
  ): Promise<{
    progress: number;
    goal: number;
    completed: boolean;
    challenge: DailyChallenge;
  }> {
    return this.request("/api/challenges/update-progress", {
      method: "POST",
      body: JSON.stringify({
        challenge_type: challengeType,
        progress,
      }),
    });
  }

  // Learning Path endpoints
  async getLearningPathUnits(): Promise<LearningPathUnitsResponse> {
    return this.request<LearningPathUnitsResponse>("/api/learning-path/units");
  }

  async getLearningPathUnit(unitId: string): Promise<LearningPathUnitDetailResponse> {
    return this.request<LearningPathUnitDetailResponse>(`/api/learning-path/units/${unitId}`);
  }

  async getLearningPathLesson(lessonId: string): Promise<LearningPathLessonResponse> {
    return this.request<LearningPathLessonResponse>(`/api/learning-path/lessons/${lessonId}`);
  }

  async completeLearningPathLesson(
    lessonId: string,
    data: CompleteLessonRequest
  ): Promise<CompleteLessonResponse> {
    return this.request<CompleteLessonResponse>(`/api/learning-path/lessons/${lessonId}/complete`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getNextLesson(): Promise<NextLessonResponse> {
    return this.request<NextLessonResponse>("/api/learning-path/next-lesson");
  }

  async seedLearningPath(): Promise<{ status: string; message: string }> {
    return this.request<{ status: string; message: string }>("/api/learning-path/seed", {
      method: "POST",
    });
  }

  // Diagnostic Test endpoints
  async startDiagnostic(): Promise<DiagnosticStartResponse> {
    return this.request<DiagnosticStartResponse>("/api/diagnostic/start");
  }

  async submitDiagnosticAnswer(data: DiagnosticAnswerRequest): Promise<DiagnosticAnswerResponse> {
    return this.request<DiagnosticAnswerResponse>("/api/diagnostic/answer", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Guided Mode endpoints
  async getGuidedLearning(): Promise<GuidedLearningResponse> {
    return this.request<GuidedLearningResponse>("/api/learn/guided");
  }

  async getProgressSummary(): Promise<ProgressSummaryResponse> {
    return this.request<ProgressSummaryResponse>("/api/progress/summary");
  }

  async getDiagnosticStatus(): Promise<DiagnosticStatusResponse> {
    return this.request<DiagnosticStatusResponse>("/api/user/diagnostic-status");
  }

  // Think (Thinking in English) endpoints
  async startThinkingSession(): Promise<ThinkStartResponse> {
    return this.request<ThinkStartResponse>("/api/think/start", {
      method: "POST",
    });
  }

  async respondThinkingSession(data: ThinkRespondRequest): Promise<ThinkRespondResponse> {
    return this.request<ThinkRespondResponse>("/api/think/respond", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async endThinkingSession(sessionId: string): Promise<ThinkEndResponse> {
    return this.request<ThinkEndResponse>("/api/think/end", {
      method: "POST",
      body: JSON.stringify({ session_id: sessionId }),
    });
  }

  async getThinkingSession(sessionId: string): Promise<ThinkingSession> {
    return this.request<ThinkingSession>(`/api/think/session/${sessionId}`);
  }

  // ============================================================================
  // Analytics & XP Tracking endpoints
  // ============================================================================

  /**
   * Record XP earned from an activity.
   * @param activityType - Type of activity (exercise, lesson, drill, voice, review)
   * @param xpEarned - Base XP earned
   * @param bonusXp - Bonus XP (streak, challenge, etc.)
   * @param sessionId - Optional session ID to associate with
   */
  async recordXP(
    activityType: string,
    xpEarned: number,
    bonusXp: number = 0,
    sessionId?: string
  ): Promise<{ status: string; total_xp: number; xp_added: number }> {
    return this.request("/api/xp/record", {
      method: "POST",
      body: JSON.stringify({
        activity_type: activityType,
        xp_earned: xpEarned,
        bonus_xp: bonusXp,
        session_id: sessionId,
      }),
    });
  }

  /**
   * Track study session time.
   * @param activityType - Type of activity (lesson, drill, voice, review, exercise)
   * @param durationSeconds - Duration in seconds
   * @param startedAt - Optional ISO timestamp when session started
   */
  async trackStudySession(
    activityType: string,
    durationSeconds: number,
    startedAt?: string
  ): Promise<{ status: string; session_id: string; duration_seconds: number }> {
    return this.request("/api/sessions/track", {
      method: "POST",
      body: JSON.stringify({
        activity_type: activityType,
        duration_seconds: durationSeconds,
        started_at: startedAt,
      }),
    });
  }

  /**
   * Get analytics summary for dashboard.
   */
  async getAnalyticsSummary(): Promise<{
    total_xp: number;
    level: number;
    xp_to_next_level: number;
    today_xp: number;
    week_xp: number;
    study_time: {
      today_minutes: number;
      week_minutes: number;
      total_minutes: number;
    };
    streak: {
      current: number;
      longest: number;
      last_active_date: string | null;
    };
    activity_breakdown: Record<string, number>;
  }> {
    return this.request("/api/analytics/summary");
  }

  /**
   * Get skill mastery history over time.
   * @param days - Number of days to look back (default 30)
   */
  async getSkillsHistory(days: number = 30): Promise<{
    skills: Array<{
      skill_key: string;
      category: string;
      history: Array<{ date: string; mastery: number }>;
      current_mastery: number;
      trend: string;
    }>;
    overall_trend: string;
    period_days: number;
  }> {
    return this.request(`/api/skills/history?days=${days}`);
  }

  /**
   * Check for newly unlocked achievements.
   */
  async checkAchievements(): Promise<{
    newly_unlocked: Array<{
      key: string;
      title: string;
      description: string;
      xp_reward: number;
      tier: string;
    }>;
    total_unlocked: number;
  }> {
    return this.request("/api/achievements/check", {
      method: "POST",
    });
  }

  // ============================================================================
  // Daily Challenges (3-slot system)
  // ============================================================================

  /**
   * Get today's daily challenges (Core, Accuracy, Stretch).
   */
  async getDailyChallenges(): Promise<{
    challenges: {
      core: {
        name: string;
        description: string;
        target: number;
        progress: number;
        completed: boolean;
        xp_reward: number;
        completed_at?: string;
      };
      accuracy: {
        name: string;
        description: string;
        target: number;
        progress: number;
        completed: boolean;
        xp_reward: number;
        completed_at?: string;
      };
      stretch: {
        name: string;
        description: string;
        xp_target: number;
        xp_progress: number;
        speaking_target: number;
        speaking_progress: number;
        completed: boolean;
        xp_reward: number;
        gives_freeze_token: boolean;
        completed_at?: string;
      };
    };
    all_completed: boolean;
    streak_freeze_tokens: number;
    date: string;
  }> {
    return this.request("/api/challenges/today");
  }

  /**
   * Update daily challenge progress (3-slot system).
   */
  async updateDailyChallengeProgress(progress: {
    lessons_completed?: number;
    best_score?: number;
    xp_earned?: number;
    speaking_sessions?: number;
  }): Promise<{
    core_just_completed: boolean;
    accuracy_just_completed: boolean;
    stretch_just_completed: boolean;
    total_xp_earned: number;
    earned_freeze_token: boolean;
    challenges: {
      core: { progress: number; completed: boolean };
      accuracy: { progress: number; completed: boolean };
      stretch: { xp_progress: number; speaking_progress: number; completed: boolean };
    };
    all_completed: boolean;
    streak_freeze_tokens: number;
  }> {
    return this.request("/api/challenges/progress", {
      method: "POST",
      body: JSON.stringify(progress),
    });
  }

  /**
   * Get number of available streak freeze tokens.
   */
  async getStreakFreezeTokens(): Promise<{ streak_freeze_tokens: number }> {
    return this.request("/api/challenges/freeze-tokens");
  }

  /**
   * Use a streak freeze token to protect streak.
   */
  async useStreakFreezeToken(): Promise<{
    success: boolean;
    streak_freeze_tokens: number;
  }> {
    return this.request("/api/challenges/use-freeze", {
      method: "POST",
    });
  }

  // ============================================================================
  // Friends System Methods
  // ============================================================================

  /**
   * Get friends list with today's stats and pending requests.
   */
  async getFriends(): Promise<{
    friends: Array<{
      user_id: string;
      username: string | null;
      display_name: string | null;
      level: number;
      total_xp: number;
      streak_days: number;
      xp_today: number;
      lessons_today: number;
      friend_since: string;
    }>;
    pending_requests: Array<{
      request_id: string;
      user_id: string;
      username: string | null;
      display_name: string | null;
      level: number;
      total_xp: number;
      requested_at: string;
    }>;
    friend_code: string;
    friend_count: number;
  }> {
    return this.request("/api/friends");
  }

  /**
   * Search for users by username, display name, or friend code.
   */
  async searchUsers(query: string, limit: number = 10): Promise<{
    users: Array<{
      user_id: string;
      username: string | null;
      display_name: string | null;
      friend_code: string | null;
      level: number;
      total_xp: number;
      streak_days: number;
      is_friend: boolean;
      friendship_status: string | null;
    }>;
  }> {
    return this.request("/api/friends/search", {
      method: "POST",
      body: JSON.stringify({ query, limit }),
    });
  }

  /**
   * Send a friend request.
   */
  async sendFriendRequest(friendId: string): Promise<{
    success: boolean;
    status: string;
  }> {
    return this.request("/api/friends/request", {
      method: "POST",
      body: JSON.stringify({ friend_id: friendId }),
    });
  }

  /**
   * Accept a friend request.
   */
  async acceptFriendRequest(friendId: string): Promise<{ success: boolean }> {
    return this.request("/api/friends/accept", {
      method: "POST",
      body: JSON.stringify({ friend_id: friendId }),
    });
  }

  /**
   * Decline a friend request.
   */
  async declineFriendRequest(friendId: string): Promise<{ success: boolean }> {
    return this.request("/api/friends/decline", {
      method: "POST",
      body: JSON.stringify({ friend_id: friendId }),
    });
  }

  /**
   * Remove a friend.
   */
  async removeFriend(friendId: string): Promise<{ success: boolean }> {
    return this.request(`/api/friends/${friendId}`, {
      method: "DELETE",
    });
  }

  /**
   * Get detailed friend profile with 7-day activity.
   */
  async getFriendProfile(friendId: string): Promise<{
    user_id: string;
    username: string | null;
    display_name: string | null;
    friend_code: string | null;
    level: number;
    total_xp: number;
    streak_days: number;
    longest_streak: number;
    xp_today: number;
    lessons_today: number;
    is_friend: boolean;
    last_7_days_activity: Array<{
      date: string;
      xp: number;
      lessons: number;
    }>;
  }> {
    return this.request(`/api/friends/${friendId}/profile`);
  }

  /**
   * Create a shareable friend invite link.
   */
  async createInviteLink(): Promise<{
    invite_code: string;
    invite_url: string;
  }> {
    return this.request("/api/friends/invite-link", {
      method: "POST",
    });
  }

  /**
   * Use a friend invite link.
   */
  async useInviteLink(inviteCode: string): Promise<{
    success: boolean;
    status: string;
    inviter_name: string;
  }> {
    return this.request("/api/friends/use-invite", {
      method: "POST",
      body: JSON.stringify({ invite_code: inviteCode }),
    });
  }

  /**
   * Get friend challenges (sent and received).
   */
  async getFriendChallenges(): Promise<{
    sent: Array<{
      id: string;
      challenged_id: string;
      challenged_username: string | null;
      challenged_display_name: string | null;
      challenge_type: string;
      challenge_date: string;
      challenger_score: number;
      challenged_score: number;
      status: string;
      winner_id: string | null;
      xp_reward: number;
    }>;
    received: Array<{
      id: string;
      challenger_id: string;
      challenger_username: string | null;
      challenger_display_name: string | null;
      challenge_type: string;
      challenge_date: string;
      challenger_score: number;
      challenged_score: number;
      status: string;
      winner_id: string | null;
      xp_reward: number;
    }>;
  }> {
    return this.request("/api/friends/challenges");
  }

  /**
   * Create a friend challenge.
   */
  async createFriendChallenge(
    friendId: string,
    challengeType: "beat_xp_today" | "more_lessons_today"
  ): Promise<{
    success: boolean;
    challenge: {
      id: string;
      challenge_type: string;
      challenge_date: string;
      status: string;
      xp_reward: number;
    };
  }> {
    return this.request("/api/friends/challenge", {
      method: "POST",
      body: JSON.stringify({ friend_id: friendId, challenge_type: challengeType }),
    });
  }

  /**
   * Respond to a friend challenge.
   */
  async respondToChallenge(
    challengeId: string,
    accept: boolean
  ): Promise<{ success: boolean; accepted: boolean }> {
    return this.request("/api/friends/challenge/respond", {
      method: "POST",
      body: JSON.stringify({ challenge_id: challengeId, accept }),
    });
  }

  /**
   * Get current challenge status and scores.
   */
  async getChallengeStatus(challengeId: string): Promise<{
    id: string;
    challenger_score: number;
    challenged_score: number;
    winner_id: string | null;
    status: string;
  }> {
    return this.request(`/api/friends/challenge/${challengeId}`);
  }

  // ============================================
  // Activity Heatmap & Learning Insights
  // ============================================

  /**
   * Get activity heatmap data for GitHub-style visualization.
   */
  async getActivityHeatmap(days: number = 365): Promise<{
    success: boolean;
    days_requested: number;
    data: Array<{
      date: string;
      xp: number;
      lessons: number;
      sessions: number;
    }>;
  }> {
    return this.request(`/api/analytics/heatmap?days=${days}`);
  }

  /**
   * Get comprehensive learning insights.
   */
  async getLearningInsights(): Promise<{
    success: boolean;
    best_study_hours: Array<{
      hour: number;
      avg_score: number;
      sessions: number;
    }>;
    day_performance: Array<{
      day: string;
      avg_score: number;
      total_xp: number;
      sessions: number;
    }>;
    error_trends: Array<{
      error_type: string;
      count: number;
      recent_count: number;
      trend: string;
    }>;
    skill_progress: Array<{
      skill_key: string;
      mastery_score: number;
      practice_count: number;
      last_practiced: string | null;
    }>;
    streak: {
      current: number;
      longest: number;
    };
    totals: {
      total_lessons: number;
      total_xp: number;
      total_time_minutes: number;
      avg_score: number;
    };
  }> {
    return this.request('/api/analytics/insights');
  }

  // ============================================
  // Push Notifications
  // ============================================

  /**
   * Register a push notification subscription.
   */
  async registerPushSubscription(subscription: {
    endpoint: string;
    p256dh: string;
    auth: string;
  }): Promise<{ success: boolean }> {
    return this.request("/api/push/subscribe", {
      method: "POST",
      body: JSON.stringify(subscription),
    });
  }

  /**
   * Unregister a push notification subscription.
   */
  async unregisterPushSubscription(endpoint: string): Promise<{ success: boolean }> {
    return this.request("/api/push/unsubscribe", {
      method: "POST",
      body: JSON.stringify({ endpoint }),
    });
  }

  /**
   * Get push notification preferences.
   */
  async getPushPreferences(): Promise<{
    enabled: boolean;
    streak_reminders: boolean;
    friend_challenges: boolean;
    achievements: boolean;
    daily_goals: boolean;
  }> {
    return this.request("/api/push/preferences");
  }

  /**
   * Update push notification preferences.
   */
  async updatePushPreferences(preferences: {
    enabled?: boolean;
    streak_reminders?: boolean;
    friend_challenges?: boolean;
    achievements?: boolean;
    daily_goals?: boolean;
  }): Promise<{
    enabled: boolean;
    streak_reminders: boolean;
    friend_challenges: boolean;
    achievements: boolean;
    daily_goals: boolean;
  }> {
    return this.request("/api/push/preferences", {
      method: "PUT",
      body: JSON.stringify(preferences),
    });
  }

  /**
   * Send a test push notification.
   */
  async sendTestPush(): Promise<{ success: boolean; message: string }> {
    return this.request("/api/push/test", {
      method: "POST",
    });
  }

  // ============================================
  // Gamification Bonuses
  // ============================================

  /**
   * Get bonus summary for today including available and claimed bonuses.
   */
  async getBonusSummary(): Promise<{
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
  }> {
    return this.request("/api/bonuses/summary");
  }

  /**
   * Claim daily login bonus.
   */
  async claimLoginBonus(): Promise<{
    success: boolean;
    xp_earned: number;
    message: string;
  }> {
    return this.request("/api/bonuses/claim-login", {
      method: "POST",
    });
  }

  /**
   * Get all active bonuses for the user.
   */
  async getActiveBonuses(): Promise<{
    login_bonus_available: boolean;
    login_bonus_xp: number;
    streak_multiplier: number;
    streak_days: number;
    weekend_bonus_active: boolean;
    weekend_multiplier: number;
    event_bonus_active: boolean;
    event_name: string | null;
    event_multiplier: number;
    total_multiplier: number;
  }> {
    return this.request("/api/bonuses/active");
  }

  /**
   * Calculate XP with all active bonuses applied.
   */
  async calculateBonusXP(
    baseXp: number,
    isPerfectScore: boolean = false
  ): Promise<{
    final_xp: number;
    bonus_breakdown: {
      base_xp: number;
      streak_multiplier: number;
      weekend_multiplier: number;
      event_multiplier: number;
      perfect_score_multiplier: number;
      final_xp: number;
      bonus_xp: number;
    };
  }> {
    return this.request("/api/bonuses/calculate-xp", {
      method: "POST",
      body: JSON.stringify({
        base_xp: baseXp,
        is_perfect_score: isPerfectScore,
      }),
    });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Also export class for testing
export default ApiClient;
