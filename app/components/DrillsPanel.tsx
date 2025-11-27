"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { MonologuePrompt, JournalPrompt, TutorError, DrillSubmitResponse } from "@/lib/types";

type DrillMode = "monologue" | "journal";
type ViewMode = "list" | "active";

export default function DrillsPanel() {
  const [drillMode, setDrillMode] = useState<DrillMode>("monologue");
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  // Monologue state
  const [monologuePrompts, setMonologuePrompts] = useState<MonologuePrompt[]>([]);
  const [selectedMonologue, setSelectedMonologue] = useState<MonologuePrompt | null>(null);
  const [monologueText, setMonologueText] = useState("");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isRecording, setIsRecording] = useState(false);

  // Journal state
  const [journalPrompts, setJournalPrompts] = useState<JournalPrompt[]>([]);
  const [selectedJournal, setSelectedJournal] = useState<JournalPrompt | null>(null);
  const [journalText, setJournalText] = useState("");

  // Shared state
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<DrillSubmitResponse | null>(null);

  // Load prompts on mount or mode change
  useEffect(() => {
    if (drillMode === "monologue") {
      loadMonologuePrompts();
    } else {
      loadJournalPrompts();
    }
  }, [drillMode]);

  // Timer for monologue
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRecording) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  const loadMonologuePrompts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.getMonologuePrompts();
      setMonologuePrompts(response.prompts);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load monologue prompts");
    } finally {
      setLoading(false);
    }
  };

  const loadJournalPrompts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.getJournalPrompts();
      setJournalPrompts(response.prompts);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load journal prompts");
    } finally {
      setLoading(false);
    }
  };

  const startMonologue = (prompt: MonologuePrompt) => {
    setSelectedMonologue(prompt);
    setMonologueText("");
    setElapsedSeconds(0);
    setIsRecording(false);
    setFeedback(null);
    setViewMode("active");
  };

  const startJournal = (prompt: JournalPrompt) => {
    setSelectedJournal(prompt);
    setJournalText("");
    setFeedback(null);
    setViewMode("active");
  };

  const submitMonologue = async () => {
    if (!selectedMonologue || !monologueText.trim()) return;

    setSubmitting(true);
    setError(null);
    try {
      const response = await apiClient.submitMonologue({
        prompt_id: selectedMonologue.prompt_id,
        transcript: monologueText,
        duration_seconds: elapsedSeconds,
      });
      setFeedback(response);
      setIsRecording(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit monologue");
    } finally {
      setSubmitting(false);
    }
  };

  const submitJournal = async () => {
    if (!selectedJournal || !journalText.trim()) return;

    setSubmitting(true);
    setError(null);
    try {
      const response = await apiClient.submitJournal({
        prompt_id: selectedJournal.prompt_id,
        content: journalText,
      });
      setFeedback(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit journal");
    } finally {
      setSubmitting(false);
    }
  };

  const backToList = () => {
    setViewMode("list");
    setSelectedMonologue(null);
    setSelectedJournal(null);
    setMonologueText("");
    setJournalText("");
    setElapsedSeconds(0);
    setIsRecording(false);
    setFeedback(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const countWords = (text: string) => {
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  const errorTypeColors: Record<string, string> = {
    grammar: "bg-red-500/10 text-red-300 border-red-500/30",
    vocab: "bg-purple-500/10 text-purple-300 border-purple-500/30",
    fluency: "bg-blue-500/10 text-blue-300 border-blue-500/30",
    structure: "bg-orange-500/10 text-orange-300 border-orange-500/30",
    pronunciation_placeholder: "bg-pink-500/10 text-pink-300 border-pink-500/30",
  };

  const levelColors: Record<string, string> = {
    A1: "bg-green-500/20 text-green-300 border-green-500/30",
    A2: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    B1: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    B2: "bg-orange-500/20 text-orange-300 border-orange-500/30",
    C1: "bg-red-500/20 text-red-300 border-red-500/30",
  };

  if (loading && (monologuePrompts.length === 0 && journalPrompts.length === 0)) {
    return (
      <div className="max-w-5xl mx-auto p-6 text-center">
        <div className="text-white/60">Loading drills...</div>
      </div>
    );
  }

  // List View
  if (viewMode === "list") {
    return (
      <div className="max-w-[1200px] mx-auto px-8 space-y-8">
        <div className="text-center mb-[80px]">
          <h2 className="text-6xl font-bold text-gray-900 mb-8">
            Practice Drills
          </h2>
          <p className="text-lg text-gray-600">
            Focused practice for speaking and writing skills
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center justify-center gap-8">
          <button
            onClick={() => setDrillMode("monologue")}
            className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
              drillMode === "monologue"
                ? "bg-gray-900 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300"
            }`}
          >
            Monologue (Speaking)
          </button>
          <button
            onClick={() => setDrillMode("journal")}
            className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
              drillMode === "journal"
                ? "bg-gray-900 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300"
            }`}
          >
            Journal (Writing)
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-10">
            <p className="text-gray-900 text-lg">{error}</p>
          </div>
        )}

        {/* Monologue Prompts */}
        {drillMode === "monologue" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {monologuePrompts.map((prompt) => (
              <button
                key={prompt.prompt_id}
                onClick={() => startMonologue(prompt)}
                className="bg-white border border-gray-200 hover:border-gray-300 rounded-xl p-10 transition-all duration-300 text-left"
              >
                <div className="flex items-start justify-between mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 flex-1">
                    {prompt.text}
                  </h3>
                  <span className="text-sm font-medium px-2 py-1 rounded border border-gray-200 bg-gray-50 text-gray-900">
                    {prompt.level}
                  </span>
                </div>
                <div className="flex items-center justify-between text-lg text-gray-600">
                  <span className="capitalize">{prompt.category.replace(/_/g, " ")}</span>
                  <span>{formatTime(prompt.time_limit_seconds)}</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Journal Prompts */}
        {drillMode === "journal" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {journalPrompts.map((prompt) => (
              <button
                key={prompt.prompt_id}
                onClick={() => startJournal(prompt)}
                className="bg-white border border-gray-200 hover:border-gray-300 rounded-xl p-10 transition-all duration-300 text-left"
              >
                <div className="flex items-start justify-between mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 flex-1">
                    {prompt.text}
                  </h3>
                  <span className="text-sm font-medium px-2 py-1 rounded border border-gray-200 bg-gray-50 text-gray-900">
                    {prompt.level}
                  </span>
                </div>
                <div className="flex items-center justify-between text-lg text-gray-600">
                  <span className="capitalize">{prompt.category.replace(/_/g, " ")}</span>
                  <span>{prompt.min_words}+ words</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Active Drill View - Monologue
  if (drillMode === "monologue" && selectedMonologue) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={backToList}
            className="text-indigo-300 hover:text-indigo-200 font-medium"
          >
            ← Back to Drills
          </button>
          <span className={`text-sm font-medium px-3 py-1 rounded border ${levelColors[selectedMonologue.level] || "bg-white/[0.05] text-white/60 border-white/[0.08]"}`}>
            {selectedMonologue.level}
          </span>
        </div>

        {/* Prompt Card */}
        <div className="bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] p-7">
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-2xl font-bold text-white flex-1">
              🎙️ {selectedMonologue.text}
            </h2>
          </div>

          <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <p className="text-blue-200 text-sm">
              Speak for up to {formatTime(selectedMonologue.time_limit_seconds)}.
              Express your thoughts naturally and completely.
            </p>
          </div>

          {/* Timer */}
          <div className="text-center mb-6">
            <div className="text-6xl font-bold text-white mb-2">
              {formatTime(elapsedSeconds)}
            </div>
            <div className="text-sm text-white/50">
              Target: {formatTime(selectedMonologue.time_limit_seconds)}
            </div>
          </div>

          {/* Recording Controls */}
          <div className="mb-6 text-center">
            {!isRecording && !feedback && (
              <button
                onClick={() => setIsRecording(true)}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300"
              >
                Start Speaking
              </button>
            )}
            {isRecording && (
              <button
                onClick={() => setIsRecording(false)}
                className="px-8 py-4 bg-gradient-to-r from-red-500 to-rose-500 text-white font-semibold rounded-lg hover:from-red-600 hover:to-rose-600 transition-all duration-300"
              >
                Stop Recording
              </button>
            )}
          </div>

          {/* Transcript Input (placeholder for actual voice recording) */}
          {!isRecording && elapsedSeconds > 0 && !feedback && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-white/70 mb-2">
                Your Transcript (Type what you said)
              </label>
              <textarea
                value={monologueText}
                onChange={(e) => setMonologueText(e.target.value)}
                placeholder="Enter what you said during your monologue..."
                className="w-full p-3 bg-white/[0.05] border border-white/[0.12] rounded-lg text-white placeholder-white/30 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50"
                rows={6}
              />
              <div className="mt-2 text-sm text-white/50">
                Word count: {countWords(monologueText)}
              </div>
            </div>
          )}

          {/* Submit Button */}
          {!isRecording && elapsedSeconds > 0 && !feedback && (
            <button
              onClick={submitMonologue}
              disabled={!monologueText.trim() || submitting}
              className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
                !monologueText.trim() || submitting
                  ? "bg-white/[0.05] text-white/40 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-500 to-rose-500 text-white hover:from-indigo-600 hover:to-rose-600"
              }`}
            >
              {submitting ? "Analyzing..." : "Submit for Feedback"}
            </button>
          )}
        </div>

        {/* Feedback */}
        {feedback && (
          <div className="bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] p-7">
            <h3 className="text-xl font-bold text-white mb-4">📊 Feedback</h3>

            <div className="mb-4 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
              <p className="text-green-200">{feedback.message}</p>
            </div>

            <div className="mb-4 text-white/70">
              <strong>Word Count:</strong> {feedback.word_count} words in {formatTime(elapsedSeconds)}
            </div>

            {feedback.errors.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-white">Corrections ({feedback.errors.length}):</h4>
                {feedback.errors.map((error, idx) => (
                  <div
                    key={idx}
                    className={`p-3 border rounded-lg text-sm ${
                      errorTypeColors[error.type] || "bg-white/[0.05] text-white/70 border-white/[0.08]"
                    }`}
                  >
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs opacity-75 mb-1">You said:</p>
                        <p className="line-through">{error.user_sentence}</p>
                      </div>
                      <div>
                        <p className="text-xs opacity-75 mb-1">Better:</p>
                        <p className="font-medium">{error.corrected_sentence}</p>
                      </div>
                      <div className="pt-2 border-t border-current opacity-50">
                        <p className="text-xs italic">{error.explanation}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={backToList}
              className="mt-6 w-full py-3 bg-gradient-to-r from-indigo-500 to-rose-500 text-white rounded-lg font-semibold hover:from-indigo-600 hover:to-rose-600 transition-all duration-300"
            >
              Try Another Drill
            </button>
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

  // Active Drill View - Journal
  if (drillMode === "journal" && selectedJournal) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={backToList}
            className="text-indigo-300 hover:text-indigo-200 font-medium"
          >
            ← Back to Drills
          </button>
          <span className={`text-sm font-medium px-3 py-1 rounded border ${levelColors[selectedJournal.level] || "bg-white/[0.05] text-white/60 border-white/[0.08]"}`}>
            {selectedJournal.level}
          </span>
        </div>

        {/* Prompt Card */}
        <div className="bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] p-7">
          <h2 className="text-2xl font-bold text-white mb-4">
            ✍️ {selectedJournal.text}
          </h2>

          <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <p className="text-blue-200 text-sm">
              Write at least {selectedJournal.min_words} words.
              Take your time and express yourself clearly.
            </p>
          </div>

          {/* Writing Area */}
          {!feedback && (
            <div className="mb-6">
              <textarea
                value={journalText}
                onChange={(e) => setJournalText(e.target.value)}
                placeholder="Start writing your response here..."
                className="w-full p-4 bg-white/[0.05] border border-white/[0.12] rounded-lg text-white placeholder-white/30 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50"
                rows={12}
              />
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className={`${
                  countWords(journalText) >= selectedJournal.min_words
                    ? "text-green-400"
                    : "text-white/50"
                }`}>
                  Word count: {countWords(journalText)} / {selectedJournal.min_words} minimum
                </span>
              </div>
            </div>
          )}

          {/* Submit Button */}
          {!feedback && (
            <button
              onClick={submitJournal}
              disabled={!journalText.trim() || submitting}
              className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
                !journalText.trim() || submitting
                  ? "bg-white/[0.05] text-white/40 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-500 to-rose-500 text-white hover:from-indigo-600 hover:to-rose-600"
              }`}
            >
              {submitting ? "Analyzing..." : "Submit for Feedback"}
            </button>
          )}
        </div>

        {/* Feedback */}
        {feedback && (
          <div className="bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] p-7">
            <h3 className="text-xl font-bold text-white mb-4">📊 Feedback</h3>

            <div className="mb-4 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
              <p className="text-green-200">{feedback.message}</p>
            </div>

            <div className="mb-4 text-white/70">
              <strong>Word Count:</strong> {feedback.word_count} words
              {feedback.word_count >= selectedJournal.min_words && (
                <span className="ml-2 text-green-400">✓ Met minimum requirement</span>
              )}
            </div>

            {feedback.errors.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-white">Corrections ({feedback.errors.length}):</h4>
                {feedback.errors.map((error, idx) => (
                  <div
                    key={idx}
                    className={`p-3 border rounded-lg text-sm ${
                      errorTypeColors[error.type] || "bg-white/[0.05] text-white/70 border-white/[0.08]"
                    }`}
                  >
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs opacity-75 mb-1">You wrote:</p>
                        <p className="line-through">{error.user_sentence}</p>
                      </div>
                      <div>
                        <p className="text-xs opacity-75 mb-1">Better:</p>
                        <p className="font-medium">{error.corrected_sentence}</p>
                      </div>
                      <div className="pt-2 border-t border-current opacity-50">
                        <p className="text-xs italic">{error.explanation}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={backToList}
              className="mt-6 w-full py-3 bg-gradient-to-r from-indigo-500 to-rose-500 text-white rounded-lg font-semibold hover:from-indigo-600 hover:to-rose-600 transition-all duration-300"
            >
              Try Another Drill
            </button>
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

  return null;
}
