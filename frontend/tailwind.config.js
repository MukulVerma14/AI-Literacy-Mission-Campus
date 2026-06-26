/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1a73e8",
        success: "#34a853",
        warning: "#fbbc04",
        danger: "#ea4335",
        darkbg: "#0f172a",
        cardbg: "#ffffff",
        text: "#1e293b",
        track: {
          blue: "#1a73e8",
          green: "#34a853",
          orange: "#f97316",
        }
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      }
    },
  },
  plugins: [],
}
