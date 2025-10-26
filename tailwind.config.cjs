/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        atipicali: {
          blue: '#4A90E2',
          red: '#E74C3C',
          green: '#2ECC71',
          yellow: '#F39C12',
          'blue-light': '#E8F4FD',
          'blue-dark': '#2C5AA0',
        }
      }
    },
  },
  plugins: [],
}
