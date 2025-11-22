"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function Layout({ children, className }: LayoutProps) {
  return (
    <div className="relative z-10 container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-7xl">
      <div className={cn("space-y-8 sm:space-y-12", className)}>
        {children}
      </div>
    </div>
  );
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function PageHeader({ title, subtitle, className }: PageHeaderProps) {
  return (
    <header className={cn("text-center mb-12 sm:mb-16", className)}>
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-2 sm:mb-3 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">
        {title}
      </h1>
      {subtitle && (
        <p className="text-text-tertiary text-base sm:text-lg">
          {subtitle}
        </p>
      )}
    </header>
  );
}

interface ContentSectionProps {
  children: React.ReactNode;
  className?: string;
}

export function ContentSection({ children, className }: ContentSectionProps) {
  return (
    <section className={cn("space-y-6 sm:space-y-8", className)}>
      {children}
    </section>
  );
}
