"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/api-client";
import { VoiceTutorResponse, TutorError } from "@/lib/types";
import { VERSION } from "@/lib/version";

type RecordingState = "idle" | "recording" | "processing" | "complete";

// Debug info for tech panel
interface DebugInfo {
  lastFileSizeBytes: number | null;
  lastMimeType: string | null;
  lastStatusCode: number | null;
  lastTranscript: string | null;
  lastError: string | null;
}

export default function VoiceTutorPanel() {
  const { user } = useAuth();
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<VoiceTutorResponse | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [browserSupported, setBrowserSupported] = useState<boolean>(true);
  const [supportError, setSupportError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({
    lastFileSizeBytes: null,
    lastMimeType: null,
    lastStatusCode: null,
    lastTranscript: null,
    lastError: null,
  });
  const [showDebug, setShowDebug] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const selectedMimeTypeRef = useRef<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Check browser capability on mount
  useEffect(() => {
    console.log("[VoiceTutor] Checking browser capabilities...");

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error("[VoiceTutor] navigator.mediaDevices.getUserMedia not available");
      setBrowserSupported(false);
      setSupportError("Your browser does not support audio recording. Please use Chrome or Safari on desktop.");
      return;
    }

    if (typeof MediaRecorder === "undefined") {
      console.error("[VoiceTutor] MediaRecorder API not available");
      setBrowserSupported(false);
      setSupportError("Your browser does not support MediaRecorder. Please use Chrome or Safari on desktop.");
      return;
    }

    // Test which MIME types are supported
    const mimeTypes = [
      "audio/webm",
      "audio/webm;codecs=opus",
      "audio/ogg;codecs=opus",
      "audio/mp4",
    ];

    let foundSupported = false;
    for (const mimeType of mimeTypes) {
      if (MediaRecorder.isTypeSupported(mimeType)) {
        console.log(`[VoiceTutor] Supported MIME type found: ${mimeType}`);
        selectedMimeTypeRef.current = mimeType;
        foundSupported = true;
        break;
      }
    }

    if (!foundSupported) {
      console.warn("[VoiceTutor] No preferred MIME type supported, will use browser default");
      selectedMimeTypeRef.current = null; // Let browser choose
    }

    console.log("[VoiceTutor] Browser capabilities check passed");
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      console.log("[VoiceTutor] Starting recording...");
      setError(null);
      audioChunksRef.current = [];
      setRecordingTime(0);

      // Request high-quality audio with specific constraints
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 48000,
          channelCount: 1,
        }
      });

      // Set up audio level monitoring
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      // Monitor audio levels
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const checkAudioLevel = () => {
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
        if (average > 5) {
          console.log(`[VoiceTutor] Audio level: ${average.toFixed(1)} (detecting sound)`);
        }
        animationFrameRef.current = requestAnimationFrame(checkAudioLevel);
      };
      checkAudioLevel();

      // Create MediaRecorder with defensive MIME type
      const mediaRecorderOptions = selectedMimeTypeRef.current
        ? { mimeType: selectedMimeTypeRef.current }
        : {}; // Let browser choose

      const mediaRecorder = new MediaRecorder(stream, mediaRecorderOptions);
      mediaRecorderRef.current = mediaRecorder;

      const actualMimeType = mediaRecorder.mimeType;
      console.log(`[VoiceTutor] MediaRecorder created with MIME: ${actualMimeType}`);
      setDebugInfo((prev) => ({ ...prev, lastMimeType: actualMimeType }));

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          console.log(`[VoiceTutor] Audio chunk received: ${event.data.size} bytes`);
        }
      };

      mediaRecorder.onstop = async () => {
        console.log("[VoiceTutor] Recording stopped");
        console.log(`[VoiceTutor] Collected ${audioChunksRef.current.length} audio chunks`);
        const totalBytes = audioChunksRef.current.reduce((sum, chunk) => sum + chunk.size, 0);
        console.log(`[VoiceTutor] Total audio data: ${totalBytes} bytes`);
        stream.getTracks().forEach((track) => track.stop());
        await processRecording();
      };

      // Request data every 100ms to ensure proper audio capture
      mediaRecorder.start(100);
      setRecordingState("recording");

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      console.log("[VoiceTutor] Recording started successfully");
    } catch (err) {
      console.error("[VoiceTutor] Error starting recording:", err);

      let errorMessage = "Failed to access microphone. Please grant permission.";

      if (err instanceof Error) {
        if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
          errorMessage = "Microphone access denied. Please allow microphone access in your browser settings and try again.";
        } else if (err.name === "NotFoundError") {
          errorMessage = "No microphone found. Please connect a microphone and try again.";
        } else if (err.name === "NotReadableError") {
          errorMessage = "Microphone is already in use by another application. Please close other apps using the microphone.";
        } else {
          errorMessage = `Recording error: ${err.message}`;
        }
      }

      setError(errorMessage);
      setDebugInfo((prev) => ({ ...prev, lastError: errorMessage }));
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recordingState === "recording") {
      console.log("[VoiceTutor] Stopping recording...");
      mediaRecorderRef.current.stop();
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      // Stop audio level monitoring
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    }
  };

  const processRecording = async () => {
    setRecordingState("processing");
    setError(null);

    try {
      console.log("[VoiceTutor] Processing recording...");

      const mimeType = selectedMimeTypeRef.current || "audio/webm";
      const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });

      const fileSizeBytes = audioBlob.size;
      const fileSizeKB = (fileSizeBytes / 1024).toFixed(2);
      console.log(`[VoiceTutor] Audio blob created: ${fileSizeBytes} bytes (${fileSizeKB} KB), MIME: ${mimeType}`);

      setDebugInfo((prev) => ({
        ...prev,
        lastFileSizeBytes: fileSizeBytes,
        lastMimeType: mimeType,
      }));

      if (fileSizeBytes === 0) {
        throw new Error("Recording is empty. Please try again and speak louder.");
      }

      // Convert to File object
      const fileExtension = mimeType.includes("webm") ? "webm" : "ogg";
      const audioFile = new File([audioBlob], `recording.${fileExtension}`, {
        type: mimeType,
      });

      console.log(`[VoiceTutor] Sending ${audioFile.size} bytes to backend...`);

      // Create FormData
      const formData = new FormData();
      formData.append("file", audioFile);

      // Send to backend
      const result = await apiClient.tutorVoice(formData);

      console.log("[VoiceTutor] Response received from backend");
      console.log(`[VoiceTutor] Transcript: ${result.transcript}`);

      setDebugInfo((prev) => ({
        ...prev,
        lastStatusCode: 200,
        lastTranscript: result.transcript,
        lastError: null,
      }));

      setResponse(result);
      setRecordingState("complete");
    } catch (err) {
      console.error("[VoiceTutor] Error processing recording:", err);

      let errorMessage = "Failed to process audio. Please try again.";
      let statusCode = null;

      if (err instanceof Error) {
        const errorStr = err.message || String(err);

        if (errorStr.includes("400") || errorStr.includes("invalid file format")) {
          errorMessage = "Invalid audio format. Your browser's recording format is not supported. Please try a different browser (Chrome or Safari recommended).";
          statusCode = 400;
        } else if (errorStr.includes("401") || errorStr.includes("unauthorized")) {
          errorMessage = "Authentication error. Please sign out and sign in again.";
          statusCode = 401;
        } else if (errorStr.includes("422")) {
          errorMessage = "Invalid request format. Please try again with a different browser.";
          statusCode = 422;
        } else if (errorStr.includes("500") || errorStr.includes("internal server")) {
          errorMessage = "Server error. The AI service may be temporarily unavailable. Please try again in a moment.";
          statusCode = 500;
        } else if (errorStr.includes("network") || errorStr.includes("fetch")) {
          errorMessage = "Network error. Please check your internet connection and try again.";
        } else {
          errorMessage = `Processing error: ${errorStr}`;
        }
      } else {
        errorMessage = `Processing error: ${JSON.stringify(err)}`;
      }

      setError(errorMessage);
      setDebugInfo((prev) => ({
        ...prev,
        lastStatusCode: statusCode,
        lastError: errorMessage,
      }));
      setRecordingState("idle");
    }
  };

  const playAudioResponse = () => {
    if (!response?.audio_base64) {
      setError("No audio response available from the server.");
      return;
    }

    try {
      console.log("[VoiceTutor] Playing audio response...");

      // Convert base64 to audio
      const audioData = `data:audio/mp3;base64,${response.audio_base64}`;

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }

      const audio = new Audio(audioData);
      audioRef.current = audio;

      audio.onplay = () => {
        console.log("[VoiceTutor] Audio playback started");
        setIsPlayingAudio(true);
      };
      audio.onended = () => {
        console.log("[VoiceTutor] Audio playback ended");
        setIsPlayingAudio(false);
      };
      audio.onerror = (e) => {
        console.error("[VoiceTutor] Audio playback error:", e);
        setIsPlayingAudio(false);
        setError("Failed to play audio response. The audio format may not be supported.");
      };

      audio.play().catch((e) => {
        console.error("[VoiceTutor] Audio play() failed:", e);
        setError("Failed to play audio. Please try again.");
      });
    } catch (err) {
      console.error("[VoiceTutor] Error setting up audio playback:", err);
      setError("Failed to play audio response.");
    }
  };

  const stopAudioPlayback = () => {
    if (audioRef.current) {
      console.log("[VoiceTutor] Stopping audio playback");
      audioRef.current.pause();
      setIsPlayingAudio(false);
    }
  };

  const reset = () => {
    console.log("[VoiceTutor] Resetting to idle state");
    setRecordingState("idle");
    setResponse(null);
    setRecordingTime(0);
    setError(null);
    audioChunksRef.current = [];
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const errorTypeColors: Record<string, string> = {
    grammar: "bg-red-500/10 text-red-300 border-red-500/30",
    vocab: "bg-purple-500/10 text-purple-300 border-purple-500/30",
    fluency: "bg-blue-500/10 text-blue-300 border-blue-500/30",
    structure: "bg-orange-500/10 text-orange-300 border-orange-500/30",
    pronunciation_placeholder: "bg-pink-500/10 text-pink-300 border-pink-500/30",
  };

  const showDebugPanel = process.env.NEXT_PUBLIC_DEBUG_VOICE === "true";

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] p-7">
          <h3 className="text-xl font-bold text-white mb-3">🎤 Voice Tutor</h3>
          <p className="text-white/60 text-sm">
            Sign in to access voice-based practice with AI feedback.
          </p>
        </div>
      </div>
    );
  }

  if (!browserSupported) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-7">
          <h3 className="text-xl font-bold text-red-300 mb-3">🎤 Voice Recording Not Supported</h3>
          <p className="text-red-200 mb-4">{supportError}</p>
          <p className="text-red-200/70 text-sm">
            Please use Chrome or Safari on desktop for the best experience.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300 mb-3">
          🎤 Voice Tutor
        </h2>
        <p className="text-white/60">
          Practice speaking English and get instant AI feedback
        </p>
      </div>

      {/* Debug Panel (dev only) */}
      {showDebugPanel && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
          <button
            onClick={() => setShowDebug(!showDebug)}
            className="text-yellow-300 font-semibold mb-2 hover:text-yellow-200"
          >
            {showDebug ? "▼" : "▶"} Tech Debug Info
          </button>
          {showDebug && (
            <div className="mt-2 space-y-1 text-xs text-yellow-200 font-mono">
              <div>File Size: {debugInfo.lastFileSizeBytes ? `${debugInfo.lastFileSizeBytes} bytes (${(debugInfo.lastFileSizeBytes / 1024).toFixed(2)} KB)` : "N/A"}</div>
              <div>MIME Type: {debugInfo.lastMimeType || "N/A"}</div>
              <div>Status Code: {debugInfo.lastStatusCode || "N/A"}</div>
              <div>Last Transcript: {debugInfo.lastTranscript || "N/A"}</div>
              <div>Last Error: {debugInfo.lastError || "None"}</div>
            </div>
          )}
        </div>
      )}

      {/* Recording Interface */}
      <div className="bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] p-8">
        {recordingState === "idle" && (
          <div className="text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500/20 to-rose-500/20 border-2 border-white/20 mb-4">
                <svg
                  className="w-16 h-16 text-white/70"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-2">
              Ready to practice speaking?
            </h3>
            <p className="text-white/60 mb-6">
              Click the button below to start recording your voice
            </p>

            <button
              onClick={startRecording}
              disabled={!browserSupported}
              className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-rose-500 text-white font-semibold rounded-lg hover:from-indigo-600 hover:to-rose-600 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Start Recording
            </button>
          </div>
        )}

        {recordingState === "recording" && (
          <div className="text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-red-500/30 to-pink-500/30 border-2 border-red-500/50 mb-4 animate-pulse">
                <svg
                  className="w-16 h-16 text-red-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="8" />
                </svg>
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-2">Recording...</h3>
            <div className="text-4xl font-bold text-white mb-6">
              {formatTime(recordingTime)}
            </div>
            <p className="text-white/60 mb-6">Speak naturally and clearly</p>

            <button
              onClick={stopRecording}
              className="px-8 py-4 bg-gradient-to-r from-red-500 to-rose-500 text-white font-semibold rounded-lg hover:from-red-600 hover:to-rose-600 transition-all duration-300 shadow-lg"
            >
              Stop Recording
            </button>
          </div>
        )}

        {recordingState === "processing" && (
          <div className="text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-2 border-blue-500/50 mb-4">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400"></div>
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-2">
              Processing your speech...
            </h3>
            <p className="text-white/60">
              AI is analyzing your pronunciation and grammar
            </p>
          </div>
        )}

        {recordingState === "complete" && response && (
          <div className="space-y-6">
            {/* Transcript */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
              <h3 className="text-sm font-semibold text-blue-300 mb-2">
                📝 What you said:
              </h3>
              <p className="text-blue-200 text-lg">{response.transcript}</p>
            </div>

            {/* Tutor Feedback */}
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6">
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
                    💬 Tutor Feedback
                  </h3>
                  <p className="text-green-200">{response.tutor_response.message}</p>
                </div>
              </div>
            </div>

            {/* Errors/Corrections */}
            {response.tutor_response.errors.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white">
                  Corrections ({response.tutor_response.errors.length})
                </h3>
                {response.tutor_response.errors.map((error, index) => (
                  <div
                    key={index}
                    className={`p-5 border rounded-xl backdrop-blur-sm ${
                      errorTypeColors[error.type] ||
                      "bg-white/[0.05] text-white/70 border-white/[0.08]"
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
            {response.tutor_response.errors.length === 0 && (
              <div className="p-5 bg-blue-500/10 border border-blue-500/20 rounded-xl backdrop-blur-sm">
                <p className="text-blue-300 text-center">
                  ✨ Perfect! No errors detected.
                </p>
              </div>
            )}

            {/* Audio Response */}
            {response.audio_base64 && (
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-purple-300 mb-1">
                      🔊 AI Voice Response
                    </h3>
                    <p className="text-purple-200 text-sm">
                      Listen to the tutor's feedback
                    </p>
                  </div>
                  <button
                    onClick={isPlayingAudio ? stopAudioPlayback : playAudioResponse}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                      isPlayingAudio
                        ? "bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30"
                        : "bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30"
                    }`}
                  >
                    {isPlayingAudio ? "⏸ Stop" : "▶ Play"}
                  </button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={reset}
                className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-rose-500 text-white rounded-lg font-semibold hover:from-indigo-600 hover:to-rose-600 transition-all duration-300"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-5 bg-red-500/10 border-2 border-red-500/30 rounded-xl">
          <div className="flex items-start space-x-3">
            <svg
              className="w-6 h-6 text-red-400 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="flex-1">
              <h4 className="text-red-300 font-semibold mb-1">Error</h4>
              <p className="text-red-200">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tips */}
      {recordingState === "idle" && (
        <div className="bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] p-6">
          <h4 className="text-sm font-semibold text-white/80 mb-3">💡 Tips for better results</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li>• Speak clearly and at a moderate pace</li>
            <li>• Use a quiet environment with minimal background noise</li>
            <li>• Allow microphone access when prompted</li>
            <li>• Try speaking 2-3 complete sentences</li>
            <li>• Practice grammar structures you've learned in lessons</li>
          </ul>
        </div>
      )}

      {/* Version Display */}
      <div className="text-center text-white/30 text-xs">
        Frontend v{VERSION}
      </div>
    </div>
  );
}
