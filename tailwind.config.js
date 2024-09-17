/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./theme/**/*.liquid"
  ],
  theme: {
    extend: {},
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
  plugins: [],
}

