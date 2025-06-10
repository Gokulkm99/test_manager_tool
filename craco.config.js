// craco.config.js
module.exports = {
  style: {
    postcss: {
      plugins: [
        require('tailwindcss')('./tailwind.config.js'),
        require('autoprefixer'),
      ],
      loaderOptions: {
        postcssOptions: {
          config: './postcss.config.js', // Explicitly reference postcss.config.js
        },
      },
    },
  },
};