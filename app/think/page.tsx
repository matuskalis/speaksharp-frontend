"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Send,
  Loader2,
  Brain,
  MessageCircle,
  CheckCircle,
  Sparkles,
  AlertCircle,
  Trophy,
} from "lucide-react";
import { MobileAppShell } from "@/components/mobile-app-shell";
import { useAuth } from "@/contexts/AuthContext";
import { useGamification } from "@/contexts/GamificationContext";
import { apiClient } from "@/lib/api-client";
import { ThinkingCorrection, ThinkingSummary } from "@/lib/types";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  correction?: ThinkingCorrection | null;
}

type SessionState = "intro" | "conversation" | "summary";

export default function ThinkPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { addXP, triggerXPPopup, triggerConfetti } = useGamification();

  // Session state
  const [sessionState, setSessionState] = useState<SessionState>("intro");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [maxTurns, setMaxTurns] = useState(10);
  const [summary, setSummary] = useState<ThinkingSummary | null>(null);

  // Input state
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  const startSession = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.startThinkingSession();
      setSessionId(response.session_id);
      setCurrentTurn(response.current_turn);
      setMaxTurns(response.max_turns);
      setMessages([
        {
          id: "ai-0",
          role: "ai",
          content: response.ai_message,
        },
      ]);
      setSessionState("conversation");
    } catch (err) {
      console.error("Failed to start session:", err);
      setError("Failed to start session. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim() || !sessionId || isLoading) return;

    const userMessage = inputText.trim();
    setInputText("");
    setIsLoading(true);
    setError(null);

    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        role: "user",
        content: userMessage,
      },
    ]);

    try {
      const response = await apiClient.respondThinkingSession({
        session_id: sessionId,
        user_message: userMessage,
      });

      // Add AI response
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          role: "ai",
          content: response.ai_message,
          correction: response.correction,
        },
      ]);

      setCurrentTurn(response.current_turn);

      // Check if session is complete
      if (response.is_complete && response.summary) {
        setSummary(response.summary);
        setSessionState("summary");
        // Award XP from Think session
        if (response.summary.xp_earned > 0) {
          addXP(response.summary.xp_earned);
          triggerXPPopup(response.summary.xp_earned);
          triggerConfetti();
        }
      }
    } catch (err) {
      console.error("Failed to send message:", err);
      setError("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const endSessionEarly = async () => {
    if (!sessionId) return;

    setIsLoading(true);
    try {
      const response = await apiClient.endThinkingSession(sessionId);
      setSummary(response.summary);
      setSessionState("summary");
      // Award XP from Think session (if earned)
      if (response.summary.xp_earned > 0) {
        addXP(response.summary.xp_earned);
        triggerXPPopup(response.summary.xp_earned);
        triggerConfetti();
      }
    } catch (err) {
      console.error("Failed to end session:", err);
      setError("Failed to end session.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!user) {
    return (
      <MobileAppShell>
        <div className="p-4 text-center">
          <p className="text-text-muted">Sign in to access Think in English</p>
        </div>
      </MobileAppShell>
    );
  }

  return (
    <MobileAppShell hideNav={sessionState !== "intro"}>
      <div className="min-h-screen bg-dark flex flex-col">
        {/* Header */}
        {sessionState !== "intro" && (
          <header className="sticky top-0 z-40 bg-dark-100/90 backdrop-blur-xl border-b border-white/[0.06] px-4 h-14 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/learn")}
                className="p-2 -ml-2 text-text-muted hover:text-text-primary transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="font-semibold text-text-primary">Think in English</h1>
                {sessionState === "conversation" && (
                  <p className="text-xs text-text-muted">
                    Turn {currentTurn}/{maxTurns}
                  </p>
                )}
              </div>
            </div>
            {sessionState === "conversation" && (
              <button
                onClick={endSessionEarly}
                disabled={isLoading}
                className="text-sm text-text-muted hover:text-text-primary transition-colors"
              >
                End early
              </button>
            )}
          </header>
        )}

        {/* Intro Screen */}
        {sessionState === "intro" && (
          <div className="flex-1 px-4 py-8 flex flex-col">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 flex flex-col items-center justify-center text-center"
            >
              <div className="w-20 h-20 rounded-2xl bg-gradient-brand flex items-center justify-center shadow-btn-glow mb-6">
                <Brain className="w-10 h-10 text-white" />
              </div>

              <h1 className="text-2xl font-bold text-text-primary mb-2">
                Think in English
              </h1>
              <p className="text-text-secondary max-w-xs mb-8">
                Practice expressing your thoughts in English. Alex will ask you easy
                questions about your life - just answer naturally!
              </p>

              <div className="glass rounded-xl p-4 mb-8 max-w-xs">
                <div className="flex items-start gap-3 text-left">
                  <MessageCircle className="w-5 h-5 text-accent-purple shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      How it works
                    </p>
                    <ul className="text-xs text-text-secondary mt-1 space-y-1">
                      <li>Answer 10 simple questions</li>
                      <li>Questions are about YOU - no right or wrong</li>
                      <li>Get gentle corrections if needed</li>
                      <li>Earn XP for completing the session</li>
                    </ul>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-4 max-w-xs">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              <button
                onClick={startSession}
                disabled={isLoading}
                className="w-full max-w-xs py-4 bg-gradient-brand text-white rounded-xl font-semibold shadow-btn-glow hover:shadow-btn-glow-hover active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 mx-auto animate-spin" />
                ) : (
                  "Start Conversation"
                )}
              </button>
            </motion.div>
          </div>
        )}

        {/* Conversation View */}
        {sessionState === "conversation" && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <AnimatePresence initial={false}>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mb-4 flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                        message.role === "user"
                          ? "bg-gradient-brand text-white"
                          : "bg-dark-200 border border-white/[0.06]"
                      }`}
                    >
                      <p
                        className={
                          message.role === "user"
                            ? "text-white"
                            : "text-text-primary"
                        }
                      >
                        {message.content}
                      </p>

                      {/* Correction badge */}
                      {message.correction?.original && (
                        <div className="mt-3 pt-3 border-t border-white/10">
                          <div className="flex items-start gap-2">
                            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            <div className="text-sm">
                              <p className="text-text-muted line-through">
                                {message.correction.original}
                              </p>
                              <p className="text-green-400">
                                {message.correction.corrected}
                              </p>
                              {message.correction.note && (
                                <p className="text-xs text-text-muted mt-1">
                                  {message.correction.note}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start mb-4"
                >
                  <div className="bg-dark-200 border border-white/[0.06] rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-accent-purple rounded-full animate-bounce" />
                        <span className="w-2 h-2 bg-accent-purple rounded-full animate-bounce [animation-delay:0.15s]" />
                        <span className="w-2 h-2 bg-accent-purple rounded-full animate-bounce [animation-delay:0.3s]" />
                      </div>
                      <span className="text-sm text-text-muted">Alex is typing...</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-4"
                >
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="sticky bottom-0 bg-dark border-t border-white/[0.06] px-4 py-3">
              <div className="flex items-end gap-2">
                <div className="flex-1 bg-dark-200 border border-white/[0.06] rounded-xl overflow-hidden">
                  <textarea
                    ref={inputRef}
                    value={inputText}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your answer..."
                    disabled={isLoading}
                    rows={1}
                    className="w-full bg-transparent px-4 py-3 text-text-primary placeholder:text-text-muted resize-none focus:outline-none text-base"
                    style={{ maxHeight: "120px" }}
                  />
                </div>
                <button
                  onClick={sendMessage}
                  disabled={!inputText.trim() || isLoading}
                  className="w-12 h-12 bg-gradient-brand rounded-xl flex items-center justify-center shadow-btn-glow hover:shadow-btn-glow-hover active:scale-95 transition-all disabled:opacity-50 disabled:shadow-none shrink-0"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                  ) : (
                    <Send className="w-5 h-5 text-white" />
                  )}
                </button>
              </div>
              <p className="text-xs text-text-muted mt-2 text-center">
                Press Enter to send, Shift+Enter for new line
              </p>
            </div>
          </>
        )}

        {/* Summary Screen */}
        {sessionState === "summary" && summary && (
          <div className="flex-1 px-4 py-8 flex flex-col">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 flex flex-col items-center"
            >
              {/* Success Header */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-green-500/30 mb-6">
                <Trophy className="w-10 h-10 text-white" />
              </div>

              <h1 className="text-2xl font-bold text-text-primary mb-2">
                Great Conversation!
              </h1>
              <p className="text-text-secondary mb-6">
                You practiced thinking in English
              </p>

              {/* Stats */}
              <div className="glass gradient-border rounded-2xl p-6 w-full max-w-sm mb-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-text-primary">
                      {summary.total_turns}
                    </p>
                    <p className="text-xs text-text-muted">Turns</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-text-primary">
                      {summary.total_words}
                    </p>
                    <p className="text-xs text-text-muted">Words</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-accent-purple">
                      +{summary.xp_earned}
                    </p>
                    <p className="text-xs text-text-muted">XP</p>
                  </div>
                </div>
              </div>

              {/* Strengths */}
              {summary.strengths.length > 0 && (
                <div className="w-full max-w-sm mb-6">
                  <h2 className="text-sm font-semibold text-text-secondary mb-3">
                    Great job!
                  </h2>
                  <div className="space-y-2">
                    {summary.strengths.map((strength, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2"
                      >
                        <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                        <p className="text-sm text-green-300">{strength}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Corrections Review */}
              {summary.corrections.length > 0 && (
                <div className="w-full max-w-sm mb-6">
                  <h2 className="text-sm font-semibold text-text-secondary mb-3">
                    Things to remember
                  </h2>
                  <div className="space-y-2">
                    {summary.corrections.map((correction, i) => (
                      <div
                        key={i}
                        className="bg-dark-200/50 border border-white/[0.06] rounded-lg px-3 py-2"
                      >
                        <p className="text-sm text-text-muted line-through">
                          {correction.original}
                        </p>
                        <p className="text-sm text-green-400">
                          {correction.corrected}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="w-full max-w-sm space-y-3 mt-auto">
                <button
                  onClick={() => {
                    setSessionState("intro");
                    setMessages([]);
                    setSessionId(null);
                    setSummary(null);
                    setCurrentTurn(0);
                  }}
                  className="w-full py-4 bg-gradient-brand text-white rounded-xl font-semibold shadow-btn-glow hover:shadow-btn-glow-hover active:scale-[0.98] transition-all"
                >
                  Practice Again
                </button>
                <button
                  onClick={() => router.push("/learn")}
                  className="w-full py-4 bg-dark-200 border border-white/[0.06] text-text-primary rounded-xl font-semibold hover:bg-dark-300 transition-all"
                >
                  Back to Learn
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </MobileAppShell>
  );
}
