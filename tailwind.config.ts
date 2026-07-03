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
          primary: "#3B82F6",        // blue-500 — primary buttons, links
          "primary-dark": "#1D4ED8", // blue-700 — hover/active states
          "primary-light": "#DBEAFE",// blue-100 — light tints, badges
          secondary: "#1E40AF",      // blue-800
          accent: "#2563EB",         // blue-600 — secondary CTAs
          "accent-dark": "#1E3A8A",  // blue-900
          background: "#FFFFFF",
          muted: "#5C6672",
          card: "#FFFFFF",
          text: "#0F172A",           // slate-900, matches ink
          gold: "#3B82F6",           // was #D70B52 (pink) — now blue-500, used 414x
          navy: "#1E3A8A",           // blue-900 — deep navy anchor, used 188x
          ink: "#0F172A",            // slate-900 body text, used 671x
          mist: "#EEF4FC",           // near-white blue wash, used 133x
          border: "#DDE7F2",         // soft blue-gray hairline, used 407x
          warm: "#1E40AF",           // blue-800, was pink, used 9x
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