"use client";

import { motion } from "framer-motion";
import { SessionData } from "@/lib/types";

interface RecentGrowthProps {
  sessions: SessionData[];
}

const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function RecentGrowth({ sessions }: RecentGrowthProps) {
  const maxMinutes = Math.max(...sessions.map((s) => s.minutes), 1);

  const getIntensityColor = (minutes: number) => {
    if (minutes === 0) return "bg-neutral-100";
    const intensity = minutes / maxMinutes;
    if (intensity < 0.25) return "bg-electric-200";
    if (intensity < 0.5) return "bg-electric-400";
    if (intensity < 0.75) return "bg-electric-500";
    return "bg-electric-600";
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-neutral-900">Recent Growth</h2>
      <div className="bg-white border-2 border-neutral-200 rounded-lg p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-neutral-600">Last 7 days activity</div>
            <div className="flex items-center gap-2 text-xs text-neutral-500">
              <span>Less</span>
              <div className="flex gap-1">
                <div className="w-4 h-4 bg-neutral-100 rounded"></div>
                <div className="w-4 h-4 bg-electric-200 rounded"></div>
                <div className="w-4 h-4 bg-electric-400 rounded"></div>
                <div className="w-4 h-4 bg-electric-500 rounded"></div>
                <div className="w-4 h-4 bg-electric-600 rounded"></div>
              </div>
              <span>More</span>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-3">
            {sessions.slice(-7).map((session, index) => {
              const date = new Date(session.date);
              const dayName = dayLabels[date.getDay()];
              const dayNum = date.getDate();

              return (
                <motion.div
                  key={session.date}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col items-center"
                >
                  <div className="text-xs text-neutral-500 mb-2 font-medium">
                    {dayName}
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={`w-full aspect-square rounded-lg ${getIntensityColor(
                      session.minutes
                    )} border-2 border-neutral-200 flex items-center justify-center cursor-pointer transition-all`}
                    title={`${session.minutes} minutes on ${session.date}`}
                  >
                    <div className="text-center">
                      <div className="text-xs font-bold text-neutral-700">
                        {dayNum}
                      </div>
                      {session.minutes > 0 && (
                        <div className="text-[10px] text-neutral-600 font-medium">
                          {session.minutes}m
                        </div>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

          <div className="pt-4 border-t-2 border-neutral-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-neutral-600">Total this week</div>
                <div className="text-2xl font-bold text-neutral-900">
                  {sessions.slice(-7).reduce((sum, s) => sum + s.minutes, 0)}{" "}
                  minutes
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-neutral-600">Daily average</div>
                <div className="text-2xl font-bold text-neutral-900">
                  {Math.round(
                    sessions.slice(-7).reduce((sum, s) => sum + s.minutes, 0) /
                      7
                  )}{" "}
                  min
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
