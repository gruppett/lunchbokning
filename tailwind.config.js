module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    fontFamily: {
      sans: [
        '"Open Sans"',
        'sans-serif',
      ],
    },
    extends: {
      fontFamily: {
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
