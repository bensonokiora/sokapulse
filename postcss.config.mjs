// Rename to postcss.config.js for better compatibility
module.exports = {
  plugins: {
    tailwindcss: {},
    // Add PurgeCSS for production only
    ...(process.env.NODE_ENV === 'production' ? {
      '@fullhuman/postcss-purgecss': {
        content: [
          './src/**/*.{js,jsx,ts,tsx}',
          './src/app/**/*.{js,jsx,ts,tsx}',
          './src/components/**/*.{js,jsx,ts,tsx}',
        ],
        defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
        safelist: {
          standard: ['html', 'body', /^container/, /^btn/, /^bg-/, /^text-/],
          deep: [/^modal/, /^dropdown/, /^nav/, /^accordion/],
          greedy: [/^carousel/, /^collapse/, /^toast/]
        }
      },
      // Add CSS minification for production
      'cssnano': {
        preset: ['default', {
          discardComments: {
            removeAll: true,
          },
          normalizeWhitespace: true,
        }],
      }
    } : {})
  },
};
