import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["EB Garamond", "Georgia", "serif"],
        display: ["var(--font-inter)", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        sans: ["var(--font-inter)", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["SF Mono", "Consolas", "Monaco", "monospace"],
      },

      spacing: {
        0: "0px",
        px: "1px",
        0.5: "2px",
        1: "4px",
        1.5: "6px",
        2: "8px",
        3: "12px",
        4: "16px",
        5: "20px",
        6: "24px",
        7: "28px",
        8: "32px",
        9: "36px",
        10: "40px",
        11: "44px",
        12: "48px",
        14: "56px",
        16: "64px",
        20: "80px",
        24: "96px",
        28: "112px",
        32: "128px",
        36: "144px",
        40: "160px",
        48: "192px",
        56: "224px",
        64: "256px",
      },

      colors: {
        white: "#FFFFFF",
        black: "#000000",

        // Premium dark backgrounds
        dark: {
          DEFAULT: "#050509",
          50: "#0B0C10",
          100: "#0F1015",
          200: "#14151A",
          300: "#1A1B21",
          400: "#22232A",
          500: "#2A2B33",
          600: "#35363F",
          700: "#45464F",
          800: "#5A5B65",
          900: "#75767F",
        },

        // Text colors with proper contrast
        text: {
          primary: "#FFFFFF",
          secondary: "#E3E3E3",
          muted: "#9CA3AF",
          dim: "#6B7280",
        },

        neutral: {
          50: "#FAFAFA",
          100: "#F5F5F5",
          200: "#E5E5E5",
          300: "#D4D4D4",
          400: "#A3A3A3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
          950: "#0A0A0A",
        },

        // Electric Blue
        electric: {
          DEFAULT: "#0066FF",
          50: "#EBF4FF",
          100: "#D6E9FF",
          200: "#B3D7FF",
          300: "#80BFFF",
          400: "#4DA6FF",
          500: "#0066FF",
          600: "#0052CC",
          700: "#003D99",
          800: "#002966",
          900: "#001433",
          950: "#000A1A",
        },

        // 4-color gradient palette (unified)
        accent: {
          // Primary: purple-blue
          blue: "#6366F1",
          purple: "#8B5CF6",
          // Secondary: pink-magenta
          magenta: "#EC4899",
          pink: "#F472B6",
          // Accent: aqua/cyan
          cyan: "#22D3EE",
          aqua: "#06B6D4",
        },

        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444",

        gray: {
          50: "#FAFAFA",
          100: "#F5F5F5",
          200: "#E5E5E5",
          300: "#D4D4D4",
          400: "#A3A3A3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
          950: "#0A0A0A",
        },
      },

      fontSize: {
        xs: ["12px", { lineHeight: "16px", letterSpacing: "0.01em" }],
        sm: ["14px", { lineHeight: "20px", letterSpacing: "0" }],
        base: ["16px", { lineHeight: "24px", letterSpacing: "0" }],
        lg: ["18px", { lineHeight: "28px", letterSpacing: "-0.01em" }],
        xl: ["20px", { lineHeight: "28px", letterSpacing: "-0.01em" }],
        "2xl": ["24px", { lineHeight: "32px", letterSpacing: "-0.02em" }],
        "3xl": ["32px", { lineHeight: "40px", letterSpacing: "-0.02em" }],
        "4xl": ["40px", { lineHeight: "48px", letterSpacing: "-0.03em" }],
        "5xl": ["56px", { lineHeight: "64px", letterSpacing: "-0.04em" }],
        "6xl": ["72px", { lineHeight: "80px", letterSpacing: "-0.05em" }],
        "7xl": ["96px", { lineHeight: "104px", letterSpacing: "-0.06em" }],
      },

      fontWeight: {
        light: "300",
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        extrabold: "800",
      },

      borderRadius: {
        none: "0",
        sm: "4px",
        DEFAULT: "8px",
        md: "12px",
        lg: "16px",
        xl: "20px",
        "2xl": "24px",
        "3xl": "32px",
        full: "9999px",
      },

      boxShadow: {
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.04)",
        DEFAULT: "0 1px 3px 0 rgba(0, 0, 0, 0.06), 0 1px 2px -1px rgba(0, 0, 0, 0.04)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.04)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04)",
        xl: "0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)",
        "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        // Apple Card-style soft shadows
        "card": "0 4px 24px -4px rgba(0, 0, 0, 0.3), 0 0 1px rgba(255, 255, 255, 0.05)",
        "card-hover": "0 8px 40px -8px rgba(0, 0, 0, 0.4), 0 0 1px rgba(255, 255, 255, 0.08)",
        "card-elevated": "0 16px 64px -16px rgba(0, 0, 0, 0.5), 0 0 1px rgba(255, 255, 255, 0.1)",
        // Soft glow effects
        "glow": "0 0 40px rgba(139, 92, 246, 0.2), 0 0 80px rgba(139, 92, 246, 0.1)",
        "glow-lg": "0 0 60px rgba(139, 92, 246, 0.25), 0 0 120px rgba(139, 92, 246, 0.15)",
        "glow-blue": "0 0 40px rgba(99, 102, 241, 0.25), 0 0 80px rgba(99, 102, 241, 0.15)",
        "glow-pink": "0 0 40px rgba(236, 72, 153, 0.25), 0 0 80px rgba(236, 72, 153, 0.15)",
        // Button glow
        "btn-glow": "0 4px 16px rgba(139, 92, 246, 0.4), 0 0 40px rgba(139, 92, 246, 0.2)",
        "btn-glow-hover": "0 8px 24px rgba(139, 92, 246, 0.5), 0 0 60px rgba(139, 92, 246, 0.3)",
        none: "none",
      },

      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        // Unified soft diffusion gradient (Apple-like)
        "gradient-brand": "linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%)",
        "gradient-brand-hover": "linear-gradient(135deg, #818CF8 0%, #A78BFA 50%, #F472B6 100%)",
        "gradient-brand-soft": "linear-gradient(135deg, rgba(99, 102, 241, 0.8) 0%, rgba(139, 92, 246, 0.8) 50%, rgba(236, 72, 153, 0.8) 100%)",
        // Section transition gradients
        "gradient-dark": "linear-gradient(180deg, #050509 0%, #0B0C10 100%)",
        "gradient-section": "linear-gradient(180deg, transparent 0%, rgba(11, 12, 16, 0.8) 50%, transparent 100%)",
        "gradient-vignette": "radial-gradient(ellipse at center, transparent 0%, rgba(5, 5, 9, 0.6) 100%)",
        "noise": "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
      },

      maxWidth: {
        container: "1080px",
        "container-lg": "1280px",
        "container-xl": "1440px",
      },

      keyframes: {
        "slide-in": {
          "0%": { transform: "translateX(2rem)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-down": {
          "0%": { opacity: "0", transform: "translateY(-24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-12px) rotate(1deg)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
        "gradient-shift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 40px rgba(139, 92, 246, 0.2), 0 0 80px rgba(139, 92, 246, 0.1)" },
          "50%": { boxShadow: "0 0 60px rgba(139, 92, 246, 0.35), 0 0 120px rgba(139, 92, 246, 0.2)" },
        },
      },
      animation: {
        "slide-in": "slide-in 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-in": "fade-in 0.4s ease-out",
        "fade-in-up": "fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-in-down": "fade-in-down 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        "scale-in": "scale-in 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "float": "float 6s ease-in-out infinite",
        "float-slow": "float-slow 8s ease-in-out infinite",
        "pulse-glow": "pulse-glow 4s ease-in-out infinite",
        "gradient-shift": "gradient-shift 8s ease infinite",
        "shimmer": "shimmer 2s linear infinite",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
