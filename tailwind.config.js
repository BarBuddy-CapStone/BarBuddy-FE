const { nextui } = require("@nextui-org/react");

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        aBeeZee: ['aBeeZee', 'sans-serif'], // Adding aBeeZee as a custom font
        notoSansSC: ['Noto Sans SC', 'sans-serif'], // Adding Noto Sans SC
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui(),
    require('@tailwindcss/aspect-ratio')
  ],
};
