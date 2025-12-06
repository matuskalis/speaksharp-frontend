"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SubscribeSuccessPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Countdown redirect
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/learn");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="mb-8 flex justify-center">
          <CheckCircle className="w-24 h-24 text-green-400" />
        </div>

        <h1 className="text-4xl font-bold text-text-primary mb-4">
          Welcome to Premium!
        </h1>

        <p className="text-xl text-text-secondary mb-8">
          Your subscription is now active. Get ready to accelerate your English learning journey!
        </p>

        <div className="glass rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-text-primary mb-3">
            What's next?
          </h2>
          <ul className="text-left space-y-2 text-text-secondary">
            <li>✓ Unlimited access to all exercises and lessons</li>
            <li>✓ Full voice tutor with pronunciation analysis</li>
            <li>✓ All conversation scenarios unlocked</li>
            <li>✓ Advanced progress tracking and analytics</li>
          </ul>
        </div>

        <div className="mb-6">
          <p className="text-text-muted">
            Redirecting to your dashboard in {countdown} seconds...
          </p>
        </div>

        <Button
          onClick={() => router.push("/learn")}
          className="w-full py-6 text-lg bg-gradient-brand hover:opacity-90 text-white shadow-btn-glow"
        >
          Start Learning Now
        </Button>
      </div>
    </div>
  );
}
