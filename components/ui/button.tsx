import React from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const buttonVariants: Record<ButtonVariant, string> = {
  primary: [
    "bg-gradient-to-r from-primary to-accent",
    "text-white font-semibold",
    "hover:from-primary-hover hover:to-accent-hover",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    "transition-all duration-300",
    "shadow-glow",
  ].join(" "),
  secondary: [
    "bg-background-tertiary",
    "text-text-primary border-2 border-border-strong",
    "hover:bg-background-secondary",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    "transition-all duration-200",
  ].join(" "),
  ghost: [
    "bg-transparent",
    "text-text-secondary",
    "hover:bg-background-tertiary hover:text-text-primary",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    "transition-all duration-200",
  ].join(" "),
};

const buttonSizes: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-body rounded-lg",
  md: "px-4 py-2 text-body-lg rounded-lg",
  lg: "px-6 py-3 text-h4 rounded-xl",
};

export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center",
        "focus:outline-none focus:ring-2 focus:ring-primary/50",
        buttonVariants[variant],
        buttonSizes[size],
        fullWidth && "w-full",
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
