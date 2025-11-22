"use client";

import { LogOut, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface UserMenuProps {
  isAuthenticated: boolean;
  onSignOut: () => void;
  onSignIn: () => void;
}

export function UserMenu({ isAuthenticated, onSignOut, onSignIn }: UserMenuProps) {
  if (!isAuthenticated) {
    return (
      <Card className="max-w-4xl mx-auto bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="w-6 h-6 text-amber-300" />
              <h3 className="text-h4 font-semibold text-amber-300">Guest Mode Active</h3>
            </div>
            <p className="text-body text-amber-200/80">
              You're using SpeakSharp without an account. Your progress, errors, and lessons won't be saved.
              Sign in or create an account to track your learning journey!
            </p>
          </div>
          <Button
            onClick={onSignIn}
            size="lg"
            className="whitespace-nowrap w-full sm:w-auto"
          >
            Sign In / Sign Up
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white font-bold">
            U
          </div>
          <div>
            <p className="text-body-lg font-medium text-text-primary">Signed In</p>
            <p className="text-caption text-text-tertiary">Learning in progress</p>
          </div>
        </div>
        <Button
          variant="secondary"
          size="md"
          onClick={onSignOut}
          className="gap-2"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </div>
    </Card>
  );
}
