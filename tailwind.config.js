/** @type {import('tailwindcss').Config} */
module.exports = {
  // Only scan files inside app/dashboard — keeps Tailwind's generated
  // utilities scoped to the dashboard, per your request to only use
  // Tailwind there for now.
  content: ["./app/dashboard/**/*.{ts,tsx}"],
  corePlugins: {
    // Disable Tailwind's base/reset styles so they can't leak into or
    // clash with the existing globals.css used by the landing + auth pages.
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        ink: "#0A0F1C",
        "ink-2": "#121A2B",
        "ink-3": "#1B2540",
        "ink-4": "#26314e",
        blue: "#3D8FFF",
        "blue-dim": "#1c3a66",
        teal: "#45D9B8",
        paper: "#EDEFF5",
        "paper-dim": "#8791A8",
        danger: "#FF5C5C",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Space Grotesk", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      borderRadius: {
        xl2: "14px",
      },
    },
  },
  plugins: [],
};
