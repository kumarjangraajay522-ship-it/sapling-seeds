/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: '#1a4a2e',
        leaf: '#2d7a4a',
        sage: '#5a9e6f',
        mint: '#a8d5b5',
        cream: '#f7f4ee',
        warm: '#ede9df',
        gold: '#c8a84b',
        brand: {
          red: '#c0392b',
          green: '#1a4a2e',
          lightgreen: '#2d7a4a',
        }
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        dm: ['"DM Sans"', 'sans-serif'],
        caveat: ['Caveat', 'cursive'],
      },
      animation: {
        ticker: 'ticker 30s linear infinite',
        highlightPulse: 'highlightPulse 2s ease-in-out infinite',
        badgePulse: 'badgePulse 2s ease-in-out infinite',
        rotateDash: 'rotateDash 8s linear infinite',
        bounceDown: 'bounceDown 2s ease-in-out infinite',
        fadeInUp: 'fadeInUp 0.6s ease forwards',
        slideUp: 'slideUp 0.3s ease',
      },
      keyframes: {
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        highlightPulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1', borderColor: '#c8a84b' },
          '50%': { transform: 'scale(1.08)', opacity: '0.7', borderColor: '#2d7a4a' },
        },
        badgePulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        rotateDash: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        bounceDown: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(6px)' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
