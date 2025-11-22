import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Spacing scale: 4/8/12/16/20/24/32/40/48/64
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
      },
      // Typography
      fontSize: {
        'caption': ['12px', { lineHeight: '16px', fontWeight: '400' }],
        'body': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'body-lg': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'h4': ['18px', { lineHeight: '28px', fontWeight: '600' }],
        'h3': ['20px', { lineHeight: '28px', fontWeight: '600' }],
        'h2': ['24px', { lineHeight: '32px', fontWeight: '700' }],
        'h1': ['32px', { lineHeight: '40px', fontWeight: '700' }],
        'display': ['40px', { lineHeight: '48px', fontWeight: '800' }],
      },
      // Design system colors
      colors: {
        background: {
          DEFAULT: '#030303',
          secondary: 'rgba(255, 255, 255, 0.03)',
          tertiary: 'rgba(255, 255, 255, 0.05)',
        },
        border: {
          DEFAULT: 'rgba(255, 255, 255, 0.08)',
          strong: 'rgba(255, 255, 255, 0.12)',
        },
        text: {
          primary: 'rgba(255, 255, 255, 0.90)',
          secondary: 'rgba(255, 255, 255, 0.70)',
          tertiary: 'rgba(255, 255, 255, 0.50)',
          quaternary: 'rgba(255, 255, 255, 0.40)',
        },
        primary: {
          DEFAULT: '#6366f1', // indigo-500
          hover: '#4f46e5', // indigo-600
          light: 'rgba(99, 102, 241, 0.1)',
        },
        accent: {
          DEFAULT: '#f43f5e', // rose-500
          hover: '#e11d48', // rose-600
          light: 'rgba(244, 63, 94, 0.1)',
        },
      },
      // Border radius
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '20px',
      },
      // Shadows
      boxShadow: {
        'glow': '0 8px 32px 0 rgba(255, 255, 255, 0.1)',
        'glow-strong': '0 8px 32px 0 rgba(255, 255, 255, 0.2)',
      },
    },
  },
  plugins: [],
};
export default config;
