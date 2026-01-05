/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#fdf4f7",
        surface: "#ffffff",
        primary: "#c26b8a",
        "primary-hover": "#b05f7c",
        border: "#f0b7c9",
        text: "#4a2c36",
        muted: "#9c6f7d",
      },
    },
  },
  plugins: [],
};
