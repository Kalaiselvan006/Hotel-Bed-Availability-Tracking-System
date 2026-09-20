/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Sleek Neutral Obsidian Slate
        slate: {
          950: '#0B0D13',
          900: '#10141C',
          850: '#151B26',
          800: '#1C2331',
          750: '#242D3E',
          700: '#2D384D',
          600: '#3D4B66',
        },
        // Refined Champagne Gold
        gold: {
          300: '#F3E5AB',
          400: '#E5C978',
          500: '#D4AF37',
          600: '#C5A880',
          700: '#A68038',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Cinzel"', 'serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 20px rgba(212, 175, 55, 0.2)',
        'glass-card': '0 20px 40px -15px rgba(0, 0, 0, 0.7)',
      }
    },
  },
  plugins: [],
}
