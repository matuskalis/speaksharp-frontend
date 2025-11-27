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
    <div className="max-w-container mx-auto px-8">
      <form onSubmit={handleSubmit} className="space-y-6 bg-white border border-gray-200 rounded-xl p-8">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Practice your English
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write something in English... (e.g., 'I want order coffee.')"
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
            rows={5}
            disabled={loading}
          />
        </div>

        {error && (
          <div className="p-8 bg-white border border-gray-200 rounded-xl text-red-600">
            <p className="text-base">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !text.trim()}
          className="w-full px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {loading ? "Analyzing..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
