"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  fullWidth?: boolean;
  options: Array<{ value: string; label: string }>;
}

export function Select({
  fullWidth = false,
  options,
  className,
  ...props
}: SelectProps) {
  return (
    <div className={cn("relative", fullWidth && "w-full")}>
      <select
        className={cn(
          "appearance-none rounded-xl px-4 py-2.5 pr-10",
          "bg-dark-200 border border-white/[0.08]",
          "text-text-primary text-sm",
          "hover:border-white/[0.12] focus:border-accent-purple focus:outline-none focus:ring-2 focus:ring-accent-purple/20",
          "transition-colors",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
    </div>
  );
}
