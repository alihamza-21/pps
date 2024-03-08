/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        fiexen: ["Studio Feixen Sans", "sans-serif"],
      },
      borderRadius: {
        fullest: "100%",
      },
      backgroundImage: {
        auth: 'url("/public/images/auth/bg.webp")',
      },
      backgroundColor: {
        themePurple: "#202053",
        themePurple2: "#C7C7FF",
        themeOrange: "#FF745A",
        themeOrange2: "#FCCDC4",
        themeYellow: "#FFA945",
        themeBlue: "#26C7EF",
        themeBlue2: "rgba(81, 157, 233, 0.4)",
        themeGray: "#F4F5FA",
        themeGray2: "#F4F7FF",
        themeBlack: "#1A202C",
        themeBlack2: "#333333",
        themeBlack3: "#2D3748",
        themeWhite: "#EDF2F7",
        themeGreen: "#319795",
        themeGreen2: "#20E0A5",
      },
      colors: {
        themePurple: "#202053",
        themePurple2: "#C7C7FF",
        themeOrange: "#FF745A",
        themeOrange2: "#FCCDC4",
        themeYellow: "#FFA945",
        themeBlue: "#26C7EF",
        themeBlue2: "rgba(81, 157, 233, 0.4)",
        themeGray: "#F4F5FA",
        themeGray2: "#F4F7FF",
        themeBlack: "#1A202C",
        themeBlack2: "#333333",
        themeBlack3: "#2D3748",
        themeWhite: "#EDF2F7",
        themeGreen: "#319795",
        themeGreen2: "#20E0A5",
      },
    },
  },
  plugins: [],
};
