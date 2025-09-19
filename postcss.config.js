// Rename to postcss.config.js for better compatibility
module.exports = {
  plugins: {
    tailwindcss: {
      // Use the Tailwind config
      config: './tailwind.config.js',
    },
    autoprefixer: {},
    ...(process.env.NODE_ENV === 'production' ? {
      cssnano: {
        preset: ['default', {
          discardComments: {
            removeAll: true,
          },
          // Disable SVG optimization which can cause issues
          svgo: false,
        }],
      }
    } : {})
  },
};
