"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useGamification } from "@/contexts/GamificationContext";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { HeartsDisplay } from "@/components/gamification";
import {
  Home,
  BookOpen,
  MessageCircle,
  User,
  Flame,
  Zap,
  GraduationCap,
} from "lucide-react";

interface MobileAppShellProps {
  children: React.ReactNode;
  hideNav?: boolean;
}

const navItems = [
  { href: "/learn", label: "Home", icon: Home },
  { href: "/path", label: "Learn", icon: GraduationCap },
  { href: "/practice", label: "Practice", icon: BookOpen },
  { href: "/profile", label: "Profile", icon: User },
];

export function MobileAppShell({ children, hideNav = false }: MobileAppShellProps) {
  const { user, loading } = useAuth();
  const { xp, streak } = useGamification();
  const pathname = usePathname();

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-gradient-brand rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-btn-glow">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <div className="text-lg font-semibold text-text-primary">Loading...</div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark flex flex-col">
      {/* Top Header */}
      {user && !hideNav && (
        <header className="sticky top-0 z-40 bg-dark-100/80 backdrop-blur-xl border-b border-white/[0.06]">
          <div className="flex items-center justify-between px-4 h-14">
            {/* Logo */}
            <Link href="/learn" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-brand rounded-lg flex items-center justify-center shadow-btn-glow">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-text-primary">Vorex</span>
            </Link>

            {/* Stats */}
            <div className="flex items-center gap-4">
              {/* Hearts */}
              <HeartsDisplay compact />
              {/* Streak */}
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-dark-200/80 rounded-lg">
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="font-bold text-sm text-text-primary">{streak}</span>
              </div>
              {/* XP */}
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-dark-200/80 rounded-lg">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="font-bold text-sm text-text-primary">{xp.total}</span>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className={cn(
        "flex-1",
        user && !hideNav && "pb-20"
      )}>
        {children}
      </main>

      {/* Bottom Navigation */}
      {user && !hideNav && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-dark-100/90 backdrop-blur-xl border-t border-white/[0.06] safe-area-bottom">
          <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href ||
                (item.href === "/learn" && pathname === "/") ||
                (item.href === "/path" && pathname.startsWith("/path")) ||
                (item.href === "/practice" && (pathname === "/tutor" || pathname === "/voice" || pathname === "/review"));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center justify-center w-full h-full transition-all",
                    "active:scale-95"
                  )}
                >
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className={cn(
                      "flex flex-col items-center gap-1",
                      isActive ? "text-accent-purple" : "text-text-muted"
                    )}
                  >
                    <div className={cn(
                      "p-2 rounded-xl transition-all",
                      isActive && "bg-accent-purple/20 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                    )}>
                      <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                    </div>
                    <span className={cn(
                      "text-xs font-medium",
                      isActive ? "text-accent-purple" : "text-text-muted"
                    )}>
                      {item.label}
                    </span>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
