export default {
  content: ["./src/**/*.{html,njk}"],
  theme: {
    extend: {
      fontFamily: {
        merriweather: ["Merriweather", "serif"],
        poppins: ["Poppins", "sans-serif"],
        code: ["Source Code Pro", "monospace"],
      },
      colors: {
        "my-gray": "#2a2a2a",
        "my-orange": "#f3a433",
      },
    },
  },
  plugins: [],
};
