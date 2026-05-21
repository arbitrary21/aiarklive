import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: "var(--surface)",
        "surface-elevated": "var(--surface-elevated)",
        muted: "var(--muted)",
        border: "var(--border)",
        brand: {
          300: "var(--brand-300)",
          500: "var(--brand-500)",
        },
        accent: {
          500: "var(--accent-500)",
        },
      },
    },
  },
  plugins: [],
};
export default config;
