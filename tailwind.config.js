/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eeecfe',
          100: '#ddd8fe',
          200: '#c8c0fe',
          300: '#ae9ffe',
          400: '#917cfc',
          500: '#7c5cf8',
          600: '#6338f4',
          700: '#5024e8',
          800: '#431eb3',
          900: '#3b1fa0',
        },
        secondary: {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
        },
      },
    },
  },
  plugins: [],
}
