/**
 * tailwind.config.ts — full updated theme.extend section
 *
 * Merge this with your existing tailwind.config.ts.
 * This replaces/extends whatever you already have under theme.extend.
 */

import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        heading: ["var(--font-playfair)", "Georgia", "serif"],
        sans:    ["var(--font-dm-sans)", "system-ui", "sans-serif"],
      },


      colors: {
        brand: {
          primary: "#2563EB",   // blue-600
          secondary: "#10B981", // emerald-500
          accent: "#F59E0B",    // amber-500
          background: "#F9FAFB",
          card: "#FFFFFF",
          text: "#1F2937",
          // legacy alias names for existing classes (kept for compatibility)
          gold: "#F59E0B",
          navy: "#2563EB",
          ink: "#1F2937",
          mist: "#F9FAFB",
          border: "#E5E7EB",
          warm: "#F59E0B",
        },
      },

      boxShadow: {
        panel: "0 8px 32px rgba(0,0,0,0.10)",
      },

      animation: {
        "banner-in": "bannerIn 0.45s ease-out both",
        "hero-in": "heroIn 0.9s 0.3s both",
        marquee:   "marquee 30s linear infinite",
      },

      keyframes: {
        bannerIn: {
          from: { opacity: "0", transform: "translateY(-12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        heroIn: {
          from: { opacity: "0", transform: "translateY(22px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to:   { transform: "translateX(-50%)" },
        },
      },

      backgroundImage: {
        "hero-grid": "radial-gradient(ellipse at 60% 50%, rgba(0,82,204,0.15) 0%, rgba(23,43,77,0.95) 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
