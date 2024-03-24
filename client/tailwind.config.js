/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      aspectRatio: {
        "3/4": "3 / 4",
        "1/2": "1 / 2",
        "4/5": "4 / 5",
      },
    },
  },
  plugins: [],
};
