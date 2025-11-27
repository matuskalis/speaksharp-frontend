"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Home,
  BookOpen,
  MessageSquare,
  Mic,
  BarChart3,
  User,
} from "lucide-react";

const navigation = [
  { name: "Session", href: "/", icon: Home },
  { name: "Lessons", href: "/lessons", icon: BookOpen },
  { name: "Tutor", href: "/tutor", icon: MessageSquare },
  { name: "Voice", href: "/voice", icon: Mic },
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "Profile", href: "/profile", icon: User },
];

interface HeaderProps {
  onSignOut?: () => void;
  onSignIn?: () => void;
  isAuthenticated?: boolean;
}

export function Header({ onSignOut, onSignIn, isAuthenticated }: HeaderProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-white font-bold text-lg transition-transform group-hover:scale-105">
                V
              </div>
              <span className="text-xl font-semibold text-gray-900">Vorex</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all",
                    isActive
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Auth Actions */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <button
                onClick={onSignOut}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Sign Out
              </button>
            ) : (
              <button
                onClick={onSignIn}
                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-700 transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
