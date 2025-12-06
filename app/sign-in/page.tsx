"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import AuthForm from "../components/AuthForm";

export default function SignInPage() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      router.push("/learn");
    }
  }, [user, router]);

  const handleSuccess = () => {
    router.push("/learn");
  };

  return <AuthForm variant="dark" onSuccess={handleSuccess} />;
}
