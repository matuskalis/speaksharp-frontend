"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface QuickPracticeCardProps {
  title: string;
  description: string;
  emoji: string;
  duration: string;
  href: string;
  variant?: "primary" | "secondary";
}

export default function QuickPracticeCard({
  title,
  description,
  emoji,
  duration,
  href,
  variant = "secondary",
}: QuickPracticeCardProps) {
  const router = useRouter();

  return (
    <div
      className={`border-2 rounded-lg p-6 hover:border-neutral-400 transition-all cursor-pointer ${
        variant === "primary"
          ? "bg-neutral-900 border-neutral-900"
          : "bg-white border-neutral-200"
      }`}
      onClick={() => router.push(href)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="text-4xl">{emoji}</div>
        <div
          className={`text-xs px-2 py-1 rounded ${
            variant === "primary"
              ? "bg-white/20 text-white"
              : "bg-neutral-100 text-neutral-600"
          }`}
        >
          {duration}
        </div>
      </div>

      <h3
        className={`text-xl font-semibold mb-2 ${
          variant === "primary" ? "text-white" : "text-neutral-900"
        }`}
      >
        {title}
      </h3>

      <p
        className={`text-sm mb-4 ${
          variant === "primary" ? "text-white/80" : "text-neutral-600"
        }`}
      >
        {description}
      </p>

      <Button
        className={`w-full ${
          variant === "primary"
            ? "bg-white text-neutral-900 hover:bg-neutral-100"
            : "bg-neutral-900 text-white hover:bg-neutral-800"
        }`}
        onClick={(e) => {
          e.stopPropagation();
          router.push(href);
        }}
      >
        Start
      </Button>
    </div>
  );
}
