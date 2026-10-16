import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "rgb(var(--bg) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        fg: "rgb(var(--fg) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        line: "rgb(var(--line) / <alpha-value>)",
        brand: {
          DEFAULT: "rgb(var(--brand) / <alpha-value>)",
          fg: "rgb(var(--brand-fg) / <alpha-value>)",
        },
        accent: "rgb(var(--accent) / <alpha-value>)",
        cedar: "rgb(var(--cedar) / <alpha-value>)",
        graphite: "rgb(var(--graphite) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-archivo)", "system-ui", "sans-serif"],
      },
      fontSize: {
        xs: ["0.8125rem", { lineHeight: "1.5" }],
        sm: ["0.9375rem", { lineHeight: "1.55" }],
        base: ["1.0625rem", { lineHeight: "1.65" }],
        lg: ["1.25rem", { lineHeight: "1.55" }],
        xl: ["clamp(1.5rem, 1.2rem + 1vw, 2rem)", { lineHeight: "1.2" }],
        "2xl": ["clamp(2rem, 1.4rem + 2.2vw, 3rem)", { lineHeight: "1.05" }],
        "3xl": ["clamp(2.5rem, 1.5rem + 3.6vw, 4.75rem)", { lineHeight: "1" }],
        display: ["clamp(2.75rem, 1.2rem + 6.2vw, 8rem)", { lineHeight: "0.95" }],
      },
      maxWidth: {
        page: "1360px",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.22, 1, 0.36, 1)",
        "in-out": "cubic-bezier(0.65, 0, 0.35, 1)",
      },
    },
  },
  plugins: [],
};
export default config;
