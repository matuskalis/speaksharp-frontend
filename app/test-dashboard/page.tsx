"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function TestDashboard() {
  const router = useRouter();
  const [status, setStatus] = useState("Ready");

  const completeOnboarding = async () => {
    setStatus("Processing...");

    try {
      // Get Supabase session from localStorage
      const supabaseAuth = localStorage.getItem('sb-ckkvuwubxwsemgbxuqth-auth-token');

      if (!supabaseAuth) {
        setStatus("Error: Not logged in. Please log in at /auth first.");
        return;
      }

      const authData = JSON.parse(supabaseAuth);
      const token = authData?.access_token;

      if (!token) {
        setStatus("Error: No access token found");
        return;
      }

      setStatus("Calling API...");

      const response = await fetch("http://localhost:8000/api/admin/complete-onboarding", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setStatus("Response: " + JSON.stringify(data));

      if (data.success) {
        setStatus("Success! Redirecting in 2 seconds...");
        setTimeout(() => {
          router.push("/learn");
        }, 2000);
      }
    } catch (error: any) {
      setStatus("Error: " + error.message);
      console.error("Error:", error);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f5f5f5", padding: "20px" }}>
      <div style={{ textAlign: "center", maxWidth: "600px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "32px" }}>
          Quick Dashboard Access
        </h1>

        <button
          onClick={completeOnboarding}
          style={{
            padding: "16px 32px",
            backgroundColor: "#171717",
            color: "white",
            borderRadius: "8px",
            fontSize: "18px",
            border: "none",
            cursor: "pointer",
            marginBottom: "24px"
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#262626"}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#171717"}
        >
          Mark Onboarding Complete & Go to Dashboard
        </button>

        <div style={{ marginTop: "24px", padding: "16px", backgroundColor: "white", borderRadius: "8px", border: "1px solid #e5e5e5" }}>
          <strong>Status:</strong> {status}
        </div>

        <div style={{ marginTop: "16px", color: "#666" }}>
          Or manually go to: <a href="/learn" style={{ color: "#0066cc" }}>/learn</a>
        </div>
      </div>
    </div>
  );
}
