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
          gold:   "#F5C518",
          navy:   "#1a1a2e",
          ink:    "#1a1a2e",
          mist:   "#f4f5f8",
          warm:   "#FFF8DC",
          border: "#e8eaf0",
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
        "hero-grid": "radial-gradient(ellipse at 60% 50%, #1e2d5a 0%, #0d1a2e 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
