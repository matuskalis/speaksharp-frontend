"use client";

import { TutorTextResponse, ErrorType } from "@/lib/types";

interface TutorResponseProps {
  response: TutorTextResponse;
}

const errorTypeColors: Record<ErrorType, string> = {
  grammar: "bg-red-500/10 text-red-600 border-red-500/30",
  vocab: "bg-purple-500/10 text-purple-600 border-purple-500/30",
  fluency: "bg-blue-500/10 text-blue-600 border-blue-500/30",
  structure: "bg-orange-500/10 text-orange-600 border-orange-500/30",
  pronunciation_placeholder: "bg-pink-500/10 text-pink-600 border-pink-500/30",
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
    <div className="max-w-[1200px] mx-auto px-8 space-y-8">
      {/* Tutor Message */}
      <div className="p-10 bg-white border border-gray-200 rounded-xl">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <svg
              className="w-6 h-6 text-gray-900"
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
            <h3 className="text-sm font-medium text-gray-900 mb-1">
              Tutor Feedback
            </h3>
            <p className="text-lg text-gray-600">{message}</p>
          </div>
        </div>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="space-y-8">
          <h3 className="text-3xl font-semibold text-gray-900">
            Corrections ({errors.length})
          </h3>
          {errors.map((error, index) => (
            <div
              key={index}
              className="p-10 bg-white border border-gray-200 rounded-xl"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="text-sm font-semibold uppercase tracking-wide text-gray-900">
                  {errorTypeLabels[error.type]}
                </span>
              </div>

              <div className="space-y-8">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    You wrote:
                  </p>
                  <p className="text-lg text-gray-900 line-through">{error.user_sentence}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Corrected:
                  </p>
                  <p className="text-lg font-medium text-gray-900">{error.corrected_sentence}</p>
                </div>

                <div className="pt-8 border-t border-gray-200">
                  <p className="text-lg italic text-gray-600">{error.explanation}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No errors */}
      {errors.length === 0 && (
        <div className="p-10 bg-white border border-gray-200 rounded-xl">
          <p className="text-lg text-gray-900 text-center">
            Great job! No errors detected.
          </p>
        </div>
      )}

      {/* Micro Task */}
      {micro_task && (
        <div className="p-10 bg-white border border-gray-200 rounded-xl">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg
                className="w-6 h-6 text-gray-900"
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
              <h3 className="text-sm font-medium text-gray-900 mb-1">
                Practice Task
              </h3>
              <p className="text-lg text-gray-600">{micro_task}</p>
            </div>
          </div>
        </div>
      )}

      {/* Session Info */}
      <div className="pt-8 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          Session ID: <code className="text-gray-600 bg-gray-100 px-2 py-1 rounded">{session_id}</code>
        </p>
      </div>
    </div>
  );
}
