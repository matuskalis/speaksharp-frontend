/**
 * TypeScript types matching SpeakSharp Core backend API.
 *
 * Backend: https://github.com/matuskalis/speaksharp-core
 * Models: app/models.py and app/api.py
 */

export type ErrorType =
  | "grammar"
  | "vocab"
  | "fluency"
  | "structure"
  | "pronunciation_placeholder";

export interface TutorError {
  type: ErrorType;
  user_sentence: string;
  corrected_sentence: string;
  explanation: string;
}

export interface TutorTextRequest {
  text: string;
  scenario_id?: string;
  context?: string;
  session_id?: string;
}

export interface TutorTextResponse {
  message: string;
  errors: TutorError[];
  micro_task: string | null;
  session_id: string;
}

export interface CreateUserRequest {
  user_id?: string;
  level?: string;
  native_language?: string;
  goals?: Record<string, any>;
  interests?: string[];
}

export interface UserProfileResponse {
  user_id: string;
  level: string;
  native_language: string | null;
  goals: Record<string, any>;
  interests: string[];
  created_at: string;
  updated_at: string;
}

export interface HealthResponse {
  status: string;
  database: string;
  timestamp: string;
}

export interface ApiError {
  detail: string;
}

// SRS (Spaced Repetition System) types

export interface SRSCard {
  card_id: string;
  front: string;
  back: string;
  card_type: string;
}

export interface SRSDueResponse {
  cards: SRSCard[];
  count: number;
}

export interface SRSReviewRequest {
  card_id: string;
  quality: number; // 0-5
  response_time_ms?: number;
  user_response?: string;
  correct?: boolean;
}

export interface SRSReviewResponse {
  status: string;
  message: string;
  card_id: string;
}

export interface UpdateProfileRequest {
  level?: string;
  native_language?: string;
  goals?: string[];
  interests?: string[];
  daily_time_goal?: number;
  onboarding_completed?: boolean;
}

// Voice tutoring types
export interface VoiceTutorResponse {
  transcript: string;
  tutor_response: {
    message: string;
    errors: TutorError[];
    micro_task: string | null;
  };
  audio_base64: string | null;
  session_id: string;
}

// Lessons types
export interface LessonTask {
  task_type: string; // "transformation", "production", "comprehension", "gap_fill"
  prompt: string;
  example_answer?: string;
}

export interface LessonSummary {
  lesson_id: string;
  title: string;
  level: string;
  skill_targets: string[];
  duration_minutes: number;
}

export interface LessonDetail {
  lesson_id: string;
  title: string;
  level: string;
  skill_targets: string[];
  duration_minutes: number;
  context: string;
  target_language: string;
  explanation: string;
  examples: string[];
  controlled_practice: LessonTask[];
  freer_production: LessonTask;
  summary: string;
}

export interface LessonsListResponse {
  lessons: LessonSummary[];
  count: number;
}

export interface LessonTaskSubmitRequest {
  task_index: number; // 0 for first controlled practice, -1 for freer production
  user_answer: string;
}

export interface LessonTaskSubmitResponse {
  message: string;
  errors: TutorError[];
  micro_task: string | null;
  session_id: string;
}

// Stats & Analytics types
export interface ErrorStatsResponse {
  total_errors: number;
  errors_by_type: Record<string, number>; // e.g., { "grammar": 5, "vocab": 3 }
  last_errors: RecentError[];
}

export interface RecentError {
  before_text: string;
  after_text: string;
  type: string;
  explanation: string;
  timestamp: string;
}

export interface SrsStatsResponse {
  total_cards: number;
  due_today: number;
  reviewed_today: number;
  success_rate_today: number; // 0-100
}

export interface WeakSkill {
  skill_key: string;
  skill_category: string;
  mastery_score: number;
  error_count: number;
  practice_count: number;
}

export interface WeakSkillsResponse {
  skills: WeakSkill[];
  count: number;
}

export interface StreakResponse {
  current_streak: number;
  longest_streak: number;
  last_active_date: string | null;
}

// Achievements types
export interface Achievement {
  achievement_id: string;
  achievement_key: string;
  title: string;
  description: string;
  icon_url?: string;
  category: string; // "milestone", "streak", "mastery", "social"
  points: number;
  tier: string; // "bronze", "silver", "gold", "platinum"
  created_at: string;
  unlocked_at?: string; // Only present for user achievements
  progress?: number; // Only present for user achievements
}

export interface AchievementsResponse {
  achievements: Achievement[];
  count: number;
}

// Daily Goals types
export interface DailyGoal {
  goal_id: string;
  user_id: string;
  goal_date: string;
  target_study_minutes: number;
  target_lessons: number;
  target_reviews: number;
  target_drills: number;
  actual_study_minutes: number;
  actual_lessons: number;
  actual_reviews: number;
  actual_drills: number;
  completed: boolean;
  completion_percentage: number;
  created_at: string;
  updated_at: string;
}

export interface UpdateGoalTargetsRequest {
  target_study_minutes?: number;
  target_lessons?: number;
  target_reviews?: number;
  target_drills?: number;
}

// Referrals types
export interface ReferralCode {
  code_id: string;
  user_id: string;
  code: string;
  total_signups: number;
  total_conversions: number;
  reward_type?: string;
  reward_value?: number;
  is_active: boolean;
  expires_at?: string;
  created_at: string;
}

export interface ReferralStats {
  referral_code: string;
  total_signups: number;
  total_conversions: number;
}

export interface ClaimReferralRequest {
  referral_code: string;
}

// Scenarios types
export interface ScenarioSummary {
  scenario_id: string;
  title: string;
  level_min: string;
  level_max: string;
  situation_description: string;
  difficulty_tags: string[];
}

export interface ScenarioDetail {
  scenario_id: string;
  title: string;
  level_min: string;
  level_max: string;
  situation_description: string;
  user_goal: string;
  task: string;
  success_criteria: string;
  difficulty_tags: string[];
  user_variables: Record<string, any>;
}

export interface ScenariosListResponse {
  scenarios: ScenarioSummary[];
  count: number;
}

export interface ScenarioRespondRequest {
  user_input: string;
  turn_number: number;
}

export interface ScenarioRespondResponse {
  tutor_message: string;
  errors: TutorError[];
  micro_task: string | null;
  session_id: string;
  turn_number: number;
  scenario_complete: boolean;
  success_evaluation: string | null;
}

// Drills types
export interface MonologuePrompt {
  prompt_id: string;
  text: string;
  level: string;
  category: string;
  time_limit_seconds: number;
}

export interface JournalPrompt {
  prompt_id: string;
  text: string;
  level: string;
  category: string;
  min_words: number;
}

export interface MonologuePromptsResponse {
  prompts: MonologuePrompt[];
  count: number;
}

export interface JournalPromptsResponse {
  prompts: JournalPrompt[];
  count: number;
}

export interface MonologueSubmitRequest {
  prompt_id: string;
  transcript: string;
  duration_seconds: number;
}

export interface JournalSubmitRequest {
  prompt_id: string;
  content: string;
}

export interface DrillSubmitResponse {
  message: string;
  errors: TutorError[];
  micro_task: string | null;
  session_id: string;
  word_count: number;
}

// Placement Test types
export interface PlacementQuestion {
  question_id: string;
  question_text: string;
  options: string[];
  level: string;
  skill_type: string;
}

export interface PlacementTestQuestionsResponse {
  questions: PlacementQuestion[];
  total_questions: number;
}

export interface PlacementTestSubmitRequest {
  answers: number[];  // Array of selected option indices
}

export interface PlacementTestResult {
  level: string;
  score: number;
  total_questions: number;
  strengths: string[];
  weaknesses: string[];
  recommendation: string;
}
