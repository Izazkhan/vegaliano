/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./theme/**/*.liquid"
  ],
  theme: {
    extend: {
      screens: {
        'xsm': '480px',
        '2md': '896px',
        '3xl': '1600px',
      },
      colors: {
        primary: "#493323",
        link: "#493323"
      }
    },
    fontFamily: {
      'body': [
        'Montserrat',
        'sans-serif',
        // other fallback fonts
      ],
      'sans': [
        'Montserrat',
        'sans-serif',
        // other fallback fonts
      ]
    }
  },
  safelist: [
    'bg-gray-900/50',
    'inset-0',
  ],
  plugins: [],
}

