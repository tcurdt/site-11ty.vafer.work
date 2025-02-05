export default {
  plugins: {
    "postcss-import": {},
    "tailwindcss/nesting": {},
    tailwindcss: {},
    autoprefixer: {},
    cssnano:
      process.env.ELEVENTY_PRODUCTION === "production"
        ? {
            preset: ["default", { discardComments: { removeAll: true } }],
          }
        : false,
  },
};
