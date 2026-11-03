/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        waste: {
          glass: "#06b6d4",     // cyan-500
          cardboard: "#d97706", // amber-700 / orange-600
          paper: "#0ea5e9",     // sky-500
          metal: "#64748b",     // slate-500
          organic: "#10b981",   // emerald-500
          plastic: "#f59e0b",   // amber-500
        },
        dark: {
          bg: "#0B0F17",
          card: "#111827",
          cardHover: "#182234",
          border: "#1F2937",
          subtle: "#374151"
        }
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan': 'scan 2.5s ease-in-out infinite alternate',
        'conveyor': 'conveyor 1.2s linear infinite',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(0%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        conveyor: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '40px 0' },
        }
      }
    },
  },
  plugins: [],
};
