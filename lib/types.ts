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
  goals: string[];
  interests: string[];
  daily_time_goal: number | null;
  onboarding_completed: boolean;
  full_name: string | null;
  trial_start_date: string | null;
  trial_end_date: string | null;
  subscription_status: string | null; // "active", "cancelled", "expired", null
  subscription_tier: string | null; // "starter", "pro", "premium", "enterprise", null
  is_tester: boolean;
  total_xp: number;
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
  trial_start_date?: string;
  trial_end_date?: string;
  voice_preferences?: VoicePreferences;
}

// Voice Preferences types
export interface VoicePreferences {
  voice: string;
  speech_speed: number;
  auto_play_responses: boolean;
  show_transcription: boolean;
  microphone_sensitivity: number;
}

export interface UpdateVoicePreferencesRequest {
  voice?: string;
  speech_speed?: number;
  auto_play_responses?: boolean;
  show_transcription?: boolean;
  microphone_sensitivity?: number;
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

// Leaderboard types
export interface LeaderboardEntry {
  user_id: string;
  display_name: string;
  level: string;
  rank: number;
  xp_this_week?: number;
  xp_this_month?: number;
  total_xp?: number;
  current_streak?: number;
}

export interface LeaderboardResponse {
  leaderboard: LeaderboardEntry[];
  current_user: LeaderboardEntry | null;
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

// Learning Dashboard types
export interface DashboardTask {
  id: string;
  type: "lesson" | "drill" | "scenario";
  title: string;
  duration: number;
  skill: string;
  href: string;
}

export interface SkillScore {
  grammar: number;
  vocabulary: number;
  fluency: number;
  pronunciation: number;
}

export interface ProgressLevel {
  current: string;
  next: string;
  progress: number;
  daysToNext: number;
}

export interface SessionData {
  date: string;
  minutes: number;
}

export interface LearningDashboardResponse {
  todayFocus: DashboardTask[];
  skillScores: SkillScore;
  progressPath: ProgressLevel;
  recentGrowth: SessionData[];
  minutesStudiedToday: number;
  currentStreak: number;
  dailyGoal: number;
}

// Gamification types

export interface HeartsState {
  current: number;
  max: number;
  lastLostTime: string | null;
  refillsAt: string | null;
}

export interface XPState {
  total: number;
  today: number;
  level: number;
  toNextLevel: number;
}

export interface ExerciseResult {
  correct: boolean;
  xpEarned: number;
  streakBonus: number;
  explanation?: string;
  correctAnswer?: string;
}

// Exercise types

export type ExerciseType = "multiple_choice" | "fill_blank" | "sentence_correction";

export interface Exercise {
  id: string;
  type: ExerciseType;
  level: string; // A1, A2, B1, B2
  skill: string; // grammar, vocabulary, etc.
  question: string;
  options?: string[]; // For multiple choice
  correctAnswer: string;
  explanation: string;
  hint?: string;
}

export interface ExerciseSession {
  exercises: Exercise[];
  currentIndex: number;
  correctCount: number;
  totalXP: number;
  startTime: string;
  heartsLost: number;
}

// Exercise API types
export interface ExerciseFromAPI {
  id: string;
  type: ExerciseType;
  level: string;
  skill: string;
  question: string;
  options?: string[];
  hint?: string;
  // Note: correctAnswer and explanation are NOT returned from API until submission
}

export interface ExerciseSessionResponse {
  exercises: ExerciseFromAPI[];
  count: number;
}

export interface ExerciseSubmitRequest {
  exercise_id: string;
  user_answer: string;
}

export interface ExerciseSubmitResponse {
  is_correct: boolean;
  correct_answer: string;
  explanation: string;
  xp_earned: number;
}

// Payment types

export interface CreateCheckoutSessionRequest {
  price_id: string;
  success_url: string;
  cancel_url: string;
}

export interface CheckoutSessionResponse {
  session_id: string;
  checkout_url: string;
}

export interface PortalSessionRequest {
  return_url: string;
}

export interface PortalSessionResponse {
  portal_url: string;
}

export interface SubscriptionStatusResponse {
  status: string; // "none", "active", "trialing", "past_due", "cancelled"
  tier: string; // "free", "premium"
  message?: string;
  subscription_id?: string;
  billing_cycle?: string; // "monthly", "yearly"
  price_cents?: number;
  currency?: string;
  current_period_start?: string;
  current_period_end?: string;
  cancelled_at?: string;
  trial_start?: string;
  trial_end?: string;
  will_renew?: boolean;
}

export interface CancelSubscriptionRequest {
  reason?: string;
}

// Notification types

export type NotificationType =
  | "streak_risk"
  | "achievement"
  | "goal_complete"
  | "weekly_summary"
  | "reminder"
  | "level_up"
  | "streak_milestone";

export interface Notification {
  notification_id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  action_url?: string | null;
  metadata?: Record<string, any> | null;
  created_at: string;
  read_at?: string | null;
}

export interface NotificationsResponse {
  notifications: Notification[];
  count: number;
  has_more: boolean;
}

export interface UnreadCountResponse {
  unread_count: number;
}

export interface MarkNotificationReadResponse {
  status: string;
  message: string;
  notification_id: string;
}

export interface MarkAllReadResponse {
  status: string;
  message: string;
  count: number;
}

// Daily Challenges
export interface DailyChallenge {
  type: string;
  title: string;
  description: string;
  goal: number;
  reward_xp: number;
  icon: string;
  date: string;
  expires_at: string;
}

export interface ChallengeHistoryRecord {
  user_id: string;
  challenge_date: string;
  challenge_type: string;
  progress: number;
  goal: number;
  completed: boolean;
  completed_at?: string;
  created_at: string;
  updated_at: string;
  challenge_title?: string;
  challenge_description?: string;
  reward_xp?: number;
}

// Learning Path types
export interface LearningUnit {
  unit_id: string;
  unit_number: number;
  level: string;
  title: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  order_index: number;
  is_locked: boolean;
  prerequisite_unit_id: string | null;
  estimated_time_minutes: number | null;
  lesson_count: number;
  completed_lessons: number;
  progress_percentage: number;
  is_completed: boolean;
}

export interface LearningLesson {
  lesson_id: string;
  unit_id: string;
  lesson_number: number;
  title: string;
  description: string | null;
  lesson_type: string;
  order_index: number;
  is_locked: boolean;
  xp_reward: number;
  estimated_time_minutes: number | null;
  is_completed: boolean;
  best_score: number | null;
  attempts: number;
}

export interface LearningPathUnitsResponse {
  units: LearningUnit[];
  count: number;
  user_level: string;
}

export interface LearningPathUnitDetailResponse {
  unit: LearningUnit;
  lessons: LearningLesson[];
}

export interface LearningPathLessonResponse {
  lesson: LearningLesson;
  exercises: ExerciseFromAPI[];
}

export interface CompleteLessonRequest {
  score: number;
  mistakes_count?: number;
  time_spent_seconds?: number;
}

export interface CompleteLessonResponse {
  status: string;
  xp_earned: number;
  is_first_completion: boolean;
  lesson_progress: {
    is_completed: boolean;
    best_score: number;
    attempts: number;
  };
  unit_progress: {
    completed_lessons: number;
    total_lessons: number;
    is_completed: boolean;
  };
}

export interface NextLessonResponse {
  next_lesson: LearningLesson | null;
  unit: LearningUnit | null;
  message: string;
}

// Diagnostic Test types

export interface DiagnosticQuestion {
  exercise_id: string;
  level: string;
  question: string;
  options: string[];
  type: string;
}

export interface DiagnosticProgress {
  answered: number;
  max: number;
}

export interface DiagnosticStats {
  A1: { correct: number; total: number };
  A2: { correct: number; total: number };
  B1: { correct: number; total: number };
}

export interface DiagnosticStartResponse {
  session_id?: string;
  resuming?: boolean;
  question?: DiagnosticQuestion;
  progress?: DiagnosticProgress;
  done?: boolean;
  user_level?: string;
  summary?: {
    stats: DiagnosticStats;
    questions_answered: number;
  };
}

export interface DiagnosticAnswerRequest {
  session_id: string;
  exercise_id: string;
  user_answer: string;
}

export interface DiagnosticAnswerResponse {
  done: boolean;
  is_correct: boolean;
  correct_answer: string;
  question?: DiagnosticQuestion;
  progress?: DiagnosticProgress;
  user_level?: string;
  summary?: {
    stats: DiagnosticStats;
    questions_answered: number;
  };
}

// Guided Mode types

export interface GuidedSkillExercise {
  id: string;
  type: string;
  question: string;
  options?: string[];
  level: string;
  skill: string;
}

export interface GuidedSkill {
  skill_key: string;
  name: string;
  domain: string;
  level: string;
  p_learned: number;
  practice_count: number;
  sample_exercise: GuidedSkillExercise | null;
}

export interface GuidedLearningResponse {
  has_diagnostic: boolean;
  user_level: string;
  skills: GuidedSkill[];
}

export interface LevelMastery {
  total_skills: number;
  mastered_skills: number;
  average_mastery: number;
  mastery_percentage: number;
}

export interface ProgressSummaryResponse {
  user_level: string;
  has_diagnostic: boolean;
  total_skills: number;
  mastered_skills: number;
  mastery_percentage: number;
  by_level: {
    A1: LevelMastery;
    A2: LevelMastery;
    B1: LevelMastery;
  };
  recent_activity: {
    skills_practiced_last_10_days: number;
  };
}

export interface DiagnosticStatusResponse {
  status: "completed" | "in_progress" | "not_started";
  user_level?: string;
  completed_at?: string;
  session_id?: string;
  questions_answered?: number;
}

// Think (Thinking in English) types

export interface ThinkingCorrection {
  original: string | null;
  corrected: string | null;
  note: string | null;
}

export interface ThinkingTurn {
  turn_number: number;
  user_message: string;
  ai_response: string;
  question_asked: string;
  correction: ThinkingCorrection | null;
  timestamp: string;
}

export interface ThinkingSession {
  session_id: string;
  user_id: string;
  level: string;
  turns: ThinkingTurn[];
  started_at: string;
  ended_at: string | null;
  max_turns: number;
  current_turn: number;
  is_complete: boolean;
}

export interface ThinkStartResponse {
  session_id: string;
  ai_message: string;
  question_asked: string;
  current_turn: number;
  max_turns: number;
}

export interface ThinkRespondRequest {
  session_id: string;
  user_message: string;
}

export interface ThinkRespondResponse {
  ai_message: string;
  question_asked: string;
  correction: ThinkingCorrection | null;
  current_turn: number;
  max_turns: number;
  is_complete: boolean;
  summary?: ThinkingSummary;
}

export interface ThinkingSummary {
  total_turns: number;
  total_words: number;
  corrections_count: number;
  corrections: ThinkingCorrection[];
  strengths: string[];
  xp_earned: number;
}

export interface ThinkEndResponse {
  status: string;
  summary: ThinkingSummary;
}
