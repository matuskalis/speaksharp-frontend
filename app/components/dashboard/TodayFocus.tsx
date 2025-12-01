"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { DashboardTask } from "@/lib/types";

interface TodayFocusProps {
  tasks: DashboardTask[];
}

const taskIcons = {
  lesson: "📚",
  drill: "💪",
  scenario: "🎭",
};

const taskColors = {
  lesson: "bg-blue-50 border-blue-200 hover:border-blue-400",
  drill: "bg-green-50 border-green-200 hover:border-green-400",
  scenario: "bg-purple-50 border-purple-200 hover:border-purple-400",
};

export default function TodayFocus({ tasks }: TodayFocusProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-neutral-900">Today's Focus</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tasks.slice(0, 3).map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={task.href}>
              <div
                className={`p-6 rounded-lg border-2 transition-all duration-200 ${
                  taskColors[task.type]
                } hover:shadow-md cursor-pointer`}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{taskIcons[task.type]}</span>
                  <span className="text-xs bg-neutral-200 text-neutral-700 px-2 py-1 rounded uppercase font-semibold">
                    {task.type}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                  {task.title}
                </h3>
                <div className="flex items-center gap-3 text-sm text-neutral-600">
                  <span className="flex items-center gap-1">
                    ⏱️ {task.duration} min
                  </span>
                  <span className="flex items-center gap-1">
                    🎯 {task.skill}
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
