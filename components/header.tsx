"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Session", href: "/" },
  { name: "Lessons", href: "/lessons" },
  { name: "Tutor", href: "/tutor" },
  { name: "Voice", href: "/voice" },
  { name: "Dashboard", href: "/dashboard" },
  { name: "Profile", href: "/profile" },
];

interface HeaderProps {
  onSignOut?: () => void;
  onSignIn?: () => void;
  isAuthenticated?: boolean;
}

export function Header({ onSignOut, onSignIn, isAuthenticated }: HeaderProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-gray-200/60">
      <div className="mx-auto max-w-7xl">
        <div className="flex h-14 items-center justify-between px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <span className="text-xl font-semibold text-gray-900 tracking-tight">
              Vorex
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navigation.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors relative",
                    isActive
                      ? "text-gray-900"
                      : "text-gray-600 hover:text-gray-900"
                  )}
                >
                  {item.name}
                  {isActive && (
                    <div className="absolute -bottom-[13px] left-0 right-0 h-[2px] bg-gray-900" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Auth Actions */}
          <div className="flex items-center">
            {isAuthenticated ? (
              <button
                onClick={onSignOut}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Sign Out
              </button>
            ) : (
              <button
                onClick={onSignIn}
                className="px-4 py-1.5 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
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
