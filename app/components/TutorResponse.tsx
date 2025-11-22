"use client";

import { TutorTextResponse, ErrorType } from "@/lib/types";

interface TutorResponseProps {
  response: TutorTextResponse;
}

const errorTypeColors: Record<ErrorType, string> = {
  grammar: "bg-red-500/10 text-red-300 border-red-500/30",
  vocab: "bg-purple-500/10 text-purple-300 border-purple-500/30",
  fluency: "bg-blue-500/10 text-blue-300 border-blue-500/30",
  structure: "bg-orange-500/10 text-orange-300 border-orange-500/30",
  pronunciation_placeholder: "bg-pink-500/10 text-pink-300 border-pink-500/30",
};

const errorTypeLabels: Record<ErrorType, string> = {
  grammar: "Grammar",
  vocab: "Vocabulary",
  fluency: "Fluency",
  structure: "Structure",
  pronunciation_placeholder: "Pronunciation",
};

export default function TutorResponse({ response }: TutorResponseProps) {
  const { message, errors, micro_task, session_id } = response;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Tutor Message */}
      <div className="p-5 bg-green-500/10 border border-green-500/20 rounded-xl backdrop-blur-sm">
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
              Tutor Feedback
            </h3>
            <p className="text-green-200">{message}</p>
          </div>
        </div>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">
            Corrections ({errors.length})
          </h3>
          {errors.map((error, index) => (
            <div
              key={index}
              className={`p-5 border rounded-xl backdrop-blur-sm ${
                errorTypeColors[error.type]
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wide">
                  {errorTypeLabels[error.type]}
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs font-medium opacity-75 mb-1">
                    You wrote:
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
      {errors.length === 0 && (
        <div className="p-5 bg-blue-500/10 border border-blue-500/20 rounded-xl backdrop-blur-sm">
          <p className="text-blue-300 text-center">
            ✨ Great job! No errors detected.
          </p>
        </div>
      )}

      {/* Micro Task */}
      {micro_task && (
        <div className="p-5 bg-amber-500/10 border border-amber-500/20 rounded-xl backdrop-blur-sm">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg
                className="w-6 h-6 text-amber-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-amber-300 mb-1">
                Practice Task
              </h3>
              <p className="text-amber-200">{micro_task}</p>
            </div>
          </div>
        </div>
      )}

      {/* Session Info */}
      <div className="pt-4 border-t border-white/[0.08]">
        <p className="text-xs text-white/50">
          Session ID: <code className="text-white/70 bg-white/[0.05] px-2 py-1 rounded">{session_id}</code>
        </p>
      </div>
    </div>
  );
}
