import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  fullWidth?: boolean;
}

export function Input({
  error = false,
  fullWidth = false,
  className,
  disabled,
  ...props
}: InputProps) {
  return (
    <input
      className={cn(
        "px-4 py-2 rounded-lg",
        "bg-background-tertiary border-2 border-border-strong",
        "text-text-primary text-body-lg placeholder-text-quaternary",
        "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "transition-all duration-200",
        error && "border-red-500 focus:ring-red-500/50 focus:border-red-500",
        fullWidth && "w-full",
        className
      )}
      disabled={disabled}
      {...props}
    />
  );
}
