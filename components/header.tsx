"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Product", href: "/" },
  { name: "Lessons", href: "/lessons" },
  { name: "Technology", href: "/#technology" },
  { name: "Pricing", href: "/#pricing" },
];

interface HeaderProps {
  onSignOut?: () => void;
  onSignIn?: () => void;
  isAuthenticated?: boolean;
}

export function Header({ onSignOut, onSignIn, isAuthenticated }: HeaderProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-xl border-b border-neutral-200">
      <div className="mx-auto max-w-7xl px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - left */}
          <Link
            href="/"
            className="text-2xl font-display font-bold text-neutral-900 hover:text-electric-600 transition-colors"
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
                      ? "text-neutral-900"
                      : "text-neutral-600 hover:text-neutral-900"
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
            {isAuthenticated && (
              <Link
                href="/dashboard"
                className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                Dashboard
              </Link>
            )}
          </nav>

          {/* Auth - right */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <button
                onClick={onSignOut}
                className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                Sign Out
              </button>
            ) : (
              <>
                <button
                  onClick={onSignIn}
                  className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={onSignIn}
                  className="px-5 py-2 text-sm font-semibold text-white bg-electric-500 rounded-lg hover:bg-electric-600 transition-colors"
                >
                  Start Free Trial
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
