/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Orbitron', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#3b82f6',
          glow: 'rgba(59, 130, 246, 0.3)',
        },
        dark: {
          DEFAULT: '#020617',
          darker: '#000000',
        }
      },
    },
  },
  plugins: [],
}
