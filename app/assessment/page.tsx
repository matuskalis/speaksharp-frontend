"use client";

import PlacementTest from "../components/PlacementTest";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Elegant floating shape component
function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-white/[0.08]",
}: {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  gradient?: string;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -150,
        rotate: rotate - 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: rotate,
      }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      className={cn("absolute", className)}
    >
      <motion.div
        animate={{
          y: [0, 15, 0],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{
          width,
          height,
        }}
        className="relative"
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            "bg-gradient-to-r to-transparent",
            gradient,
            "backdrop-blur-[2px] border-2 border-white/[0.15]",
            "shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]",
            "after:absolute after:inset-0 after:rounded-full",
            "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]"
          )}
        />
      </motion.div>
    </motion.div>
  );
}

export default function AssessmentPage() {
  return (
    <main className="min-h-screen bg-[#030303] relative overflow-hidden">
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.03] via-transparent to-rose-500/[0.03] blur-3xl" />

        {/* Floating shapes - positioned differently for variety */}
        <ElegantShape
          delay={0.2}
          width={400}
          height={100}
          rotate={8}
          gradient="from-indigo-500/[0.12]"
          className="left-[-5%] top-[10%]"
        />
        <ElegantShape
          delay={0.4}
          width={350}
          height={90}
          rotate={-12}
          gradient="from-rose-500/[0.12]"
          className="right-[-3%] top-[60%]"
        />
        <ElegantShape
          delay={0.3}
          width={250}
          height={70}
          rotate={15}
          gradient="from-violet-500/[0.12]"
          className="left-[10%] bottom-[15%]"
        />
        <ElegantShape
          delay={0.5}
          width={180}
          height={50}
          rotate={-20}
          gradient="from-cyan-500/[0.12]"
          className="right-[20%] top-[20%]"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 py-12">
        <PlacementTest />
      </div>
    </main>
  );
}
