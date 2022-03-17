module.exports = {
  content: [
    "./src/**/*.{ts,tsx}"
  ],
  theme: {
    colors: {
      bg: "#ffffff"
    },
    extends: {
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
}
