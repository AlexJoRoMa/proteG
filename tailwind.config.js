import {heroui} from "@heroui/react";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  safelist: [
    'bg-black-0/80'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-lato)'],
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()]
}

export default config;