"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useTrialStatus } from "@/hooks/useTrialStatus";
import { MobileAppShell } from "@/components/mobile-app-shell";
import { Paywall } from "@/components/paywall";
import { AIChatInput } from "@/components/ui/ai-chat-input";
import { apiClient } from "@/lib/api-client";
import { TutorTextResponse, TutorError } from "@/lib/types";
import { VoiceWaveformLarge } from "@/components/voice";
import {
  Sparkles,
  AlertCircle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  MessageCircle,
  Zap,
  Bot,
  Mic,
  Square,
  Volume2,
  VolumeX,
  Loader2,
} from "lucide-react";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  errors?: TutorError[];
  microTask?: string | null;
  timestamp: Date;
  audioBase64?: string;
  isVoiceInput?: boolean;
}

type RecordingState = "idle" | "recording" | "processing";

export default function TutorPage() {
  const { user } = useAuth();
  const { hasAccess } = useTrialStatus();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Voice-related state
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [recordingTime, setRecordingTime] = useState(0);
  const [autoPlayResponses, setAutoPlayResponses] = useState(false);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);

  // Voice-related refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!user) {
      router.push("/get-started");
    }
  }, [user, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Cleanup effect for voice
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
      if (mediaRecorderRef.current && recordingState === "recording") {
        mediaRecorderRef.current.stop();
      }
    };
  }, [recordingState]);

  const handleSend = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await apiClient.submitText({
        text: text.trim(),
        session_id: sessionId || undefined,
      });

      setSessionId(response.session_id);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: response.message,
        errors: response.errors,
        microTask: response.micro_task,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Tutor error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: "Sorry, I couldn't process that. Let's try again!",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const startRecording = async () => {
    if (loading || recordingState !== "idle") return;

    try {
      audioChunksRef.current = [];
      setRecordingTime(0);

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 48000,
          channelCount: 1,
        },
      });

      const mimeType = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "audio/mp4";

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        await processRecording();
      };

      mediaRecorder.start(100);
      setRecordingState("recording");

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Recording error:", err);
      alert("Could not access microphone. Please allow microphone access.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recordingState === "recording") {
      mediaRecorderRef.current.stop();
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const processRecording = async () => {
    setRecordingState("processing");
    setLoading(true);

    try {
      const mimeType = audioChunksRef.current[0]?.type || "audio/webm";
      const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });

      if (audioBlob.size === 0) {
        throw new Error("Recording is empty. Please try again.");
      }

      const fileExtension = mimeType.includes("webm") ? "webm" : "mp4";
      const audioFile = new File([audioBlob], `recording.${fileExtension}`, {
        type: mimeType,
      });

      const formData = new FormData();
      formData.append("file", audioFile);

      const result = await apiClient.tutorVoice(formData);

      // Add user message with transcript
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        type: "user",
        content: result.transcript,
        isVoiceInput: true,
        timestamp: new Date(),
      };

      // Check if there are errors and add them
      const errors = result.tutor_response.errors && result.tutor_response.errors.length > 0
        ? result.tutor_response.errors
        : undefined;

      // Add assistant message with audio
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        type: "assistant",
        content: result.tutor_response.message,
        errors: errors,
        microTask: result.tutor_response.micro_task,
        audioBase64: result.audio_base64 || undefined,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage, assistantMessage]);

      // Auto-play if enabled
      if (autoPlayResponses && result.audio_base64) {
        setTimeout(() => {
          playAudio(assistantMessage.id, result.audio_base64!);
        }, 500);
      }
    } catch (err) {
      console.error("Processing error:", err);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: "Sorry, I couldn't process your voice input. Please try again!",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setRecordingState("idle");
      setLoading(false);
    }
  };

  const playAudio = (messageId: string, audioBase64: string) => {
    if (isPlaying === messageId) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
      setIsPlaying(null);
      return;
    }

    const audioData = `data:audio/mp3;base64,${audioBase64}`;
    const audio = new Audio(audioData);
    audioRef.current = audio;

    audio.onplay = () => setIsPlaying(messageId);
    audio.onended = () => setIsPlaying(null);
    audio.onerror = () => {
      setIsPlaying(null);
      console.error("Failed to play audio");
    };

    audio.play().catch(() => console.error("Failed to play audio"));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!user) return null;

  if (!hasAccess) {
    return (
      <MobileAppShell hideNav>
        <Paywall />
      </MobileAppShell>
    );
  }

  return (
    <MobileAppShell>
      <div className="flex flex-col h-[calc(100vh-8rem)] bg-dark">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {messages.length === 0 ? (
            <EmptyState onSuggestionClick={handleSend} />
          ) : (
            <div className="space-y-4 max-w-2xl mx-auto">
              <AnimatePresence>
                {messages.map((message, index) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    isLatest={index === messages.length - 1}
                    onPlayAudio={
                      message.audioBase64
                        ? () => playAudio(message.id, message.audioBase64!)
                        : undefined
                    }
                    isPlaying={isPlaying === message.id}
                  />
                ))}
              </AnimatePresence>

              {loading && recordingState === "idle" && <TypingIndicator />}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="bg-dark-100/50 backdrop-blur-xl border-t border-white/[0.06]">
          {/* Recording overlay */}
          <AnimatePresence>
            {recordingState === "recording" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="px-4 pt-4 pb-2"
              >
                <div className="glass rounded-2xl p-6 flex flex-col items-center">
                  <VoiceWaveformLarge isRecording={true} />
                  <p className="text-2xl font-bold text-text-primary my-4">
                    {formatTime(recordingTime)}
                  </p>
                  <button
                    onClick={stopRecording}
                    className="w-14 h-14 bg-red-500 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/30 active:scale-95 transition-transform"
                  >
                    <Square className="w-5 h-5 text-white fill-white" />
                  </button>
                  <p className="text-sm text-text-muted mt-3">Tap to stop recording</p>
                </div>
              </motion.div>
            )}

            {recordingState === "processing" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="px-4 pt-4 pb-2"
              >
                <div className="glass rounded-2xl p-6 flex flex-col items-center">
                  <div className="w-16 h-16 bg-gradient-brand rounded-full flex items-center justify-center shadow-btn-glow mb-4">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  </div>
                  <p className="text-text-secondary">Processing your voice...</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Regular input area */}
          {recordingState === "idle" && (
            <div className="p-4">
              {/* Auto-play toggle */}
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-xs text-text-muted">Voice Options</span>
                <button
                  onClick={() => setAutoPlayResponses(!autoPlayResponses)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all ${
                    autoPlayResponses
                      ? "bg-accent-purple/20 text-accent-purple"
                      : "bg-dark-200/50 text-text-muted hover:text-text-secondary"
                  }`}
                >
                  {autoPlayResponses ? (
                    <>
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Auto-play responses</span>
                    </>
                  ) : (
                    <>
                      <VolumeX className="w-3.5 h-3.5" />
                      <span>Auto-play off</span>
                    </>
                  )}
                </button>
              </div>

              {/* Input with mic button */}
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <AIChatInput
                    onSend={handleSend}
                    isLoading={loading}
                    disabled={loading || recordingState !== "idle"}
                  />
                </div>
                <button
                  onClick={startRecording}
                  disabled={loading || recordingState !== "idle"}
                  className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                    loading || recordingState !== "idle"
                      ? "bg-dark-300 text-text-muted cursor-not-allowed"
                      : "bg-gradient-brand text-white shadow-btn-glow hover:shadow-btn-glow-hover active:scale-95"
                  }`}
                >
                  <Mic className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </MobileAppShell>
  );
}

function EmptyState({ onSuggestionClick }: { onSuggestionClick: (text: string) => void }) {
  const suggestions = [
    { text: "Tell me about your day", icon: MessageCircle },
    { text: "Help me practice ordering food", icon: Sparkles },
    { text: "What are common English mistakes?", icon: Lightbulb },
  ];

  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-6">
      {/* Animated Logo */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 15 }}
        className="relative mb-6"
      >
        <div className="absolute inset-0 bg-gradient-brand rounded-3xl blur-2xl opacity-50" />
        <div className="relative w-20 h-20 bg-gradient-brand rounded-3xl flex items-center justify-center shadow-btn-glow">
          <Bot className="w-10 h-10 text-white" />
        </div>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-2xl font-bold text-text-primary mb-2"
      >
        Hi! I'm your AI Tutor
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-text-secondary mb-8 max-w-sm"
      >
        Practice your English with me! I'll help you improve your grammar, vocabulary, and fluency.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-3 w-full max-w-sm"
      >
        {suggestions.map((suggestion, index) => {
          const Icon = suggestion.icon;
          return (
            <motion.button
              key={suggestion.text}
              onClick={() => onSuggestionClick(suggestion.text)}
              className="w-full p-4 glass rounded-2xl text-sm text-text-secondary hover:text-text-primary hover:bg-dark-200/50 transition-all duration-300 text-left flex items-center gap-3 group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-10 h-10 rounded-xl bg-dark-300 group-hover:bg-accent-purple/20 flex items-center justify-center transition-colors">
                <Icon className="w-5 h-5 text-text-muted group-hover:text-accent-purple transition-colors" />
              </div>
              <span>{suggestion.text}</span>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}

function MessageBubble({
  message,
  isLatest,
  onPlayAudio,
  isPlaying
}: {
  message: Message;
  isLatest: boolean;
  onPlayAudio?: () => void;
  isPlaying?: boolean;
}) {
  const isUser = message.type === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      {isUser ? (
        <div className="max-w-[85%]">
          <div className="bg-gradient-brand text-white rounded-2xl rounded-br-md px-4 py-3 shadow-btn-glow">
            <p className="text-[15px] leading-relaxed">{message.content}</p>
            {message.isVoiceInput && (
              <div className="flex items-center gap-1 mt-2 text-white/70">
                <Mic className="w-3 h-3" />
                <span className="text-[10px]">Voice input</span>
              </div>
            )}
          </div>
          <p className="text-[10px] text-text-muted mt-1 text-right">
            {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
      ) : (
        <div className="max-w-[85%] space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-brand flex items-center justify-center flex-shrink-0 shadow-btn-glow">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="glass rounded-2xl rounded-tl-md px-4 py-3">
                <p className="text-text-primary text-[15px] leading-relaxed">{message.content}</p>
                {message.audioBase64 && onPlayAudio && (
                  <button
                    onClick={onPlayAudio}
                    className="flex items-center gap-2 mt-3 px-3 py-1.5 rounded-lg bg-accent-purple/20 hover:bg-accent-purple/30 transition-colors text-accent-purple text-sm"
                  >
                    {isPlaying ? (
                      <>
                        <Volume2 className="w-4 h-4 animate-pulse" />
                        <span>Playing...</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4" />
                        <span>Listen</span>
                      </>
                    )}
                  </button>
                )}
              </div>
              <p className="text-[10px] text-text-muted mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>

          {/* Errors */}
          {message.errors && message.errors.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="ml-11"
            >
              <ErrorFeedback errors={message.errors} />
            </motion.div>
          )}

          {/* Micro Task */}
          {message.microTask && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="ml-11"
            >
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-amber-300 text-sm">Try this</p>
                    <p className="text-amber-200/80 text-sm">{message.microTask}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  );
}

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex justify-start"
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-brand flex items-center justify-center flex-shrink-0 shadow-btn-glow">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div className="glass rounded-2xl rounded-tl-md px-4 py-3">
          <div className="flex gap-1.5 items-center">
            <motion.span
              className="w-2 h-2 bg-accent-purple rounded-full"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0 }}
            />
            <motion.span
              className="w-2 h-2 bg-accent-purple rounded-full"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
            />
            <motion.span
              className="w-2 h-2 bg-accent-purple rounded-full"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ErrorFeedback({ errors }: { errors: TutorError[] }) {
  const [expanded, setExpanded] = useState(true);

  if (errors.length === 0) return null;

  return (
    <div className="bg-red-500/10 border border-red-500/30 rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-red-500/5 transition-colors"
      >
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <span className="font-semibold text-red-300 text-sm">
            {errors.length} {errors.length === 1 ? "correction" : "corrections"}
          </span>
        </div>
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-red-400" />
        </motion.div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4">
              {errors.map((error, idx) => (
                <div key={idx} className="text-sm space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-red-400 line-through opacity-70">{error.user_sentence}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-green-300">{error.corrected_sentence}</span>
                  </div>
                  <p className="text-text-muted text-xs pl-6 leading-relaxed">{error.explanation}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
