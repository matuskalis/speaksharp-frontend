"use client";

import { useState } from "react";
import { apiClient } from "@/lib/api-client";
import { TutorTextResponse } from "@/lib/types";

interface TutorInputProps {
  onResponse: (response: TutorTextResponse) => void;
}

export default function TutorInput({ onResponse }: TutorInputProps) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!text.trim()) {
      setError("Please enter some text");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.submitText({
        text: text.trim(),
      });

      onResponse(response);
      setText(""); // Clear input after successful submission
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit text");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-5 bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] p-7">
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            Practice your English
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write something in English... (e.g., 'I want order coffee.')"
            className="w-full px-4 py-3 bg-white/[0.05] border border-white/[0.12] rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
            rows={5}
            disabled={loading}
          />
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
            <p className="text-sm">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !text.trim()}
          className="w-full px-6 py-3 bg-gradient-to-r from-indigo-500 to-rose-500 text-white font-medium rounded-lg hover:from-indigo-600 hover:to-rose-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        >
          {loading ? "Analyzing..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
