"use client";

import { AppShell } from "@/components/app-shell";
import DailySession from "./components/DailySession";

export default function Home() {
  return (
    <AppShell>
      <DailySession />
    </AppShell>
  );
}
