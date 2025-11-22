"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { LessonSummary, LessonDetail, LessonTaskSubmitResponse, TutorError } from "@/lib/types";

type ViewMode = "list" | "lesson";

export default function LessonsPanel() {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [lessons, setLessons] = useState<LessonSummary[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<LessonDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Task state
  const [currentTaskIndex, setCurrentTaskIndex] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [taskFeedback, setTaskFeedback] = useState<LessonTaskSubmitResponse | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Load lessons list on mount
  useEffect(() => {
    loadLessons();
  }, []);

  const loadLessons = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.getLessons();
      setLessons(response.lessons);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load lessons");
    } finally {
      setLoading(false);
    }
  };

  const loadLesson = async (lessonId: string) => {
    setLoading(true);
    setError(null);
    try {
      const lesson = await apiClient.getLesson(lessonId);
      setSelectedLesson(lesson);
      setCurrentTaskIndex(0);
      setUserAnswer("");
      setTaskFeedback(null);
      setViewMode("lesson");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load lesson");
    } finally {
      setLoading(false);
    }
  };

  const submitTask = async () => {
    if (!selectedLesson || !userAnswer.trim()) return;

    setSubmitting(true);
    setError(null);
    try {
      const response = await apiClient.submitLessonTask(selectedLesson.lesson_id, {
        task_index: currentTaskIndex,
        user_answer: userAnswer,
      });
      setTaskFeedback(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit answer");
    } finally {
      setSubmitting(false);
    }
  };

  const nextTask = () => {
    if (!selectedLesson) return;
    const totalTasks = selectedLesson.controlled_practice.length;
    if (currentTaskIndex < totalTasks) {
      setCurrentTaskIndex(currentTaskIndex + 1);
      setUserAnswer("");
      setTaskFeedback(null);
    }
  };

  const backToList = () => {
    setViewMode("list");
    setSelectedLesson(null);
    setCurrentTaskIndex(0);
    setUserAnswer("");
    setTaskFeedback(null);
  };

  const errorTypeColors: Record<string, string> = {
    grammar: "bg-red-500/10 text-red-300 border-red-500/30",
    vocab: "bg-purple-500/10 text-purple-300 border-purple-500/30",
    fluency: "bg-blue-500/10 text-blue-300 border-blue-500/30",
    structure: "bg-orange-500/10 text-orange-300 border-orange-500/30",
    pronunciation_placeholder: "bg-pink-500/10 text-pink-300 border-pink-500/30",
  };

  if (loading && !selectedLesson) {
    return (
      <div className="max-w-5xl mx-auto p-6 text-center">
        <div className="text-white/60">Loading lessons...</div>
      </div>
    );
  }

  // Lessons List View
  if (viewMode === "list") {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300 mb-3">📚 Grammar Lessons</h2>
          <p className="text-white/60">
            11 structured lessons covering A1-A2 English grammar
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lessons.map((lesson) => (
            <button
              key={lesson.lesson_id}
              onClick={() => loadLesson(lesson.lesson_id)}
              className="bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] p-6 hover:bg-white/[0.05] transition-all duration-300 text-left"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-white">
                  {lesson.title}
                </h3>
                <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-medium px-2.5 py-0.5 rounded">
                  {lesson.level}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {lesson.skill_targets.map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-white/[0.05] text-white/70 px-2 py-1 rounded border border-white/[0.08]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <div className="text-sm text-white/50">
                ⏱️ {lesson.duration_minutes} minutes
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Lesson Detail View
  if (!selectedLesson) return null;

  const isFreerProduction = currentTaskIndex === selectedLesson.controlled_practice.length;
  const currentTask = isFreerProduction
    ? selectedLesson.freer_production
    : selectedLesson.controlled_practice[currentTaskIndex];

  const totalTasks = selectedLesson.controlled_practice.length + 1;
  const progress = ((currentTaskIndex + 1) / totalTasks) * 100;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header with back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={backToList}
          className="text-indigo-300 hover:text-indigo-200 font-medium"
        >
          ← Back to Lessons
        </button>
        <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-sm font-medium px-3 py-1 rounded">
          {selectedLesson.level}
        </span>
      </div>

      {/* Lesson Title */}
      <div className="bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] p-7">
        <h2 className="text-2xl font-bold text-white mb-4">
          {selectedLesson.title}
        </h2>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-white/60 mb-2">
            <span>Task {currentTaskIndex + 1} of {totalTasks}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-white/[0.05] rounded-full h-2">
            <div
              className="bg-gradient-to-r from-indigo-500 to-rose-500 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Context and Explanation (first task only) */}
        {currentTaskIndex === 0 && (
          <>
            <div className="mb-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl backdrop-blur-sm">
              <h3 className="font-semibold text-blue-300 mb-2">Context:</h3>
              <p className="text-blue-200">{selectedLesson.context}</p>
            </div>

            <div className="mb-4 p-4 bg-green-500/10 border border-green-500/20 rounded-xl backdrop-blur-sm">
              <h3 className="font-semibold text-green-300 mb-2">Target Language:</h3>
              <p className="text-green-200">{selectedLesson.target_language}</p>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold text-white/80 mb-2">Explanation:</h3>
              <p className="text-white/70">{selectedLesson.explanation}</p>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-white/80 mb-2">Examples:</h3>
              <ul className="space-y-1">
                {selectedLesson.examples.map((example, idx) => (
                  <li key={idx} className="text-white/70 flex items-start">
                    <span className="mr-2">•</span>
                    <span>{example}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>

      {/* Current Task */}
      <div className="bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] p-7">
        <div className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-white">
              {isFreerProduction ? "📝 Free Production Task" : "✏️ Practice Task"}
            </h3>
            <span className="text-xs bg-white/[0.05] text-white/70 border border-white/[0.08] px-2 py-1 rounded">
              {currentTask.task_type}
            </span>
          </div>
          <p className="text-white/80 text-lg">{currentTask.prompt}</p>
          {currentTask.example_answer && (
            <p className="text-sm text-white/50 mt-2">
              💡 Example: {currentTask.example_answer}
            </p>
          )}
        </div>

        {/* Answer Input */}
        <div className="mb-5">
          <textarea
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Type your answer here..."
            className="w-full p-3 bg-white/[0.05] border border-white/[0.12] rounded-lg text-white placeholder-white/30 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 disabled:opacity-50"
            rows={3}
            disabled={submitting}
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={submitTask}
          disabled={!userAnswer.trim() || submitting}
          className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
            !userAnswer.trim() || submitting
              ? "bg-white/[0.05] text-white/40 cursor-not-allowed"
              : "bg-gradient-to-r from-indigo-500 to-rose-500 text-white hover:from-indigo-600 hover:to-rose-600"
          }`}
        >
          {submitting ? "Checking..." : "Submit Answer"}
        </button>
      </div>

      {/* Feedback */}
      {taskFeedback && (
        <div className="space-y-4">
          {/* Tutor Message */}
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl backdrop-blur-sm p-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg
                  className="w-6 h-6 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-green-300 mb-1">
                  Tutor Feedback
                </h3>
                <p className="text-green-200">{taskFeedback.message}</p>
              </div>
            </div>
          </div>

          {/* Errors */}
          {taskFeedback.errors.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white">
                Corrections ({taskFeedback.errors.length})
              </h3>
              {taskFeedback.errors.map((error, index) => (
                <div
                  key={index}
                  className={`p-5 border rounded-xl backdrop-blur-sm ${
                    errorTypeColors[error.type] || "bg-white/[0.05] text-white/70 border-white/[0.08]"
                  }`}
                >
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-medium opacity-75 mb-1">
                        You said:
                      </p>
                      <p className="line-through">{error.user_sentence}</p>
                    </div>

                    <div>
                      <p className="text-xs font-medium opacity-75 mb-1">
                        Corrected:
                      </p>
                      <p className="font-medium">{error.corrected_sentence}</p>
                    </div>

                    <div className="pt-2 border-t border-current opacity-50">
                      <p className="text-sm italic">{error.explanation}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No errors */}
          {taskFeedback.errors.length === 0 && (
            <div className="p-5 bg-blue-500/10 border border-blue-500/20 rounded-xl backdrop-blur-sm">
              <p className="text-blue-300 text-center">
                ✨ Perfect! No errors detected.
              </p>
            </div>
          )}

          {/* Next Task Button */}
          {currentTaskIndex < totalTasks - 1 && (
            <button
              onClick={nextTask}
              className="w-full py-3 bg-gradient-to-r from-indigo-500 to-rose-500 text-white rounded-lg font-semibold hover:from-indigo-600 hover:to-rose-600 transition-all duration-300"
            >
              Next Task →
            </button>
          )}

          {/* Complete Button */}
          {currentTaskIndex === totalTasks - 1 && (
            <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-xl backdrop-blur-sm p-6 text-center">
              <h3 className="text-xl font-bold text-white mb-2">
                🎉 Lesson Complete!
              </h3>
              <p className="text-white/70 mb-4">{selectedLesson.summary}</p>
              <button
                onClick={backToList}
                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-rose-500 text-white rounded-lg font-semibold hover:from-indigo-600 hover:to-rose-600 transition-all duration-300"
              >
                Back to Lessons
              </button>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
          {error}
        </div>
      )}
    </div>
  );
}
