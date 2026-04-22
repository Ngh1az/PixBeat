/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#05070f",
        panel: "#09121a",
        "neon-green": "#48ff8e",
        "neon-cyan": "#4de8ff",
        "neon-magenta": "#ff4ddd",
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', "monospace"],
      },
      boxShadow: {
        pixel: "2px 2px 0 #48ff8e",
        "pixel-cyan": "2px 2px 0 #4de8ff",
        "pixel-magenta": "2px 2px 0 #ff4ddd",
      },
    },
  },
  plugins: [],
};
