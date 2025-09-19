/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/components/PaymentForm/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  prefix: 'tw-',
  corePlugins: {
    preflight: false,
  },
  plugins: [],
};
