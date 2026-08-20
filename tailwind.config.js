/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f5fa',
          100: '#e1ebd5',
          800: '#143556',
          900: '#0F2942', // Primary Government Navy
          950: '#0a1b2d',
        },
        civic: {
          blue: '#1D4ED8',
          lightBlue: '#E0F2FE',
          green: '#10B981',
          orange: '#F59E0B',
          red: '#EF4444',
          gold: '#D97706',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'sans-serif'],
        tamil: ['Mukta Malar', 'Noto Sans Tamil', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
