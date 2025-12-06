"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apiClient } from "@/lib/api-client";
import { ScenarioSummary, ScenarioDetail, TutorError } from "@/lib/types";
import { ArrowLeft, Send, MessageSquare, Target, CheckCircle, Sparkles, Users } from "lucide-react";

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
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-brand rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-btn-glow animate-pulse">
            <Users className="w-8 h-8 text-white" />
          </div>
          <p className="text-text-secondary">Loading scenarios...</p>
        </div>
      </div>
    );
  }

  // Scenarios List View
  if (viewMode === "list") {
    return (
      <div className="min-h-screen bg-dark px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold text-text-primary">Speaking Scenarios</h1>
          <p className="text-text-secondary mt-1">Practice real-life conversations</p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-4"
          >
            <p className="text-red-400">{error}</p>
          </motion.div>
        )}

        <div className="space-y-3">
          {scenarios.map((scenario, index) => (
            <motion.button
              key={scenario.scenario_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => loadScenario(scenario.scenario_id)}
              className="w-full glass gradient-border rounded-2xl p-5 text-left hover:bg-white/[0.03] transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-accent-purple/20 flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-accent-purple" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary">
                      {scenario.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs px-2 py-0.5 bg-accent-purple/20 text-accent-purple rounded-full">
                        {scenario.level_min}
                      </span>
                      <span className="text-text-muted text-xs">→</span>
                      <span className="text-xs px-2 py-0.5 bg-accent-pink/20 text-accent-pink rounded-full">
                        {scenario.level_max}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-text-secondary text-sm mb-3 line-clamp-2">
                {scenario.situation_description}
              </p>
              <div className="flex flex-wrap gap-2">
                {scenario.difficulty_tags.slice(0, 3).map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-dark-300 text-text-muted px-2 py-1 rounded-lg"
                  >
                    {tag.replace(/_/g, " ")}
                  </span>
                ))}
              </div>
            </motion.button>
          ))}
        </div>

        {scenarios.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 bg-dark-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-text-muted" />
            </div>
            <p className="text-text-muted">No scenarios available yet</p>
          </motion.div>
        )}
      </div>
    );
  }

  // Scenario Conversation View
  if (!selectedScenario) return null;

  return (
    <div className="min-h-screen bg-dark flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-dark-100/90 backdrop-blur-xl border-b border-white/[0.06] px-4 h-14 flex items-center gap-3">
        <button
          onClick={backToList}
          className="p-2 -ml-2 text-text-muted hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="font-semibold text-text-primary truncate">
            {selectedScenario.title}
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-xs text-accent-purple">{selectedScenario.level_min}</span>
            <span className="text-xs text-text-muted">→</span>
            <span className="text-xs text-accent-pink">{selectedScenario.level_max}</span>
          </div>
        </div>
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Scenario Context Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass gradient-border rounded-2xl p-5 space-y-4"
        >
          {/* Situation */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-semibold text-blue-300">Situation</h3>
            </div>
            <p className="text-blue-200/80 text-sm">{selectedScenario.situation_description}</p>
          </div>

          {/* Your Goal */}
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-green-400" />
              <h3 className="text-sm font-semibold text-green-300">Your Goal</h3>
            </div>
            <p className="text-green-200/80 text-sm">{selectedScenario.user_goal}</p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
            <span className="text-xs text-text-muted">
              Turn {currentTurn} • {Math.floor(conversation.length / 2)} exchanges
            </span>
          </div>
        </motion.div>

        {/* Conversation History */}
        <AnimatePresence>
          {conversation.map((turn, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`${
                turn.speaker === "user"
                  ? "ml-8"
                  : "mr-8"
              }`}
            >
              <div
                className={`rounded-2xl p-4 ${
                  turn.speaker === "user"
                    ? "bg-gradient-brand text-white"
                    : "glass gradient-border"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    turn.speaker === "user"
                      ? "bg-white/20"
                      : "bg-accent-purple/20"
                  }`}>
                    {turn.speaker === "user" ? "👤" : "🤖"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={turn.speaker === "user" ? "text-white" : "text-text-primary"}>
                      {turn.message}
                    </p>

                    {/* Show errors if any */}
                    {turn.errors && turn.errors.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <h4 className="text-xs font-semibold text-text-muted">
                          Corrections ({turn.errors.length}):
                        </h4>
                        {turn.errors.map((error, idx) => (
                          <div
                            key={idx}
                            className={`p-3 border rounded-xl text-sm ${
                              errorTypeColors[error.type] || "bg-white/[0.05] text-text-secondary border-white/[0.08]"
                            }`}
                          >
                            <div className="space-y-2">
                              <div>
                                <p className="text-xs opacity-75 mb-1">You said:</p>
                                <p className="line-through opacity-70">{error.user_sentence}</p>
                              </div>
                              <div>
                                <p className="text-xs opacity-75 mb-1">Better:</p>
                                <p className="font-medium">{error.corrected_sentence}</p>
                              </div>
                              <div className="pt-2 border-t border-current/20">
                                <p className="text-xs italic opacity-80">{error.explanation}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Scenario Complete Message */}
        {scenarioComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass gradient-border rounded-2xl p-6 text-center"
          >
            <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">
              Scenario Complete!
            </h3>
            <p className="text-text-secondary mb-4">
              Great job! You completed this conversation.
            </p>
            <button
              onClick={backToList}
              className="px-6 py-3 bg-gradient-brand text-white rounded-xl font-medium shadow-btn-glow hover:shadow-btn-glow-hover transition-all"
            >
              Try Another Scenario
            </button>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-500/10 border border-red-500/30 rounded-xl p-4"
          >
            <p className="text-red-400 text-sm">{error}</p>
          </motion.div>
        )}
      </div>

      {/* Input Area - Fixed at bottom */}
      {!scenarioComplete && (
        <div className="sticky bottom-0 bg-dark-100/90 backdrop-blur-xl border-t border-white/[0.06] p-4">
          <div className="flex gap-3">
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your response..."
              className="flex-1 px-4 py-3 bg-dark-200 border border-white/[0.08] rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-purple/50 focus:border-accent-purple/50 resize-none disabled:opacity-50 transition-all"
              rows={2}
              disabled={submitting}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submitResponse();
                }
              }}
            />
            <button
              onClick={submitResponse}
              disabled={!userInput.trim() || submitting}
              className={`px-4 rounded-xl font-semibold transition-all ${
                !userInput.trim() || submitting
                  ? "bg-dark-300 text-text-muted"
                  : "bg-gradient-brand text-white shadow-btn-glow hover:shadow-btn-glow-hover"
              }`}
            >
              {submitting ? (
                <Sparkles className="w-5 h-5 animate-pulse" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
