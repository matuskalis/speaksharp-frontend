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
      <div className="max-w-container mx-auto px-8 text-center">
        <div className="text-gray-600">Loading lessons...</div>
      </div>
    );
  }

  // Lessons List View
  if (viewMode === "list") {
    return (
      <div className="max-w-container mx-auto px-8">
        {/* Hero Section */}
        <div className="text-center mb-24">
          <h2 className="text-6xl font-bold text-gray-900 mb-6">Grammar Lessons</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            11 structured lessons covering A1-A2 English grammar
          </p>
        </div>

        {error && (
          <div className="mb-12 p-8 bg-white border border-gray-200 rounded-xl text-red-600">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {lessons.map((lesson) => (
            <button
              key={lesson.lesson_id}
              onClick={() => loadLesson(lesson.lesson_id)}
              className="bg-white border border-gray-200 rounded-xl p-8 hover:border-gray-300 hover:shadow-md transition-all duration-200 text-left"
            >
              <div className="flex items-start justify-between mb-6">
                <h3 className="text-2xl font-semibold text-gray-900">
                  {lesson.title}
                </h3>
                <span className="bg-gray-100 text-gray-900 border border-gray-200 text-sm font-medium px-2.5 py-1 rounded">
                  {lesson.level}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {lesson.skill_targets.map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-sm bg-white text-gray-600 px-2 py-1 rounded border border-gray-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <div className="text-sm text-gray-500">
                {lesson.duration_minutes} minutes
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
    <div className="max-w-container mx-auto px-8">
      {/* Header with back button */}
      <div className="flex items-center justify-between mb-12">
        <button
          onClick={backToList}
          className="text-gray-900 hover:text-gray-600 font-medium"
        >
          ← Back to Lessons
        </button>
        <span className="bg-gray-100 text-gray-900 border border-gray-200 text-sm font-medium px-3 py-1 rounded">
          {selectedLesson.level}
        </span>
      </div>

      {/* Lesson Title */}
      <div className="bg-white border border-gray-200 rounded-xl p-8 mb-12">
        <h2 className="text-3xl font-semibold text-gray-900 mb-6">
          {selectedLesson.title}
        </h2>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Task {currentTaskIndex + 1} of {totalTasks}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gray-900 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Context and Explanation (first task only) */}
        {currentTaskIndex === 0 && (
          <>
            <div className="mb-6 p-8 bg-white border border-gray-200 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-2">Context:</h3>
              <p className="text-base text-gray-600">{selectedLesson.context}</p>
            </div>

            <div className="mb-6 p-8 bg-white border border-gray-200 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-2">Target Language:</h3>
              <p className="text-base text-gray-600">{selectedLesson.target_language}</p>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Explanation:</h3>
              <p className="text-base text-gray-600">{selectedLesson.explanation}</p>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Examples:</h3>
              <ul className="space-y-1">
                {selectedLesson.examples.map((example, idx) => (
                  <li key={idx} className="text-base text-gray-600 flex items-start">
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
      <div className="bg-white border border-gray-200 rounded-xl p-8 mb-12">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-3xl font-semibold text-gray-900">
              {isFreerProduction ? "Free Production Task" : "Practice Task"}
            </h3>
            <span className="text-sm bg-white text-gray-600 border border-gray-200 px-2 py-1 rounded">
              {currentTask.task_type}
            </span>
          </div>
          <p className="text-base text-gray-900 mb-2">{currentTask.prompt}</p>
          {currentTask.example_answer && (
            <p className="text-sm text-gray-600">
              Example: {currentTask.example_answer}
            </p>
          )}
        </div>

        {/* Answer Input */}
        <div className="mb-6">
          <textarea
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Type your answer here..."
            className="w-full p-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 disabled:opacity-50"
            rows={3}
            disabled={submitting}
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={submitTask}
          disabled={!userAnswer.trim() || submitting}
          className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
            !userAnswer.trim() || submitting
              ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
              : "bg-gray-900 text-white hover:bg-gray-800"
          }`}
        >
          {submitting ? "Checking..." : "Submit Answer"}
        </button>
      </div>

      {/* Feedback */}
      {taskFeedback && (
        <div className="space-y-12">
          {/* Tutor Message */}
          <div className="bg-white border border-gray-200 rounded-xl p-8">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg
                  className="w-6 h-6 text-gray-900"
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
                <h3 className="text-sm font-medium text-gray-900 mb-1">
                  Tutor Feedback
                </h3>
                <p className="text-base text-gray-600">{taskFeedback.message}</p>
              </div>
            </div>
          </div>

          {/* Errors */}
          {taskFeedback.errors.length > 0 && (
            <div>
              <h3 className="text-3xl font-semibold text-gray-900 mb-6">
                Corrections ({taskFeedback.errors.length})
              </h3>
              <div className="space-y-6">
                {taskFeedback.errors.map((error, index) => (
                  <div
                    key={index}
                    className="p-8 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md transition-all duration-200"
                  >
                    <div className="space-y-6">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">
                          You said:
                        </p>
                        <p className="text-base text-gray-900 line-through">{error.user_sentence}</p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">
                          Corrected:
                        </p>
                        <p className="text-base font-medium text-gray-900">{error.corrected_sentence}</p>
                      </div>

                      <div className="pt-6 border-t border-gray-200">
                        <p className="text-base italic text-gray-600">{error.explanation}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No errors */}
          {taskFeedback.errors.length === 0 && (
            <div className="p-8 bg-white border border-gray-200 rounded-xl">
              <p className="text-base text-gray-900 text-center">
                Perfect! No errors detected.
              </p>
            </div>
          )}

          {/* Next Task Button */}
          {currentTaskIndex < totalTasks - 1 && (
            <button
              onClick={nextTask}
              className="w-full py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-all duration-200"
            >
              Next Task →
            </button>
          )}

          {/* Complete Button */}
          {currentTaskIndex === totalTasks - 1 && (
            <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
              <h3 className="text-3xl font-semibold text-gray-900 mb-6">
                Lesson Complete!
              </h3>
              <p className="text-base text-gray-600 mb-6">{selectedLesson.summary}</p>
              <button
                onClick={backToList}
                className="px-6 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-all duration-200"
              >
                Back to Lessons
              </button>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="p-8 bg-white border border-gray-200 rounded-xl text-red-600 mt-12">
          {error}
        </div>
      )}
    </div>
  );
}
