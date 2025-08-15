/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        primary: '#ee617a',
        accent: '#9f3dee',
        soft: '#e9f08f',
      },
    },
  },
  plugins: [],
}

