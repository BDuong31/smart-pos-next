/** @type {import('tailwindcss').Config} */
import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/layouts/**/*.{js,ts,jsx,tsx,mdx}',
    './src/sections/**/*.{js,ts,jsx,tsx,mdx}',
    './src/context/**/*.{js,ts,jsx,tsx,mdx}',
    './src/utils/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    colors : {
      blue : "#4A69E2",
      yellow: "#FFA52F",
      white: "#FFF",
      fawhite: "#FAFAFA",
      gray: "#E7E7E3",
      graymain: "#70706E",
      darkgrey: "#232321",
      
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      accentColor: {
        black: '#000000', 
      },
      screens: {
        '3xl': '1800px',
      }
    },
  },
  plugins: [require('daisyui'),require('@tailwindcss/forms'), require('tailwind-scrollbar-hide')],
};
export default config;
