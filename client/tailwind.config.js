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
          950: '#061117',
          900: '#08171f',
          850: '#0c222e',
          800: '#10303c',
          750: '#153b49',
          700: '#1b4b5d',
          600: '#236077',
        },
        brand: {
          teal: '#2dd4bf',
          tealDark: '#14b8a6',
          cyan: '#06b6d4',
          gold: '#f5b942',
          amber: '#f59e0b',
          green: '#4ade80',
          rose: '#f43f5e',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
