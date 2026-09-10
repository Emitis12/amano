/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0b2f52',
          50: '#eef3f8',
          100: '#d7e3ee',
          200: '#a9c2da',
          300: '#7aa0c5',
          400: '#4a7eb0',
          500: '#2c5f92',
          600: '#1c4a76',
          700: '#123a60',
          800: '#0b2f52',
          900: '#071f38',
          950: '#041524',
        },
        gold: {
          DEFAULT: '#f2c11d',
          50: '#fdf8e6',
          100: '#faedb8',
          200: '#f7e28a',
          300: '#f5d75c',
          400: '#f2cc2e',
          500: '#f2c11d',
          600: '#d4a512',
          700: '#a67f0d',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
