import { nextui } from "@nextui-org/theme";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neutral: {
          50: "#F2F2F2",
          100: "#E5E5E5",
          200: "#D4D4D4",
          300: "#B2B2B2",
          400: "#999999",
          500: "#777E85",
          600: "#495059",
          700: "#353C47",
          750: "#1F2937",
          800: "#11151A",
          900: "#090B0D",
        },
        primary: {
          50: "#F2CFCB",
          300: "#F2B0A9",
          500: "#F2938A",
          700: "#F2776B",
          900: "#F25849",
        },
        secondary: {
          50: "#BFF0F2",
          300: "#A5E2E5",
          500: "#92D0D4",
          700: "#79C8CC",
          900: "#3DC5CC",
        },
        success: {
          50: "#B6F2C3",
          300: "#A1E5B0",
          500: "#8AE59E",
          700: "#5BD877",
          900: "#2DCC50",
        },
        warning: {
          50: "#F9DCC7",
          300: "#F9BF95",
          500: "#F9AF7A",
          700: "#F9A161",
          900: "#F98735",
        },
        error: {
          50: "#F2AAAA",
          300: "#F27979",
          500: "#F23D3D",
          700: "#D92B2B",
          900: "#E51717",
        },
      },
      fontFamily: {
        default: ["var(--font-poppins)"],
        poppins: ["var(--font-poppins)"],
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
export default config;
