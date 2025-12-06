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
}

// Export singleton instance
export const apiClient = new ApiClient();

// Also export class for testing
export default ApiClient;
