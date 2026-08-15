/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        authem: {
          green: "#00805D",
          greenHover: "#00664A",
          dark: "#0F172A",
          border: "#E4E4E7",
          grayBg: "#F4F4F5"
        }
      }
    },
  },
  plugins: [],
}