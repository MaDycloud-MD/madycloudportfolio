/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#facc15',
        dark:    '#0d1117',
        light:   '#f9fafb',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        code:  ['Fira Code', 'monospace'],
      },
      keyframes: {
        'gradient-pan': {
          '0%':   { backgroundPosition: '0% 50%' },
          '50%':  { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'fade-in-up': {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'gradient-pan': 'gradient-pan 5s ease infinite',
        'fade-in-up':   'fade-in-up 0.6s ease forwards',
      },
    },
  },
  plugins: [],
};
