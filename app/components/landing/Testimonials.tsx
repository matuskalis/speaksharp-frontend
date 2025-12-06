"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Maria Santos",
    country: "Brazil",
    flag: "BR",
    avatar: "M",
    quote: "The explanations feel like talking to a real teacher. I finally understand why I make certain mistakes.",
    rating: 5,
    gradientFrom: "from-accent-blue",
    gradientTo: "to-accent-purple",
  },
  {
    name: "Kenji Yamamoto",
    country: "Japan",
    flag: "JP",
    avatar: "K",
    quote: "I've tried many apps but Vorex is different. The spaced repetition helped me stop repeating mistakes.",
    rating: 5,
    gradientFrom: "from-accent-purple",
    gradientTo: "to-accent-pink",
  },
  {
    name: "Elena Kowalski",
    country: "Poland",
    flag: "PL",
    avatar: "E",
    quote: "Perfect for busy professionals. I practice during my commute and see real improvement.",
    rating: 5,
    gradientFrom: "from-accent-pink",
    gradientTo: "to-accent-cyan",
  },
  {
    name: "Ahmed Hassan",
    country: "Egypt",
    flag: "EG",
    avatar: "A",
    quote: "The AI understands context so well. It doesn't just correct grammar — it helps me sound natural.",
    rating: 5,
    gradientFrom: "from-accent-cyan",
    gradientTo: "to-accent-blue",
  },
  {
    name: "Sophie Chen",
    country: "Taiwan",
    flag: "TW",
    avatar: "S",
    quote: "I was nervous about writing in English. Now I feel confident because I know where to improve.",
    rating: 5,
    gradientFrom: "from-accent-blue",
    gradientTo: "to-accent-purple",
  },
];

export function Testimonials() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll);
      return () => el.removeEventListener("scroll", checkScroll);
    }
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="relative py-32 lg:py-40 bg-dark-50 overflow-hidden">
      {/* Section transition gradient - top */}
      <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-dark to-dark-50" />

      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-radial from-accent-purple/8 via-accent-blue/4 to-transparent animate-glow-breathe" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-radial from-accent-pink/6 to-transparent blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-radial from-accent-blue/6 to-transparent blur-3xl" />
      </div>

      <div className="relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16 lg:mb-20 px-5"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dark-200/80 border border-dark-400/50 mb-8"
          >
            <Quote className="w-4 h-4 text-accent-purple" />
            <span className="text-sm font-medium text-text-muted">Testimonials</span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mb-6 tracking-tight">
            Loved by Learners Worldwide
          </h2>
          <p className="text-text-secondary text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed">
            Join thousands improving their English with Vorex
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative max-w-container-xl mx-auto">
          {/* Scroll Buttons (Desktop) */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: canScrollLeft ? 1 : 0.3 }}
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`hidden lg:flex absolute left-6 top-1/2 -translate-y-1/2 z-10 w-14 h-14 items-center justify-center rounded-full glass border border-dark-400/50 transition-all duration-300 shadow-card ${
              canScrollLeft
                ? "hover:bg-dark-300/80 hover:border-dark-500 hover:shadow-card-hover cursor-pointer"
                : "cursor-not-allowed"
            }`}
          >
            <ChevronLeft className="w-6 h-6 text-text-primary" />
          </motion.button>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: canScrollRight ? 1 : 0.3 }}
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`hidden lg:flex absolute right-6 top-1/2 -translate-y-1/2 z-10 w-14 h-14 items-center justify-center rounded-full glass border border-dark-400/50 transition-all duration-300 shadow-card ${
              canScrollRight
                ? "hover:bg-dark-300/80 hover:border-dark-500 hover:shadow-card-hover cursor-pointer"
                : "cursor-not-allowed"
            }`}
          >
            <ChevronRight className="w-6 h-6 text-text-primary" />
          </motion.button>

          {/* Gradient fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-8 lg:w-20 bg-gradient-to-r from-dark-50 to-transparent z-[5] pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 lg:w-20 bg-gradient-to-l from-dark-50 to-transparent z-[5] pointer-events-none" />

          {/* Testimonials Scroll */}
          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto scrollbar-hide px-5 lg:px-24 pb-4 snap-x-mandatory"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="flex-shrink-0 w-[300px] snap-start"
              >
                <TestimonialCard {...testimonial} />
              </motion.div>
            ))}
          </div>

          {/* Scroll progress dots (mobile) */}
          <div className="flex lg:hidden justify-center gap-2 mt-6 px-5">
            {testimonials.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === 0 ? "w-6 bg-gradient-brand" : "w-1.5 bg-dark-400"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Section transition gradient - bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-dark to-dark-50" />
    </section>
  );
}

function TestimonialCard({
  name,
  country,
  flag,
  avatar,
  quote,
  rating,
  gradientFrom,
  gradientTo,
}: {
  name: string;
  country: string;
  flag: string;
  avatar: string;
  quote: string;
  rating: number;
  gradientFrom: string;
  gradientTo: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="group h-full"
    >
      <div className="relative h-full gradient-border rounded-2xl">
        <div className="relative h-full glass rounded-2xl p-6 flex flex-col transition-all duration-300 group-hover:bg-dark-100/90">
          {/* Rating */}
          <div className="flex gap-1 mb-5">
            {Array.from({ length: rating }).map((_, i) => (
              <motion.svg
                key={i}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
                className="w-4 h-4 fill-amber-400 text-amber-400"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </motion.svg>
            ))}
          </div>

          {/* Quote */}
          <p className="text-text-secondary text-sm leading-relaxed flex-1 mb-6">
            "{quote}"
          </p>

          {/* Author */}
          <div className="flex items-center gap-3">
            {/* Avatar with gradient ring */}
            <div className="relative">
              {/* Gradient ring */}
              <div className={`absolute -inset-0.5 rounded-full bg-gradient-to-br ${gradientFrom} ${gradientTo} opacity-70 group-hover:opacity-100 transition-opacity duration-300`} />

              {/* Avatar inner */}
              <div className="relative w-10 h-10 rounded-full bg-dark-200 flex items-center justify-center">
                <span className={`text-sm font-bold bg-gradient-to-br ${gradientFrom} ${gradientTo} bg-clip-text text-transparent`}>
                  {avatar}
                </span>
              </div>
            </div>

            {/* Name & Country */}
            <div>
              <p className="text-sm font-semibold text-text-primary">{name}</p>
              <p className="text-xs text-text-muted flex items-center gap-1.5">
                <span>{getFlagEmoji(flag)}</span>
                {country}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function getFlagEmoji(countryCode: string): string {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}
