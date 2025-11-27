import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Bespoke type pairing - Display + System
      fontFamily: {
        display: ["var(--font-inter)", "-apple-system", "BlinkMacSystemFont", "sans-serif"], // Headlines, numbers
        sans: ["var(--font-inter)", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"], // Body
        mono: ["SF Mono", "Consolas", "Monaco", "monospace"], // Code, technical
      },

      // Strict spacing scale - Apple standard
      spacing: {
        // Micro spacing
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
        // Macro spacing
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

      // Bespoke color system - Single dominant accent
      colors: {
        // Neutral foundation
        white: "#FFFFFF",
        black: "#000000",
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
        // Electric Blue - THE brand accent (AI intelligence + trust)
        electric: {
          DEFAULT: "#0066FF",
          50: "#EBF4FF",
          100: "#D6E9FF",
          200: "#B3D7FF",
          300: "#80BFFF",
          400: "#4DA6FF",
          500: "#0066FF", // Primary
          600: "#0052CC",
          700: "#003D99",
          800: "#002966",
          900: "#001433",
          950: "#000A1A",
        },
        // Semantic (subdued, not competing with electric)
        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444",
        // Legacy mappings for gradual migration
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
        charcoal: {
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
        "deep-blue": {
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
      },

      // Premium typography scale with line heights
      fontSize: {
        // Small text
        xs: ["12px", { lineHeight: "16px", letterSpacing: "0.01em" }],
        sm: ["14px", { lineHeight: "20px", letterSpacing: "0" }],
        base: ["16px", { lineHeight: "24px", letterSpacing: "0" }],
        // Body sizes
        lg: ["18px", { lineHeight: "28px", letterSpacing: "-0.01em" }],
        xl: ["20px", { lineHeight: "28px", letterSpacing: "-0.01em" }],
        // Headlines
        "2xl": ["24px", { lineHeight: "32px", letterSpacing: "-0.02em" }],
        "3xl": ["32px", { lineHeight: "40px", letterSpacing: "-0.02em" }],
        "4xl": ["40px", { lineHeight: "48px", letterSpacing: "-0.03em" }],
        "5xl": ["56px", { lineHeight: "64px", letterSpacing: "-0.04em" }],
        "6xl": ["72px", { lineHeight: "80px", letterSpacing: "-0.05em" }],
        "7xl": ["96px", { lineHeight: "104px", letterSpacing: "-0.06em" }],
      },

      // Premium font weights
      fontWeight: {
        light: "300",
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
      },

      // Precise border radius
      borderRadius: {
        none: "0",
        sm: "4px",
        DEFAULT: "8px",
        md: "12px",
        lg: "16px",
        xl: "20px",
        "2xl": "24px",
        full: "9999px",
      },

      // Subtle shadow system
      boxShadow: {
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.04)",
        DEFAULT: "0 1px 3px 0 rgba(0, 0, 0, 0.06), 0 1px 2px -1px rgba(0, 0, 0, 0.04)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.04)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04)",
        xl: "0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)",
        none: "none",
      },

      // Container system - centered column
      maxWidth: {
        container: "1080px",
        "container-lg": "1280px",
        "container-xl": "1440px",
      },
    },
  },
  plugins: [],
};

export default config;
