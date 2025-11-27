"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { ScenarioSummary, ScenarioDetail, TutorError } from "@/lib/types";

type ViewMode = "list" | "scenario";

interface ConversationTurn {
  speaker: "user" | "ai";
  message: string;
  errors?: TutorError[];
}

export default function ScenariosPanel() {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [scenarios, setScenarios] = useState<ScenarioSummary[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<ScenarioDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Conversation state
  const [conversation, setConversation] = useState<ConversationTurn[]>([]);
  const [currentTurn, setCurrentTurn] = useState(1);
  const [userInput, setUserInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [scenarioComplete, setScenarioComplete] = useState(false);

  // Load scenarios list on mount
  useEffect(() => {
    loadScenarios();
  }, []);

  const loadScenarios = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.getScenarios();
      setScenarios(response.scenarios);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load scenarios");
    } finally {
      setLoading(false);
    }
  };

  const loadScenario = async (scenarioId: string) => {
    setLoading(true);
    setError(null);
    try {
      const scenario = await apiClient.getScenario(scenarioId);
      setSelectedScenario(scenario);
      setConversation([]);
      setCurrentTurn(1);
      setUserInput("");
      setScenarioComplete(false);
      setViewMode("scenario");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load scenario");
    } finally {
      setLoading(false);
    }
  };

  const submitResponse = async () => {
    if (!selectedScenario || !userInput.trim()) return;

    setSubmitting(true);
    setError(null);
    try {
      const response = await apiClient.submitScenarioResponse(selectedScenario.scenario_id, {
        user_input: userInput,
        turn_number: currentTurn,
      });

      // Add user message to conversation
      const userTurn: ConversationTurn = {
        speaker: "user",
        message: userInput,
      };

      // Add AI response to conversation
      const aiTurn: ConversationTurn = {
        speaker: "ai",
        message: response.tutor_message,
        errors: response.errors,
      };

      setConversation((prev) => [...prev, userTurn, aiTurn]);
      setCurrentTurn(response.turn_number);
      setUserInput("");

      // Check if scenario is complete based on AI evaluation
      if (response.scenario_complete) {
        setScenarioComplete(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit response");
    } finally {
      setSubmitting(false);
    }
  };

  const backToList = () => {
    setViewMode("list");
    setSelectedScenario(null);
    setConversation([]);
    setCurrentTurn(1);
    setUserInput("");
    setScenarioComplete(false);
  };

  const errorTypeColors: Record<string, string> = {
    grammar: "bg-red-500/10 text-red-300 border-red-500/30",
    vocab: "bg-purple-500/10 text-purple-300 border-purple-500/30",
    fluency: "bg-blue-500/10 text-blue-300 border-blue-500/30",
    structure: "bg-orange-500/10 text-orange-300 border-orange-500/30",
    pronunciation_placeholder: "bg-pink-500/10 text-pink-300 border-pink-500/30",
  };

  if (loading && !selectedScenario) {
    return (
      <div className="max-w-5xl mx-auto p-6 text-center">
        <div className="text-white/60">Loading scenarios...</div>
      </div>
    );
  }

  // Scenarios List View
  if (viewMode === "list") {
    return (
      <div className="max-w-[1200px] mx-auto px-8 space-y-8">
        <div className="text-center mb-[80px]">
          <h2 className="text-6xl font-bold text-gray-900 mb-8">
            Speaking Scenarios
          </h2>
          <p className="text-lg text-gray-600">
            Practice real-life conversations with AI roleplay
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-10">
            <p className="text-gray-900 text-lg">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {scenarios.map((scenario) => (
            <button
              key={scenario.scenario_id}
              onClick={() => loadScenario(scenario.scenario_id)}
              className="bg-white border border-gray-200 hover:border-gray-300 rounded-xl p-10 transition-all duration-300 text-left"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-white">
                  {scenario.title}
                </h3>
                <div className="flex gap-1.5">
                  <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-medium px-2 py-0.5 rounded">
                    {scenario.level_min}
                  </span>
                  <span className="text-white/30 text-xs px-1">→</span>
                  <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-medium px-2 py-0.5 rounded">
                    {scenario.level_max}
                  </span>
                </div>
              </div>
              <p className="text-white/70 text-sm mb-3">
                {scenario.situation_description}
              </p>
              <div className="flex flex-wrap gap-2">
                {scenario.difficulty_tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-white/[0.05] text-white/60 px-2 py-1 rounded border border-white/[0.08]"
                  >
                    {tag.replace(/_/g, " ")}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Scenario Conversation View
  if (!selectedScenario) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header with back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={backToList}
          className="text-indigo-300 hover:text-indigo-200 font-medium"
        >
          ← Back to Scenarios
        </button>
        <div className="flex gap-1.5">
          <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-sm font-medium px-3 py-1 rounded">
            {selectedScenario.level_min}
          </span>
          <span className="text-white/30 text-sm">→</span>
          <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 text-sm font-medium px-3 py-1 rounded">
            {selectedScenario.level_max}
          </span>
        </div>
      </div>

      {/* Scenario Title and Description */}
      <div className="bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] p-7">
        <h2 className="text-2xl font-bold text-white mb-4">
          {selectedScenario.title}
        </h2>

        <div className="mb-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl backdrop-blur-sm">
          <h3 className="font-semibold text-blue-300 mb-2">Situation:</h3>
          <p className="text-blue-200">{selectedScenario.situation_description}</p>
        </div>

        <div className="mb-4 p-4 bg-green-500/10 border border-green-500/20 rounded-xl backdrop-blur-sm">
          <h3 className="font-semibold text-green-300 mb-2">Your Goal:</h3>
          <p className="text-green-200">{selectedScenario.user_goal}</p>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold text-white/80 mb-2">Task:</h3>
          <p className="text-white/70">{selectedScenario.task}</p>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-white/80 mb-2">Success Criteria:</h3>
          <p className="text-white/70">{selectedScenario.success_criteria}</p>
        </div>

        <div className="text-sm text-white/50">
          Turn {currentTurn} • {conversation.length / 2} exchanges so far
        </div>
      </div>

      {/* Conversation History */}
      {conversation.length > 0 && (
        <div className="space-y-4">
          {conversation.map((turn, index) => (
            <div
              key={index}
              className={`p-5 rounded-2xl ${
                turn.speaker === "user"
                  ? "bg-indigo-500/10 border border-indigo-500/20 ml-8"
                  : "bg-white/[0.03] border border-white/[0.08] mr-8"
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {turn.speaker === "user" ? (
                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-sm">
                      👤
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center text-sm">
                      🤖
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-white/90 mb-2">{turn.message}</p>

                  {/* Show errors if any */}
                  {turn.errors && turn.errors.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <h4 className="text-sm font-semibold text-white/70">
                        Corrections ({turn.errors.length}):
                      </h4>
                      {turn.errors.map((error, idx) => (
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
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Input Area */}
      {!scenarioComplete ? (
        <div className="bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] p-7">
          <div className="mb-4">
            <label className="block text-sm font-medium text-white/70 mb-2">
              Your Response
            </label>
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your response here..."
              className="w-full p-3 bg-white/[0.05] border border-white/[0.12] rounded-lg text-white placeholder-white/30 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 disabled:opacity-50"
              rows={3}
              disabled={submitting}
            />
          </div>

          <button
            onClick={submitResponse}
            disabled={!userInput.trim() || submitting}
            className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
              !userInput.trim() || submitting
                ? "bg-white/[0.05] text-white/40 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-500 to-rose-500 text-white hover:from-indigo-600 hover:to-rose-600"
            }`}
          >
            {submitting ? "Sending..." : "Send Response"}
          </button>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-xl backdrop-blur-sm p-6 text-center">
          <h3 className="text-xl font-bold text-white mb-2">
            🎉 Scenario Complete!
          </h3>
          <p className="text-white/70 mb-4">
            Great job! You completed this conversation scenario.
          </p>
          <button
            onClick={backToList}
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-rose-500 text-white rounded-lg font-semibold hover:from-indigo-600 hover:to-rose-600 transition-all duration-300"
          >
            Try Another Scenario
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
