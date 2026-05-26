import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: "#fff9eb",
          100: "#f9ecc7",
          300: "#deb45f",
          500: "#b88a2c",
          700: "#7d5d1e",
        },
      },
      boxShadow: {
        luxury: "0 28px 80px rgba(18, 18, 18, 0.08)",
        soft: "0 18px 45px rgba(18, 18, 18, 0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
