/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        toxic: {
          light: '#ff4b82',
          DEFAULT: '#ff004f',
          dark: '#990030',
        },
        dark: {
          900: '#0a0a0a',
          800: '#121212',
          700: '#1e1e1e',
          600: '#2d2d2d',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'subtle-pulse': 'subtlePulse 4s infinite ease-in-out',
        'float': 'float 6s infinite ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        subtlePulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.8' },
          '50%': { transform: 'scale(1.05)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
