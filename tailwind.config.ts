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
        heading: ["var(--font-heading)", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },


      colors: {
        brand: {
          primary: "#1E72BA",
          "primary-dark": "#0152BE",
          "primary-light": "#E8F1FA",
          secondary: "#0152BE",
          accent: "#D70B52",
          "accent-dark": "#B00944",
          background: "#FFFFFF",
          muted: "#5C6672",
          card: "#FFFFFF",
          text: "#1A1A1A",
          gold: "#D70B52",
          navy: "#142850",
          ink: "#1A1A1A",
          mist: "#E8F1FA",
          border: "#D8E5F2",
          warm: "#FBE7EF",
        },
      },

      boxShadow: {
        panel: "0 8px 32px rgba(20,40,80,0.10)",
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
        "hero-grid": "radial-gradient(ellipse at 60% 50%, rgba(30,114,186,0.15) 0%, rgba(20,40,80,0.95) 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
