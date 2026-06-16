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
      colors: {
        surface: "#0a0a0a",
        ink: "#f8f7f3",
        gold: "#d4af37",
        smoke: "#272727",
        charcoal: "#111111",
        accent: "#f2c777"
      },
      boxShadow: {
        glow: "0 20px 70px rgba(212, 175, 55, 0.15)"
      },
      backgroundImage: {
        hero: "radial-gradient(circle at top, rgba(212, 175, 55, 0.12), transparent 28%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08), transparent 20%)"
      }
    }
  },
  plugins: []
};

export default config;
