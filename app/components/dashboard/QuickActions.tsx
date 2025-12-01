"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const actions = [
  {
    title: "Start Writing",
    icon: "✍️",
    href: "/journal",
    color: "bg-blue-500 hover:bg-blue-600",
    description: "Practice with journal prompts",
  },
  {
    title: "Start Speaking",
    icon: "🎤",
    href: "/monologue",
    color: "bg-green-500 hover:bg-green-600",
    description: "Record monologue responses",
  },
  {
    title: "AI Tutor",
    icon: "💬",
    href: "/tutor",
    color: "bg-purple-500 hover:bg-purple-600",
    description: "Chat with your AI tutor",
  },
  {
    title: "Voice Tutor",
    icon: "🗣️",
    href: "/voice-tutor",
    color: "bg-orange-500 hover:bg-orange-600",
    description: "Speak with voice tutor",
  },
];

export default function QuickActions() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-neutral-900">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={action.href}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`${action.color} text-white rounded-lg p-6 cursor-pointer transition-all shadow-md hover:shadow-lg`}
              >
                <div className="text-center">
                  <div className="text-4xl mb-3">{action.icon}</div>
                  <h3 className="font-bold text-lg mb-1">{action.title}</h3>
                  <p className="text-xs text-white/80">{action.description}</p>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
