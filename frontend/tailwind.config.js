/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],

  theme: {
    extend: {
      /* ===============================
         COLOR SYSTEM (DESIGN TOKENS)
         =============================== */
      colors: {
        /* Backgrounds */
        primary: "#0F172A",     // deep navy
        secondary: "#111827",   // charcoal

        /* Borders & structure */
        muted: "#334155",       // border-muted
        subtle: "#475569",

        /* Text */
        textPrimary: "#E5E7EB",
        textSecondary: "#94A3B8",

        /* Accent (USE VERY RARELY) */
        accent: "#06B6D4",      // cyan-teal

        /* Semantic status */
        success: "#16A34A",     // status-green
        warning: "#D97706",     // status-amber
        danger: "#DC2626",      // status-red
      },

      /* ===============================
         TYPOGRAPHY (FIXED + UPGRADED)
         =============================== */
      fontFamily: {
        /* Headings / Titles */
        heading: [
          "Space Grotesk",
          "system-ui",
          "sans-serif",
        ],

        /* Body text */
        sans: [
          "Inter",
          "IBM Plex Sans",
          "Source Sans 3",
          "system-ui",
          "sans-serif",
        ],

        /* Code / Metrics */
        mono: [
          "JetBrains Mono",
          "Fira Code",
          "Roboto Mono",
          "monospace",
        ],
      },

      /* ===============================
         SPACING SYSTEM
         =============================== */
      spacing: {
        layout: "2.5rem",   // page padding
        section: "1.75rem", // vertical rhythm
      },

      /* ===============================
         UI DISCIPLINE
         =============================== */
      borderWidth: {
        thin: "1px",
      },

      boxShadow: {
        subtle: "0 0 0 1px rgba(51,65,85,0.6)",
        accent: "0 0 0 2px rgba(6,182,212,0.35)",
      },
    },
  },

  plugins: [],
};
