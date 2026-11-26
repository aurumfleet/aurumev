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
        se: {
          white: "#FFFFFF",
          bg: "#F4F4F4",
          surface: "#EBEBEB",
          black: "#000000",
          ink: "#0F0F0F",
          charcoal: "#1F1F1F",
          muted: "#666666",
          subtle: "#828587",
          mango: "#FCAA30",
          "mango-hover": "#FFB94D",
          blue: "#0667F4",
          navy: "#152635",
          green: "#13B75E",
          "green-tint": "#C2F7C8",
        },
        aurum: {
          navy: "#152635",
          gold: "#FCAA30",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-plus-jakarta)", "var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 8px 30px rgba(0, 0, 0, 0.05)",
        elevated: "0 20px 50px rgba(0, 0, 0, 0.12)",
        glass: "0 4px 20px rgba(0, 0, 0, 0.08)",
      },
      borderRadius: {
        "2xl": "20px",
        "3xl": "24px",
        "4xl": "32px",
      },
      keyframes: {
        "slide-progress": {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
        "float-subtle": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        "slide-progress": "slide-progress 5.2s linear forwards",
        "float-subtle": "float-subtle 5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
