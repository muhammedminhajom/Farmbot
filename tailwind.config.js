/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        forest: '#1B4332',
        leaf: '#2D6A4F',
        lime: '#86EFAC',
        'lime-dark': '#4ADE80',
        soil: '#6B4226',
        sky: '#E0F2FE',
        'warm-white': '#FAFAF9',
        mild: '#FEF08A',
        moderate: '#FED7AA',
        severe: '#FECACA',
      },
      fontFamily: {
        sans: ['Karla', 'sans-serif'],
        malayalam: ['Noto Sans Malayalam', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        shimmer: 'shimmer 2.5s infinite linear',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%) skewX(-12deg)' },
          '100%': { transform: 'translateX(200%) skewX(-12deg)' },
        },
      },
    },
  },
  plugins: [],
};
