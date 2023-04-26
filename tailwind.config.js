/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,vue}",
  ],
  theme: {
    extend: {
      colors: {
        dark: "#38404A",
        light: "#F6F6F6",
      },
      transitionTimingFunction: {
        "cubic-ease": "cubic-bezier(.77,0,.175,1)",
      },
    },
  },
  plugins: [],
}

