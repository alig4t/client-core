/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        card: {
          dark: "red",
          light: "#fff",
        },
        "layout-dark": "#171e28",
        "layout-light": "#f9f",
      },
    },
  },
  plugins: [require("tailwind-scrollbar"), require("tailwind-scrollbar-hide")],
};
