export default {
  plugins: {
    "@tailwindcss/postcss": {},
    cssnano:
      process.env.MINIMIZE === "true"
        ? {
            preset: ["default", { discardComments: { removeAll: true } }],
          }
        : false,
  },
};
