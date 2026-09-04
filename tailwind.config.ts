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
        molina: {
          DEFAULT: "#008A4B",
          light: "#00A859",
          mint: "#A8E6CF",
          dark: "#0F172A",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0, 138, 75, 0.12)",
        "glass-lg": "0 16px 48px rgba(0, 138, 75, 0.18)",
      },
      backgroundImage: {
        "gradient-molina": "linear-gradient(135deg, #008A4B 0%, #00A859 100%)",
        "gradient-radial": "radial-gradient(circle at top right, rgba(0, 168, 89, 0.15), transparent 50%)",
      },
    },
  },
  plugins: [],
};

export default config;
