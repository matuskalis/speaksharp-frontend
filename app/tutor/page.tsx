"use client";

import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import TutorInput from "../components/TutorInput";
import TutorResponse from "../components/TutorResponse";
import { TutorTextResponse } from "@/lib/types";

export default function TutorPage() {
  const [tutorResponse, setTutorResponse] = useState<TutorTextResponse | null>(null);
  const [history, setHistory] = useState<TutorTextResponse[]>([]);

  const handleTutorResponse = (response: TutorTextResponse) => {
    setTutorResponse(response);
    setHistory((prev) => [response, ...prev]);
  };

  return (
    <AppShell>
      {/* Tutor Input */}
      <TutorInput onResponse={handleTutorResponse} />

      {/* Latest Response */}
      {tutorResponse && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Latest Feedback
          </h2>
          <TutorResponse response={tutorResponse} />
        </div>
      )}

      {/* History */}
      {history.length > 1 && (
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-white mb-4">
            Previous Sessions ({history.length - 1})
          </h2>
          <div className="space-y-4">
            {history.slice(1).map((resp, index) => (
              <details
                key={resp.session_id}
                className="p-5 bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]"
              >
                <summary className="cursor-pointer font-medium text-white/70 hover:text-white">
                  Session {history.length - index - 1} •{" "}
                  {resp.errors.length} errors
                </summary>
                <div className="mt-4">
                  <TutorResponse response={resp} />
                </div>
              </details>
            ))}
          </div>
        </div>
      )}
    </AppShell>
  );
}
