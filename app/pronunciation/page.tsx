"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AppShell } from "@/components/app-shell";

type RecordingState = "idle" | "recording" | "processing";

interface PhonemeScore {
  phoneme: string;
  score: number;
  position: number;
}

interface ScoringResult {
  overall_score: number;
  phoneme_scores: PhonemeScore[];
  transcript: string;
}

interface DailyPhrase {
  text: string;
  target_phonemes: string[];
}

interface PhonemeStats {
  phoneme: string;
  avg_score: number;
  attempts: number;
}

interface Summary {
  total_attempts: number;
  last_7d_avg_score: number;
  last_7d_attempts: number;
  weakest_phonemes: PhonemeStats[];
}

export default function PronunciationPage() {
  const { user, session } = useAuth();
  const [currentPhrase, setCurrentPhrase] = useState<DailyPhrase | null>(null);
  const [weakPhonemes, setWeakPhonemes] = useState<string[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [result, setResult] = useState<ScoringResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

  useEffect(() => {
    if (user && session) {
      fetchDailyPhrase();
      fetchWeakPhonemes();
      fetchSummary();
    }
  }, [user, session]);

  const fetchDailyPhrase = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/pronunciation/daily-phrase`, {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch phrase: ${response.status}`);
      }

      const data: DailyPhrase = await response.json();
      setCurrentPhrase(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load phrase");
    } finally {
      setLoading(false);
    }
  };

  const fetchWeakPhonemes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/pronunciation/weak-phonemes`, {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setWeakPhonemes(data.weak_phonemes || []);
      }
    } catch (err) {
      // Silent fail - weak phonemes are optional
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/pronunciation/summary`, {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (response.ok) {
        const data: Summary = await response.json();
        setSummary(data);
      }
    } catch (err) {
      // Silent fail - summary is optional
    }
  };

  const startRecording = async () => {
    try {
      setError(null);
      setResult(null);
      audioChunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      const mimeType = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : undefined;

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        await submitRecording();
      };

      mediaRecorder.start();
      setRecordingState("recording");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start recording");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recordingState === "recording") {
      mediaRecorderRef.current.stop();
      setRecordingState("processing");
    }
  };

  const submitRecording = async () => {
    if (!currentPhrase) return;

    try {
      const audioBlob = new Blob(audioChunksRef.current, {
        type: mediaRecorderRef.current?.mimeType || "audio/webm",
      });

      const formData = new FormData();
      formData.append("audio_file", audioBlob, "recording.webm");
      formData.append("reference_text", currentPhrase.text);

      const response = await fetch(`${API_BASE_URL}/api/pronunciation/score`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data: ScoringResult = await response.json();
      setResult(data);
      setRecordingState("idle");

      // Refresh analytics after scoring
      fetchWeakPhonemes();
      fetchSummary();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to score pronunciation");
      setRecordingState("idle");
    }
  };

  const nextPhrase = () => {
    setResult(null);
    setError(null);
    fetchDailyPhrase();
  };

  if (!user) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">Please sign in to practice pronunciation</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Pronunciation Practice</h1>
          {weakPhonemes.length > 0 && (
            <p className="text-sm text-gray-600">
              Targeting weak phonemes: {weakPhonemes.join(", ")}
            </p>
          )}
        </div>

        {/* Summary Panel */}
        {summary && summary.total_attempts > 0 && (
          <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 text-sm space-y-1">
            <div className="font-medium text-gray-700">Stats (7 days)</div>
            <div className="text-gray-600">
              Attempts: {summary.last_7d_attempts}
            </div>
            <div className="text-gray-600">
              Avg score: {summary.last_7d_avg_score}
            </div>
            {summary.weakest_phonemes.length > 0 && (
              <div className="text-gray-600">
                Weak phonemes:{" "}
                {summary.weakest_phonemes
                  .map((p) => `${p.phoneme} (${p.avg_score})`)
                  .join(", ")}
              </div>
            )}
          </div>
        )}

        {loading && (
          <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-8 text-center">
            <p className="text-gray-500">Loading phrase...</p>
          </div>
        )}

        {/* Current Phrase */}
        {!loading && currentPhrase && (
          <div className="space-y-2">
            <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-8 text-center">
              <p className="text-2xl font-medium">{currentPhrase.text}</p>
            </div>
            {currentPhrase.target_phonemes.length > 0 && (
              <div className="text-center text-sm text-gray-600">
                Focus: {currentPhrase.target_phonemes.join(", ")}
              </div>
            )}
          </div>
        )}

        {/* Recording Controls */}
        <div className="flex justify-center gap-4">
          {recordingState === "idle" && (
            <button
              onClick={startRecording}
              disabled={!currentPhrase || loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Start Recording
            </button>
          )}

          {recordingState === "recording" && (
            <button
              onClick={stopRecording}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium animate-pulse"
            >
              Stop Recording
            </button>
          )}

          {recordingState === "processing" && (
            <div className="px-6 py-3 bg-gray-400 text-white rounded-lg font-medium">
              Processing...
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Results Display */}
        {result && (
          <div className="space-y-4">
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Overall Score</p>
                <p className="text-5xl font-bold text-green-700">
                  {result.overall_score.toFixed(0)}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-700 mb-2">
                What you said:
              </p>
              <p className="text-gray-900">{result.transcript}</p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Phoneme Scores:
              </p>
              <div className="flex flex-wrap gap-2">
                {result.phoneme_scores.map((ps, idx) => (
                  <div
                    key={idx}
                    className={`px-3 py-2 rounded text-sm font-mono ${
                      ps.score === 100
                        ? "bg-green-100 text-green-800"
                        : ps.score === 70
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {ps.phoneme} ({ps.score})
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={nextPhrase}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Next Phrase
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
