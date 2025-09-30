/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
      extend: {
          colors: {
              brandBlue: '#00a0ff',
              brandOrange: '#ff8c00',
              brandBlack: '#000000',
              brandWhite: '#ffffff',
              brandSage: '#7f967f',
          },
          fontFamily: {
              orbitron: ['Orbitron', 'sans-serif'],
              exo: ['"Exo 2"', 'sans-serif'],
          },
      },
  },
  plugins: [],
}

