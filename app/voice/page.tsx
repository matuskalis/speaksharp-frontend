"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Mic, Square, Loader2, Sparkles } from "lucide-react";
import { MobileAppShell } from "@/components/mobile-app-shell";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/api-client";
import {
  VoiceModeSelector,
  VoiceWaveformLarge,
  ConversationBubble,
  TypingIndicator,
} from "@/components/voice";
import type { VoiceMode, Scenario } from "@/components/voice";

interface Message {
  id: string;
  role: "user" | "tutor";
  content: string;
  correction?: {
    original: string;
    corrected: string;
    explanation: string;
  };
  audioBase64?: string;
}

type RecordingState = "idle" | "recording" | "processing";

export default function VoicePage() {
  const router = useRouter();
  const { user } = useAuth();

  // Mode state
  const [mode, setMode] = useState<VoiceMode | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);

  // Conversation state
  const [messages, setMessages] = useState<Message[]>([]);
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  const handleSelectMode = (selectedMode: VoiceMode) => {
    setMode(selectedMode);
    if (selectedMode === "free") {
      setMessages([
        {
          id: "intro",
          role: "tutor",
          content: "Hi! I'm your English tutor. Talk to me about anything - your day, your hobbies, or practice specific topics. I'll help you improve your speaking skills and correct any mistakes. Just tap the microphone to start!",
        },
      ]);
    }
  };

  const handleSelectScenario = (scenario: Scenario) => {
    setMode("scenario");
    setSelectedScenario(scenario);
    setMessages([
      {
        id: "scenario-intro",
        role: "tutor",
        content: `Let's practice a "${scenario.title}" scenario. ${scenario.description}. I'll play my role and help you practice natural conversation. Tap the microphone when you're ready!`,
      },
    ]);
  };

  const handleBack = () => {
    if (mode) {
      setMode(null);
      setSelectedScenario(null);
      setMessages([]);
      setError(null);
    } else {
      router.push("/learn");
    }
  };

  const startRecording = async () => {
    try {
      setError(null);
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
      setError("Could not access microphone. Please allow microphone access.");
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

      if (selectedScenario) {
        formData.append("scenario_context", selectedScenario.prompt);
      }

      const result = await apiClient.tutorVoice(formData);

      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content: result.transcript,
      };

      const correction = result.tutor_response.errors?.[0];
      if (correction) {
        userMessage.correction = {
          original: correction.user_sentence,
          corrected: correction.corrected_sentence,
          explanation: correction.explanation,
        };
      }

      const tutorMessage: Message = {
        id: `tutor-${Date.now()}`,
        role: "tutor",
        content: result.tutor_response.message,
        audioBase64: result.audio_base64 || undefined,
      };

      setMessages((prev) => [...prev, userMessage, tutorMessage]);
      setRecordingState("idle");
    } catch (err) {
      console.error("Processing error:", err);
      setError("Failed to process audio. Please try again.");
      setRecordingState("idle");
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
      setError("Failed to play audio.");
    };

    audio.play().catch(() => setError("Failed to play audio."));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!user) {
    return (
      <MobileAppShell>
        <div className="p-4 text-center">
          <p className="text-text-muted">Sign in to access Voice Tutor</p>
        </div>
      </MobileAppShell>
    );
  }

  return (
    <MobileAppShell hideNav={mode !== null}>
      <div className="min-h-screen bg-dark flex flex-col">
        {/* Header when in conversation */}
        {mode !== null && (
          <header className="sticky top-0 z-40 bg-dark-100/90 backdrop-blur-xl border-b border-white/[0.06] px-4 h-14 flex items-center gap-3">
            <button
              onClick={handleBack}
              className="p-2 -ml-2 text-text-muted hover:text-text-primary transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="font-semibold text-text-primary">
                {selectedScenario ? selectedScenario.title : "Free Conversation"}
              </h1>
              {selectedScenario && (
                <p className="text-xs text-text-muted">{selectedScenario.description}</p>
              )}
            </div>
          </header>
        )}

        {/* Mode Selection */}
        {mode === null && (
          <div className="flex-1 px-4 py-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <h1 className="text-2xl font-bold text-text-primary">Voice Tutor</h1>
              <p className="text-text-secondary mt-1">Practice speaking with AI feedback</p>
            </motion.div>

            <VoiceModeSelector
              onSelectMode={handleSelectMode}
              onSelectScenario={handleSelectScenario}
            />
          </div>
        )}

        {/* Conversation View */}
        {mode !== null && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {messages.map((message) => (
                <ConversationBubble
                  key={message.id}
                  message={message}
                  onPlayAudio={
                    message.audioBase64
                      ? () => playAudio(message.id, message.audioBase64!)
                      : undefined
                  }
                  isPlaying={isPlaying === message.id}
                />
              ))}

              {recordingState === "processing" && <TypingIndicator />}

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-4"
                >
                  <p className="text-sm text-red-400">{error}</p>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Recording Controls */}
            <div className="sticky bottom-0 bg-gradient-to-t from-dark via-dark to-transparent pt-8 pb-8 px-4">
              <AnimatePresence mode="wait">
                {recordingState === "idle" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="flex flex-col items-center"
                  >
                    <button
                      onClick={startRecording}
                      className="w-20 h-20 bg-gradient-brand rounded-full flex items-center justify-center shadow-btn-glow hover:shadow-btn-glow-hover active:scale-95 transition-all"
                    >
                      <Mic className="w-8 h-8 text-white" />
                    </button>
                    <p className="text-sm text-text-muted mt-3">Tap to speak</p>
                  </motion.div>
                )}

                {recordingState === "recording" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-center"
                  >
                    <VoiceWaveformLarge isRecording={true} />

                    <p className="text-2xl font-bold text-text-primary my-4">
                      {formatTime(recordingTime)}
                    </p>

                    <button
                      onClick={stopRecording}
                      className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/30 active:scale-95 transition-transform"
                    >
                      <Square className="w-6 h-6 text-white fill-white" />
                    </button>
                    <p className="text-sm text-text-muted mt-3">Tap to stop</p>
                  </motion.div>
                )}

                {recordingState === "processing" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center py-6"
                  >
                    <div className="w-16 h-16 bg-gradient-brand rounded-full flex items-center justify-center shadow-btn-glow">
                      <Sparkles className="w-8 h-8 text-white animate-pulse" />
                    </div>
                    <p className="text-text-secondary mt-4">Analyzing your speech...</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>
    </MobileAppShell>
  );
}
