/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
      extend: {
        minHeight: {
          "screen-65px": "calc(100vh - 65px)",
        },
        height: {
          "screen-120px": "calc(100vh - 120px)",
          "screen-160px": "calc(100vh - 160px)",
        },
        container: {
          padding: {
            DEFAULT: "1rem",
            sm: "0rem",
            lg: "0rem",
            xl: "12rem",
            "2xl": "10rem",
          },
        },
      },
    },
    plugins: [],
  };
  