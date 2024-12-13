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
        '3xl': '1600px'
      },
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        accent: "var(--color-accent)",
        one: "var(--color-1)",
        two: "var(--color-2)",
        three: "var(--color-3)",
        four: "var(--color-4)",
        five: "var(--color-5)",
        six: "var(--color-6)",
        seven: "var(--color-7)",
        link: "var(--color-link)",
        'link-hover': "var(--color-link-hover)",
        'footer-link': "var(--color-footer-link)",
        'footer-link-hover': "var(--color-footer-link-hover)",
        'footer-heading': "var(--color-footer-heading)",
        'product-title': "var(--color-product-title)",
        'product-price': "var(--color-product-price)",
        'footer': "var(--color-footer)",
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

