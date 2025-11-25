"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Home,
  LayoutDashboard,
  MessageSquare,
  RotateCcw,
  Drama,
  Dumbbell,
  BookOpen,
  Mic,
  User,
  Menu,
  X,
  TrendingUp,
  Trophy
} from "lucide-react";
import { Button } from "./ui/button";

// Navigation structure with logical grouping
const navSections = [
  {
    label: "Learning",
    items: [
      { href: "/", label: "Session", icon: Home },
      { href: "/tutor", label: "Tutor", icon: MessageSquare },
      { href: "/voice", label: "Voice", icon: Mic },
    ]
  },
  {
    label: "Practice",
    items: [
      { href: "/review", label: "Review", icon: RotateCcw },
      { href: "/scenarios", label: "Scenarios", icon: Drama },
      { href: "/drills", label: "Drills", icon: Dumbbell },
      { href: "/lessons", label: "Lessons", icon: BookOpen },
    ]
  },
  {
    label: "Progress",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/insights", label: "Insights", icon: TrendingUp },
      { href: "/achievements", label: "Achievements", icon: Trophy },
    ]
  },
  {
    label: "Account",
    items: [
      { href: "/profile", label: "Profile", icon: User },
    ]
  },
];

// Flatten for desktop horizontal nav
const allNavItems = navSections.flatMap(section => section.items);

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:block max-w-6xl mx-auto">
        <div className="flex items-center justify-center gap-2 bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] p-2">
          {allNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300",
                  isActive
                    ? "bg-gradient-to-r from-primary/20 to-accent/20 text-text-primary border border-white/[0.12] shadow-lg"
                    : "bg-transparent text-text-tertiary hover:text-text-primary hover:bg-white/[0.05]"
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden xl:inline text-body-lg">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="lg:hidden max-w-5xl mx-auto">
        {/* Mobile Header */}
        <div className="flex items-center justify-between bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] p-4">
          <div className="flex items-center gap-3">
            {(() => {
              const activeItem = allNavItems.find(item => pathname === item.href);
              if (!activeItem) return null;
              const Icon = activeItem.icon;
              return (
                <>
                  <Icon className="w-5 h-5 text-primary" />
                  <span className="text-h4 text-text-primary">{activeItem.label}</span>
                </>
              );
            })()}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </Button>
        </div>

        {/* Mobile Menu Dropdown with Grouped Structure */}
        {mobileMenuOpen && (
          <div className="mt-2 bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] overflow-hidden">
            {navSections.map((section, sectionIndex) => (
              <div key={section.label}>
                {/* Section Label */}
                <div className="px-6 py-3 bg-white/[0.02]">
                  <h3 className="text-caption uppercase tracking-wider text-text-quaternary font-semibold">
                    {section.label}
                  </h3>
                </div>

                {/* Section Items */}
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={handleNavClick}
                      className={cn(
                        "w-full flex items-center gap-3 px-6 py-4 font-medium transition-all duration-200",
                        isActive
                          ? "bg-gradient-to-r from-primary/10 to-accent/10 text-text-primary"
                          : "bg-transparent text-text-tertiary hover:text-text-primary hover:bg-white/[0.05]"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-body-lg">{item.label}</span>
                      {isActive && (
                        <div className="ml-auto w-2 h-2 rounded-full bg-primary" />
                      )}
                    </Link>
                  );
                })}

                {/* Divider between sections (except last) */}
                {sectionIndex < navSections.length - 1 && (
                  <div className="border-b border-white/[0.08]" />
                )}
              </div>
            ))}
          </div>
        )}
      </nav>
    </>
  );
}
