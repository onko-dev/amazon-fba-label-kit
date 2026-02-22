/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB', // blue-600
          dark: '#1D4ED8',    // blue-700
          light: '#3B82F6',   // blue-500
        },
        secondary: {
          DEFAULT: '#F97316', // orange-500
          dark: '#EA580C',    // orange-600
        },
        neutral: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          900: '#111827',
        },
        alert: {
          DEFAULT: '#EF4444', // red-500
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
