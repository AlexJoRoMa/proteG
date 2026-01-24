import {heroui} from "@heroui/react";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/components/**/*.{js,mjs}"
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