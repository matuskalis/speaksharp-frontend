"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { Sparkles, Mic, BookOpen, Paperclip, Send, StopCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

const PLACEHOLDERS = [
  "Tell me about your day in English...",
  "Ask me to explain a grammar rule...",
  "Practice ordering food at a restaurant...",
  "Let's have a conversation about travel...",
  "Describe your favorite hobby...",
  "Ask me anything about English...",
];

interface AIChatInputProps {
  onSend?: (message: string) => void;
  onVoiceStart?: () => void;
  onVoiceStop?: () => void;
  isLoading?: boolean;
  isRecording?: boolean;
  disabled?: boolean;
  className?: string;
}

const AIChatInput = ({
  onSend,
  onVoiceStart,
  onVoiceStop,
  isLoading = false,
  isRecording = false,
  disabled = false,
  className,
}: AIChatInputProps) => {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [scenarioMode, setScenarioMode] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Cycle placeholder text when input is inactive
  useEffect(() => {
    if (isActive || inputValue) return;

    const interval = setInterval(() => {
      setShowPlaceholder(false);
      setTimeout(() => {
        setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
        setShowPlaceholder(true);
      }, 400);
    }, 3500);

    return () => clearInterval(interval);
  }, [isActive, inputValue]);

  // Close input when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        if (!inputValue) setIsActive(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [inputValue]);

  const handleActivate = () => {
    setIsActive(true);
    inputRef.current?.focus();
  };

  const handleSend = () => {
    if (inputValue.trim() && onSend && !isLoading) {
      onSend(inputValue.trim());
      setInputValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const containerVariants = {
    collapsed: {
      height: 72,
      transition: { type: "spring" as const, stiffness: 120, damping: 18 },
    },
    expanded: {
      height: 130,
      transition: { type: "spring" as const, stiffness: 120, damping: 18 },
    },
  };

  const placeholderContainerVariants = {
    initial: {},
    animate: { transition: { staggerChildren: 0.02 } },
    exit: { transition: { staggerChildren: 0.01, staggerDirection: -1 } },
  };

  const letterVariants = {
    initial: {
      opacity: 0,
      filter: "blur(8px)",
      y: 8,
    },
    animate: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        opacity: { duration: 0.2 },
        filter: { duration: 0.3 },
        y: { type: "spring" as const, stiffness: 100, damping: 20 },
      },
    },
    exit: {
      opacity: 0,
      filter: "blur(8px)",
      y: -8,
      transition: {
        opacity: { duration: 0.15 },
        filter: { duration: 0.2 },
        y: { type: "spring" as const, stiffness: 100, damping: 20 },
      },
    },
  };

  return (
    <motion.div
      ref={wrapperRef}
      className={cn(
        "w-full max-w-2xl mx-auto",
        className
      )}
      variants={containerVariants}
      animate={isActive || inputValue ? "expanded" : "collapsed"}
      initial="collapsed"
      style={{
        overflow: "hidden",
        borderRadius: 28,
      }}
      onClick={handleActivate}
    >
      <div className="flex flex-col items-stretch w-full h-full glass gradient-border rounded-[28px]">
        {/* Input Row */}
        <div className="flex items-center gap-2 p-3">
          <button
            className="p-3 rounded-full hover:bg-white/10 transition text-text-muted hover:text-text-primary"
            title="Attach file"
            type="button"
            tabIndex={-1}
          >
            <Paperclip size={20} />
          </button>

          {/* Text Input & Placeholder */}
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={disabled || isLoading}
              className="flex-1 border-0 outline-0 rounded-md py-2 text-base bg-transparent w-full font-normal text-text-primary placeholder:text-text-muted"
              style={{ position: "relative", zIndex: 1 }}
              onFocus={handleActivate}
            />
            <div className="absolute left-0 top-0 w-full h-full pointer-events-none flex items-center py-2">
              <AnimatePresence mode="wait">
                {showPlaceholder && !isActive && !inputValue && (
                  <motion.span
                    key={placeholderIndex}
                    className="absolute left-0 top-1/2 -translate-y-1/2 text-text-muted select-none pointer-events-none text-sm"
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      zIndex: 0,
                    }}
                    variants={placeholderContainerVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    {PLACEHOLDERS[placeholderIndex]
                      .split("")
                      .map((char, i) => (
                        <motion.span
                          key={i}
                          variants={letterVariants}
                          style={{ display: "inline-block" }}
                        >
                          {char === " " ? "\u00A0" : char}
                        </motion.span>
                      ))}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Voice Button */}
          <button
            className={cn(
              "p-3 rounded-full transition",
              isRecording
                ? "bg-red-500/20 text-red-400 animate-pulse"
                : "hover:bg-white/10 text-text-muted hover:text-text-primary"
            )}
            title={isRecording ? "Stop recording" : "Voice input"}
            type="button"
            tabIndex={-1}
            onClick={(e) => {
              e.stopPropagation();
              isRecording ? onVoiceStop?.() : onVoiceStart?.();
            }}
          >
            {isRecording ? <StopCircle size={20} /> : <Mic size={20} />}
          </button>

          {/* Send Button */}
          <button
            className={cn(
              "flex items-center gap-1 p-3 rounded-full font-medium justify-center transition-all",
              inputValue.trim() && !isLoading
                ? "bg-gradient-brand text-white shadow-btn-glow hover:shadow-btn-glow-hover"
                : "bg-dark-300 text-text-muted"
            )}
            title="Send"
            type="button"
            tabIndex={-1}
            onClick={(e) => {
              e.stopPropagation();
              handleSend();
            }}
            disabled={!inputValue.trim() || isLoading}
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles size={18} />
              </motion.div>
            ) : (
              <Send size={18} />
            )}
          </button>
        </div>

        {/* Expanded Controls */}
        <motion.div
          className="w-full flex justify-start px-4 items-center text-sm"
          variants={{
            hidden: {
              opacity: 0,
              y: 15,
              pointerEvents: "none" as const,
              transition: { duration: 0.2 },
            },
            visible: {
              opacity: 1,
              y: 0,
              pointerEvents: "auto" as const,
              transition: { duration: 0.3, delay: 0.05 },
            },
          }}
          initial="hidden"
          animate={isActive || inputValue ? "visible" : "hidden"}
          style={{ marginTop: 4 }}
        >
          <div className="flex gap-3 items-center">
            {/* AI Tutor Toggle */}
            <motion.button
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full transition-all font-medium",
                !scenarioMode
                  ? "bg-accent-purple/20 ring-1 ring-accent-purple/60 text-accent-purple"
                  : "bg-dark-300 text-text-muted hover:bg-dark-200"
              )}
              title="Free Chat"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setScenarioMode(false);
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles size={16} />
              <span>Free Chat</span>
            </motion.button>

            {/* Scenario Toggle */}
            <motion.button
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full transition-all font-medium",
                scenarioMode
                  ? "bg-accent-purple/20 ring-1 ring-accent-purple/60 text-accent-purple"
                  : "bg-dark-300 text-text-muted hover:bg-dark-200"
              )}
              title="Scenario Practice"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setScenarioMode(true);
              }}
              whileTap={{ scale: 0.95 }}
            >
              <BookOpen size={16} />
              <span>Scenario</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export { AIChatInput };
