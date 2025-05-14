/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
      },
      width: {
        "160": "40rem"
      },
      borderRadius: {
        "4xl": "30px",
        "5xl": "35px"
      }
    },
  },
  plugins: [],
};

