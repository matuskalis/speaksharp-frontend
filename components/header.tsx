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
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-gray-200">
      <div className="mx-auto max-w-container px-8">
        <div className="flex items-center justify-between h-11">
          {/* Logo - left */}
          <Link
            href="/"
            className="text-xl font-semibold text-gray-900 hover:text-gray-700 transition-colors"
          >
            Vorex
          </Link>

          {/* Navigation - center */}
          <nav className="hidden md:flex items-center gap-8">
            {navigation.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors",
                    isActive
                      ? "text-gray-900"
                      : "text-gray-600 hover:text-gray-900"
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Auth - right */}
          <div>
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
