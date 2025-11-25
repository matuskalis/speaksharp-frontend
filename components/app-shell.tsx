"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/navbar";
import { UserMenu } from "@/components/user-menu";
import { Layout, PageHeader, ContentSection } from "@/components/layout";
import AuthForm from "@/app/components/AuthForm";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-white/[0.08]",
}: {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  gradient?: string;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -150,
        rotate: rotate - 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: rotate,
      }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      className={cn("absolute", className)}
    >
      <motion.div
        animate={{
          y: [0, 15, 0],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{
          width,
          height,
        }}
        className="relative"
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            "bg-gradient-to-r to-transparent",
            gradient,
            "backdrop-blur-[2px] border-2 border-white/[0.15]",
            "shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]",
            "after:absolute after:inset-0 after:rounded-full",
            "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]"
          )}
        />
      </motion.div>
    </motion.div>
  );
}

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { user, loading, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#030303] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">
            Loading...
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#030303] relative overflow-hidden">
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.03] via-transparent to-rose-500/[0.03] blur-3xl" />

        {/* Floating shapes */}
        <ElegantShape
          delay={0.2}
          width={400}
          height={100}
          rotate={8}
          gradient="from-indigo-500/[0.12]"
          className="left-[-5%] top-[10%]"
        />
        <ElegantShape
          delay={0.4}
          width={350}
          height={90}
          rotate={-12}
          gradient="from-rose-500/[0.12]"
          className="right-[-3%] top-[60%]"
        />
        <ElegantShape
          delay={0.3}
          width={250}
          height={70}
          rotate={15}
          gradient="from-violet-500/[0.12]"
          className="left-[10%] bottom-[15%]"
        />
        <ElegantShape
          delay={0.5}
          width={180}
          height={50}
          rotate={-20}
          gradient="from-cyan-500/[0.12]"
          className="right-[20%] top-[20%]"
        />
      </div>

      <Layout>
        <PageHeader
          title="SpeakSharp"
          subtitle="AI-Powered English Learning Tutor"
        />

        <ContentSection>
          <UserMenu
            isAuthenticated={!!user}
            onSignOut={handleSignOut}
            onSignIn={() => setShowAuthModal(true)}
          />

          <Navbar />

          {children}
        </ContentSection>
      </Layout>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAuthModal(false)}
              className="absolute -top-12 right-0 text-text-tertiary hover:text-text-primary"
            >
              <X className="w-8 h-8" />
            </Button>
            <AuthForm />
          </div>
        </div>
      )}
    </main>
  );
}
