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
        primary: {
          DEFAULT: "#DA3F3F",
          light: "#E86363",
          dark: "#B82E2E",
        },
        secondary: "#000000",
        text: {
          DEFAULT: "#666666",
          light: "#7E7E7E",
          lighter: "#ABABAB",
        },
        heading: "#000000",
        border: {
          DEFAULT: "#EEEEEE",
          light: "#EDEDED",
          "light-02": "#E9E9E9",
          "light-03": "#E6E6E6",
        },
        background: {
          DEFAULT: "#FFFFFF",
          grey: "#F8F8F8",
          "light-grey": "#F9F9FB",
        },
      },
      fontFamily: {
        sans: ["Jost", "system-ui", "sans-serif"],
        heading: ["Jost", "system-ui", "sans-serif"],
      },
      container: {
        center: true,
        padding: "1rem",
        screens: {
          sm: "640px",
          md: "768px",
          lg: "1024px",
          xl: "1280px",
          "2xl": "1510px",
        },
      },
    },
  },
  plugins: [],
};

export default config;