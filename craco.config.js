// craco.config.js
module.exports = {
  style: {
    postcss: {
      plugins: [
        require('tailwindcss')('./tailwind.config.js'), // Explicitly specify the config file
        require('autoprefixer'),
      ],
    },
  },
};