import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
    "./data/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ["var(--font-cormorant)", "serif"],
        body: ["var(--font-manrope)", "sans-serif"]
      },
      colors: {
        coffee: {
          cream: "#F7F2EA",
          card: "#FFFDF9",
          light: "#EFE4D3",
          text: "#2A201A",
          "text-secondary": "#5D4B3E",
          bronze: "#B88A5A",
          gold: "#D6B37A",
          brown: "#6B4A32",
          dark: "#3A2A22",
          border: "rgba(107,74,50,0.12)"
        }
      },
      boxShadow: {
        luxury: "0 10px 40px rgba(107, 74, 50, 0.08)",
        "luxury-md": "0 8px 24px rgba(107, 74, 50, 0.06)",
        "luxury-lg": "0 20px 60px rgba(107, 74, 50, 0.1)"
      },
      borderRadius: {
        luxury: "18px",
        "luxury-lg": "24px"
      },
      spacing: {
        luxury: "80px",
        "luxury-half": "40px"
      }
    }
  },
  plugins: []
};

export default config;

