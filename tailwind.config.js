/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: {
          50:  "#fdf8f0",
          100: "#f5e9d0",
          200: "#ead4a8",
          300: "#d9b87a",
          400: "#c9a84c",
          500: "#b8922e",
          600: "#9a7622",
          700: "#7a5c1a",
          800: "#5a4212",
          900: "#3a2a0a",
        },
        ink: {
          DEFAULT: "#0d0a06",
          light: "#1a140c",
          muted: "#2e2518",
        },
        gold: {
          DEFAULT: "#C9A84C",
          light: "#e2c97e",
          dark: "#9a7226",
        },
      },
      fontFamily: {
        cinzel: ["Cinzel", "serif"],
        garamond: ["EB Garamond", "serif"],
      },
      animation: {
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "beam": "beam 2s linear infinite",
        "shimmer": "shimmer 2s linear infinite",
        "float": "float 3s ease-in-out infinite",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 5px #C9A84C, 0 0 10px #C9A84C" },
          "50%": { boxShadow: "0 0 20px #C9A84C, 0 0 40px #C9A84C88" },
        },
        "beam": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      backgroundImage: {
        "parchment-grain": "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E\")",
      },
      boxShadow: {
        "gold": "0 0 15px rgba(201,168,76,0.4), 0 4px 20px rgba(0,0,0,0.6)",
        "gold-lg": "0 0 30px rgba(201,168,76,0.6), 0 8px 40px rgba(0,0,0,0.8)",
      },
    },
  },
  plugins: [],
}
