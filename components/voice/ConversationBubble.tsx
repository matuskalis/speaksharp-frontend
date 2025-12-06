"use client";

import { motion } from "framer-motion";
import { Mic, Bot, AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

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

interface ConversationBubbleProps {
  message: Message;
  onPlayAudio?: () => void;
  isPlaying?: boolean;
}

export function ConversationBubble({
  message,
  onPlayAudio,
  isPlaying,
}: ConversationBubbleProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={cn("flex gap-3 mb-4", isUser ? "flex-row-reverse" : "flex-row")}
    >
      {/* Avatar */}
      <div
        className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
          isUser ? "bg-accent-purple/20" : "bg-accent-pink/20"
        )}
      >
        {isUser ? (
          <Mic className="w-5 h-5 text-accent-purple" />
        ) : (
          <Bot className="w-5 h-5 text-accent-pink" />
        )}
      </div>

      {/* Content */}
      <div className={cn("flex-1 max-w-[80%]", isUser ? "items-end" : "items-start")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-3",
            isUser
              ? "bg-gradient-brand text-white rounded-tr-sm shadow-btn-glow"
              : "glass gradient-border text-text-primary rounded-tl-sm"
          )}
        >
          <p className="text-[15px] leading-relaxed">{message.content}</p>
        </div>

        {/* Correction card */}
        {message.correction && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-2 bg-amber-500/10 border border-amber-500/30 rounded-xl p-3"
          >
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-medium text-amber-300">Correction</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-xs text-text-muted w-16">Original:</span>
                <span className="text-sm text-text-secondary line-through">
                  {message.correction.original}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-xs text-text-muted w-16">Correct:</span>
                <span className="text-sm text-green-400 font-medium">
                  {message.correction.corrected}
                </span>
              </div>
              <p className="text-xs text-text-muted mt-1 pt-1 border-t border-amber-500/20">
                {message.correction.explanation}
              </p>
            </div>
          </motion.div>
        )}

        {/* Play audio button for tutor messages */}
        {!isUser && message.audioBase64 && onPlayAudio && (
          <button
            onClick={onPlayAudio}
            className={cn(
              "mt-2 flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-full transition-colors",
              isPlaying
                ? "bg-accent-purple text-white"
                : "bg-accent-purple/20 text-accent-purple hover:bg-accent-purple/30"
            )}
          >
            {isPlaying ? (
              <>
                <div className="flex gap-0.5">
                  <span className="w-1 h-3 bg-white rounded-full animate-pulse" />
                  <span className="w-1 h-3 bg-white rounded-full animate-pulse delay-75" />
                  <span className="w-1 h-3 bg-white rounded-full animate-pulse delay-150" />
                </div>
                Playing...
              </>
            ) : (
              <>Play response</>
            )}
          </button>
        )}
      </div>
    </motion.div>
  );
}

// Typing indicator for when tutor is responding
export function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-3 mb-4"
    >
      <div className="w-10 h-10 rounded-full bg-accent-pink/20 flex items-center justify-center">
        <Bot className="w-5 h-5 text-accent-pink" />
      </div>
      <div className="glass gradient-border rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex items-center gap-1">
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
    </motion.div>
  );
}
