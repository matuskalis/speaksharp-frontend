"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-neutral-200",
        className
      )}
    />
  );
}

export function StatsCardSkeleton() {
  return (
    <div className="bg-white border-2 border-neutral-200 rounded-xl p-8">
      <div className="flex items-center gap-3 mb-6">
        <Skeleton className="w-12 h-12 rounded-lg" />
        <Skeleton className="h-6 w-32" />
      </div>
      <Skeleton className="h-12 w-24 mb-2" />
      <Skeleton className="h-4 w-40 mb-4" />
      <Skeleton className="h-3 w-full rounded-full" />
    </div>
  );
}

export function PracticeCardSkeleton({ variant = "default" }: { variant?: "featured" | "default" }) {
  if (variant === "featured") {
    return (
      <div className="w-full bg-neutral-100 rounded-2xl p-8 border-2 border-neutral-200">
        <div className="flex items-start justify-between mb-4">
          <Skeleton className="w-14 h-14 rounded-xl" />
          <Skeleton className="w-20 h-8 rounded-lg" />
        </div>
        <Skeleton className="h-8 w-3/4 mb-3" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6 mb-6" />
        <Skeleton className="h-6 w-32" />
      </div>
    );
  }

  return (
    <div className="w-full bg-white border-2 border-neutral-200 rounded-xl p-6">
      <div className="flex items-start justify-between mb-4">
        <Skeleton className="w-12 h-12 rounded-lg" />
        <Skeleton className="w-16 h-7 rounded-lg" />
      </div>
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-4/5 mb-4" />
      <Skeleton className="h-5 w-20" />
    </div>
  );
}

export function LearnPageSkeleton() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-6xl mx-auto px-8 py-12">
        {/* Header Skeleton */}
        <div className="mb-12">
          <Skeleton className="h-12 w-96 mb-3" />
          <Skeleton className="h-6 w-64" />
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <StatsCardSkeleton />
          <StatsCardSkeleton />
        </div>

        {/* Featured Section Skeleton */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Skeleton className="h-7 w-24 rounded-lg" />
            <Skeleton className="h-9 w-48" />
          </div>
          <PracticeCardSkeleton variant="featured" />
        </div>

        {/* Quick Practice Grid Skeleton */}
        <div className="mb-12">
          <Skeleton className="h-9 w-56 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <PracticeCardSkeleton />
            <PracticeCardSkeleton />
            <PracticeCardSkeleton />
          </div>
        </div>

        {/* More Practice Grid Skeleton */}
        <div>
          <Skeleton className="h-9 w-56 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PracticeCardSkeleton />
            <PracticeCardSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
}
