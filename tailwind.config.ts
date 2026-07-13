import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: ["selector", '[data-mode="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-dm-sans)", "DM Sans", "sans-serif"],
      },
      fontSize: {
        "display-2xl": ["clamp(4rem, 9vw, 8rem)", { lineHeight: "0.95", letterSpacing: "-0.03em" }],
        "display-xl": [
          "clamp(3rem, 6.5vw, 5.5rem)",
          { lineHeight: "0.98", letterSpacing: "-0.025em" },
        ],
        "display-lg": [
          "clamp(2.25rem, 4.5vw, 4rem)",
          { lineHeight: "1.02", letterSpacing: "-0.02em" },
        ],
        "display-md": [
          "clamp(1.75rem, 3vw, 2.75rem)",
          { lineHeight: "1.05", letterSpacing: "-0.015em" },
        ],
        headline: [
          "clamp(1.25rem, 1.6vw, 1.625rem)",
          { lineHeight: "1.2", letterSpacing: "-0.005em" },
        ],
        "body-lg": ["1.125rem", { lineHeight: "1.6", letterSpacing: "0" }],
        body: ["1rem", { lineHeight: "1.55", letterSpacing: "0" }],
        "body-sm": ["0.9375rem", { lineHeight: "1.5", letterSpacing: "0" }],
        caption: ["0.8125rem", { lineHeight: "1.4", letterSpacing: "0.02em" }],
        eyebrow: ["0.75rem", { lineHeight: "1.2", letterSpacing: "0.14em" }],
      },
      colors: {
        foreground: "var(--foreground)",
        background: "var(--background)",
        ink: {
          900: "var(--ink-900)",
          800: "var(--ink-800)",
          700: "var(--ink-700)",
          500: "var(--ink-500)",
          300: "var(--ink-300)",
          200: "var(--ink-200)",
          100: "var(--ink-100)",
          50: "var(--ink-50)",
        },
        accent: "var(--accent)",
      },
      maxWidth: {
        prose: "68ch",
      },
      spacing: {
        section: "120px",
      },
    },
  },
  plugins: [],
};

export default config;
