/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        red: {
          50: "#fff5f5",
          100: "#ffe0e0",
          200: "#ffb3b3",
          300: "#ff8080",
          400: "#ff4d4d",
          500: "#f5222d",
          600: "#cf1322",
          700: "#a8071a",
          800: "#820014",
          900: "#5c0011",
          950: "#3d000a",
        },
        gold: {
          50: "#fffbe6",
          100: "#fff1b8",
          200: "#ffe58f",
          300: "#ffd666",
          400: "#ffc53d",
          500: "#faad14",
          600: "#d48806",
          700: "#ad6800",
          800: "#874d00",
          900: "#613400",
        },
      },
      fontFamily: {
        serif: ["Noto Serif SC", "SimSun", "serif"],
        display: ["ZCOOL XiaoWei", "KaiTi", "serif"],
      },
      boxShadow: {
        "glow-gold": "0 0 20px rgba(250, 173, 20, 0.4)",
        "glow-gold-sm": "0 0 10px rgba(250, 173, 20, 0.3)",
        card: "0 4px 20px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "scroll-x": "scrollX 20s linear infinite",
      },
      keyframes: {
        scrollX: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};
