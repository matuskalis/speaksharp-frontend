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
}

// Export singleton instance
export const apiClient = new ApiClient();

// Also export class for testing
export default ApiClient;
