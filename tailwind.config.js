/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // CHANGED: UX-optimierte Primärfarbe #0152be mit exakten Abstufungen für Hover/Active
        primary: {
          DEFAULT: '#0152be', // Basis-Primärfarbe
          50: '#eff8ff',
          100: '#dbeeff',
          200: '#bfe2ff',
          300: '#93d0ff',
          400: '#60b4ff',
          500: '#0152be', // Hauptfarbe
          600: '#014aa8', // 90% für Hover
          700: '#013d8c', // 80% für Active
          800: '#012f70', // 70% für starken Kontrast
          900: '#012154', // 60% für dunklere Varianten
          950: '#0a1a3a',
        },
        // Sekundärfarbe: Dunkleres Blau für Kontrast und Tiefe
        secondary: {
          DEFAULT: '#0a1a3a', // Sehr dunkles Blau für Kontrast
          50: '#eff8ff',
          100: '#dbeeff',
          200: '#bfe2ff',
          300: '#93d0ff',
          400: '#60b4ff',
          500: '#3b96ff',
          600: '#2575f5',
          700: '#1d5ee1',
          800: '#1e4bb6',
          900: '#0a1a3a',
          950: '#030810',
        },
        // Akzentfarbe bleibt für CTAs
        accent: {
          DEFAULT: '#EF4444', // Red-500 für wichtige Aktionen
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
        },
        // Erfolgsfarbe für positive Aktionen
        success: {
          DEFAULT: '#10B981', // Emerald-500
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
        },
        // Neutrale Farben für Text und UI
        neutral: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        }
      },
      fontFamily: {
        // NEU: Starke, professionelle Schriftfamilien für seriöses Design
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        heading: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      backgroundImage: {
        // NEU: Hero overlay mit starker Primärfarbe #0152be
        'hero-overlay': 'linear-gradient(135deg, rgba(1, 82, 190, 0.5) 0%, rgba(10, 26, 58, 0.6) 100%)',
        'hero-overlay-light': 'linear-gradient(135deg, rgba(1, 82, 190, 0.1) 0%, rgba(10, 26, 58, 0.05) 100%)',
        'gradient-primary': 'linear-gradient(135deg, #0152be 0%, #1e4bb6 100%)',
      },
      boxShadow: {
        // NEU: Schatten mit starker Primärfarbe #0152be
        'primary': '0 4px 14px 0 rgba(1, 82, 190, 0.3)',
        'primary-lg': '0 10px 25px -3px rgba(1, 82, 190, 0.4)',
        'primary-xl': '0 20px 40px -12px rgba(1, 82, 190, 0.5)',
        'accent': '0 4px 14px 0 rgba(239, 68, 68, 0.25)',
        'soft': '0 4px 20px 0 rgba(0, 0, 0, 0.05)',
        'strong': '0 8px 32px 0 rgba(1, 82, 190, 0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.8s ease-out forwards',
        'slide-in-right': 'slideInRight 0.5s ease-out forwards',
        'scale-in': 'scaleIn 0.5s ease-out forwards',
        'bounce-soft': 'bounceSoft 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      spacing: {
        // CHANGED: UX-optimierte Spacing-Tokens (4px-Basis für konsistente Abstände)
        '1': '0.25rem',   // 4px
        '2': '0.5rem',    // 8px
        '3': '0.75rem',   // 12px
        '4': '1rem',      // 16px - Mobile base padding
        '5': '1.25rem',   // 20px - Tablet padding
        '6': '1.5rem',    // 24px - Mobile section spacing
        '8': '2rem',      // 32px - Desktop padding
        '10': '2.5rem',   // 40px - Tablet section spacing
        '12': '3rem',     // 48px - Small desktop sections
        '16': '4rem',     // 64px - Large desktop sections
        '18': '4.5rem',   // 72px
        '20': '5rem',     // 80px - Extra large sections
        '88': '22rem',
        '128': '32rem',
        // CHANGED: Touch-Target minimums (Fitts' Law)
        'touch-min': '2.75rem', // 44px minimum touch target
        'touch-comfort': '3rem', // 48px comfortable touch target
        // CHANGED: Content max-widths
        'content': '75rem',     // 1200px - Container max-width
        'text': '65ch',         // 60-75 Zeichen optimal für Lesbarkeit
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
}
