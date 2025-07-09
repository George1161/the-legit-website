/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: '#0D0D0D',
        text: '#F3F3F3',
        legitGold: '#E2C570',
        secondary: '#6B6B6B',
        error: '#B44444',
        vote: '#FFCC00',
        glitch: '#4C94FF',
      },
      fontFamily: {
        heading: ["'Cinzel'", "'Marcellus'", "'Poppins'", "'Inter'", 'sans-serif'],
        body: ["'Inter'", "'Poppins'", "'Space Grotesk'", 'sans-serif'],
        accent: ["'Permanent Marker'", 'cursive'], // Example for handwritten/glitch
      },
    },
  },
  plugins: [],
}

