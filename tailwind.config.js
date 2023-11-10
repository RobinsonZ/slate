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
        detail: ["Patrick Hand", "sans"],
        label: ["Patrick Hand SC", "sans"],
      },
    },
  },
  plugins: [],
};
