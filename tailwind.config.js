/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cardPdf: "#f8f1bb",
        cardDocx: "#dcf4ca",
        cardDefault: "#bdeef1",
      },
      fontFamily: {
        title: ["Arvo", "serif"],
        header: ["Arvo", "serif"],
        subheader: ["Arvo", "serif"],
        detail: ["Roboto", "sans-serif"],
        label: ["Roboto", "sans-serif"],
      },
      typography: {
        DEFAULT: {
          css: {
            fontFamily: "Roboto, sans-serif",
            'code::before': {
              content: '&nbsp;&nbsp;',
            },
            'code::after': {
              content: '&nbsp;&nbsp;',
            },
          }
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
