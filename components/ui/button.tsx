import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const buttonVariants: Record<ButtonVariant, string> = {
  primary: [
    "bg-primary text-white",
    "hover:bg-primary-700",
    "active:bg-primary-800",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary",
    "shadow-sm",
    "transition-all duration-150",
  ].join(" "),
  secondary: [
    "bg-gray-100 text-gray-900",
    "hover:bg-gray-200",
    "active:bg-gray-300",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-100",
    "transition-all duration-150",
  ].join(" "),
  outline: [
    "bg-white text-gray-700 border border-gray-300",
    "hover:bg-gray-50 hover:border-gray-400",
    "active:bg-gray-100",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white",
    "transition-all duration-150",
  ].join(" "),
  ghost: [
    "bg-transparent text-gray-700",
    "hover:bg-gray-100",
    "active:bg-gray-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent",
    "transition-all duration-150",
  ].join(" "),
};

const buttonSizes: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm rounded-md",
  md: "px-4 py-2 text-sm rounded-md",
  lg: "px-6 py-2.5 text-base rounded-md",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-medium",
        "focus:outline-none",
        buttonVariants[variant],
        buttonSizes[size],
        fullWidth && "w-full",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
