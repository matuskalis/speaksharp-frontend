"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { apiClient } from "@/lib/api-client";

interface HeatmapDay {
  date: string;
  xp: number;
  lessons: number;
  sessions: number;
}

interface ActivityHeatmapProps {
  days?: number;
}

export function ActivityHeatmap({ days = 365 }: ActivityHeatmapProps) {
  const [data, setData] = useState<HeatmapDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredDay, setHoveredDay] = useState<HeatmapDay | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    loadHeatmapData();
  }, [days]);

  const loadHeatmapData = async () => {
    try {
      const response = await apiClient.getActivityHeatmap(days);
      setData(response.data || []);
    } catch (err) {
      console.error("Failed to load heatmap data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Create a map for quick lookup
  const dataMap = useMemo(() => {
    const map = new Map<string, HeatmapDay>();
    data.forEach((d) => map.set(d.date, d));
    return map;
  }, [data]);

  // Generate calendar grid (last N days)
  const calendarData = useMemo(() => {
    const today = new Date();
    const result: { date: Date; data: HeatmapDay | null }[][] = [];

    // Start from the beginning of the week containing the start date
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - days + 1);

    // Align to Sunday
    const dayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - dayOfWeek);

    let currentWeek: { date: Date; data: HeatmapDay | null }[] = [];
    const current = new Date(startDate);

    while (current <= today) {
      const dateStr = current.toISOString().split("T")[0];
      currentWeek.push({
        date: new Date(current),
        data: dataMap.get(dateStr) || null,
      });

      if (currentWeek.length === 7) {
        result.push(currentWeek);
        currentWeek = [];
      }

      current.setDate(current.getDate() + 1);
    }

    // Add remaining days
    if (currentWeek.length > 0) {
      result.push(currentWeek);
    }

    return result;
  }, [days, dataMap]);

  // Calculate max XP for color scaling
  const maxXp = useMemo(() => {
    if (data.length === 0) return 100;
    return Math.max(...data.map((d) => d.xp), 1);
  }, [data]);

  // Get color based on XP
  const getColor = (xp: number | undefined) => {
    if (!xp || xp === 0) return "bg-white/[0.03]";
    const intensity = Math.min(xp / maxXp, 1);
    if (intensity < 0.25) return "bg-emerald-900/60";
    if (intensity < 0.5) return "bg-emerald-700/70";
    if (intensity < 0.75) return "bg-emerald-500/80";
    return "bg-emerald-400";
  };

  // Calculate stats
  const stats = useMemo(() => {
    const activeDays = data.filter((d) => d.xp > 0 || d.lessons > 0).length;
    const totalXp = data.reduce((sum, d) => sum + d.xp, 0);
    const totalLessons = data.reduce((sum, d) => sum + d.lessons, 0);
    const totalSessions = data.reduce((sum, d) => sum + d.sessions, 0);

    // Calculate current streak
    let currentStreak = 0;
    const sortedData = [...data].sort((a, b) => b.date.localeCompare(a.date));
    for (const day of sortedData) {
      if (day.xp > 0 || day.lessons > 0) {
        currentStreak++;
      } else {
        break;
      }
    }

    return { activeDays, totalXp, totalLessons, totalSessions, currentStreak };
  }, [data]);

  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Get month labels for the header
  const monthHeaders = useMemo(() => {
    const headers: { month: string; colStart: number }[] = [];
    let lastMonth = -1;

    calendarData.forEach((week, weekIndex) => {
      const firstDay = week[0]?.date;
      if (firstDay) {
        const month = firstDay.getMonth();
        if (month !== lastMonth) {
          headers.push({ month: monthLabels[month], colStart: weekIndex });
          lastMonth = month;
        }
      }
    });

    return headers;
  }, [calendarData]);

  if (loading) {
    return (
      <div className="bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/[0.08] p-7">
        <div className="h-32 flex items-center justify-center">
          <div className="text-white/40">Loading activity data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] p-7">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">Activity Heatmap</h3>
        <div className="flex items-center gap-2 text-xs text-white/40">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-sm bg-white/[0.03] border border-white/[0.08]" />
            <div className="w-3 h-3 rounded-sm bg-emerald-900/60" />
            <div className="w-3 h-3 rounded-sm bg-emerald-700/70" />
            <div className="w-3 h-3 rounded-sm bg-emerald-500/80" />
            <div className="w-3 h-3 rounded-sm bg-emerald-400" />
          </div>
          <span>More</span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-white/[0.03] rounded-xl border border-white/[0.08]">
          <div className="text-2xl font-bold text-emerald-400">{stats.activeDays}</div>
          <div className="text-xs text-white/50">Active Days</div>
        </div>
        <div className="text-center p-3 bg-white/[0.03] rounded-xl border border-white/[0.08]">
          <div className="text-2xl font-bold text-blue-400">{stats.totalXp.toLocaleString()}</div>
          <div className="text-xs text-white/50">Total XP</div>
        </div>
        <div className="text-center p-3 bg-white/[0.03] rounded-xl border border-white/[0.08]">
          <div className="text-2xl font-bold text-purple-400">{stats.totalLessons}</div>
          <div className="text-xs text-white/50">Lessons</div>
        </div>
        <div className="text-center p-3 bg-white/[0.03] rounded-xl border border-white/[0.08]">
          <div className="text-2xl font-bold text-orange-400">{stats.currentStreak}</div>
          <div className="text-xs text-white/50">Current Streak</div>
        </div>
      </div>

      {/* Heatmap grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[750px]">
          {/* Month labels */}
          <div className="flex gap-[3px] mb-2 ml-8">
            {monthHeaders.map((header, i) => (
              <div
                key={i}
                className="text-xs text-white/40"
                style={{
                  position: "relative",
                  left: `${header.colStart * 15}px`,
                  marginLeft: i > 0 ? "-15px" : "0",
                }}
              >
                {header.month}
              </div>
            ))}
          </div>

          <div className="flex">
            {/* Day labels */}
            <div className="flex flex-col gap-[3px] mr-2 text-xs text-white/40">
              {dayLabels.map((day, i) => (
                <div key={day} className="h-[12px] flex items-center" style={{ visibility: i % 2 === 1 ? "visible" : "hidden" }}>
                  {day}
                </div>
              ))}
            </div>

            {/* Grid */}
            <div className="flex gap-[3px]">
              {calendarData.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-[3px]">
                  {week.map((day, dayIndex) => {
                    const isInRange = day.date <= new Date();
                    return (
                      <motion.div
                        key={`${weekIndex}-${dayIndex}`}
                        className={`w-[12px] h-[12px] rounded-sm cursor-pointer transition-all ${
                          isInRange ? getColor(day.data?.xp) : "bg-transparent"
                        } ${isInRange ? "border border-white/[0.08]" : ""}`}
                        whileHover={{ scale: 1.3 }}
                        onMouseEnter={(e) => {
                          if (isInRange) {
                            setHoveredDay(day.data || { date: day.date.toISOString().split("T")[0], xp: 0, lessons: 0, sessions: 0 });
                            const rect = e.currentTarget.getBoundingClientRect();
                            setTooltipPos({ x: rect.left + rect.width / 2, y: rect.top });
                          }
                        }}
                        onMouseLeave={() => setHoveredDay(null)}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {hoveredDay && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed z-50 px-3 py-2 bg-gray-900 rounded-lg border border-white/20 shadow-xl text-sm pointer-events-none"
          style={{
            left: tooltipPos.x,
            top: tooltipPos.y - 70,
            transform: "translateX(-50%)",
          }}
        >
          <div className="font-medium text-white mb-1">
            {new Date(hoveredDay.date).toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
          <div className="text-white/70 space-y-0.5">
            <div>{hoveredDay.xp} XP earned</div>
            <div>{hoveredDay.lessons} lessons completed</div>
            <div>{hoveredDay.sessions} study sessions</div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
