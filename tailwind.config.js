/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./theme/**/*.liquid"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#493323",
        link: "#493323"
      }
    },
    fontFamily: {
      'body': [
        'Lato',
        'ui-sans-serif',
        'system-ui',
        // other fallback fonts
      ],
      'sans': [
        'Lato',
        'ui-sans-serif',
        'system-ui',
        // other fallback fonts
      ]
    }
  },
  safelist: [
    'bg-gray-900/50',
    'inset-0'
  ],
  plugins: [],
}

