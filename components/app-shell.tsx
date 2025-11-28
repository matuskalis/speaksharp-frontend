"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import AuthForm from "@/app/components/AuthForm";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-lg font-medium text-gray-600">
            Loading...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header
        isAuthenticated={!!user}
        onSignOut={handleSignOut}
        onSignIn={() => setShowAuthModal(true)}
      />

      <main className="flex-1">
        {children}
      </main>

      <Footer />

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-md">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAuthModal(false)}
              className="absolute -top-12 right-0 text-white hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </Button>
            <AuthForm onSuccess={() => setShowAuthModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
