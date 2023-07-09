/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,vue}"],
  theme: {
    fontFamily: {
      sans: "IRANSans",
    },
    extend: {
      colors: {
        "primary-green": {
          500: "#009896",
          600: "#00918E",
        },
      },
    },
  },
  plugins: [],
};
