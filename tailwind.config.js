/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // must be "class"
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
