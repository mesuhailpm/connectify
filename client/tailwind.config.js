/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#26722C", //dark green
        secondary: "#22A52D", //light green
        chat_background: "#22A52D4D", //light grey
        text: "#333", //dark grey
        danger: "#FF0000", //red
        success: "#00FF00", //green
        warning: "#FFFF00", //yellow,
        info: "#0000FF", //blue
      },
    },
  },
  plugins: [],
};
