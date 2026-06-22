/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#000000",
        foreground: "#ffffff",
      },
      keyframes: {
        slideUp: {
          'from': { transform: 'translateY(100%)' },
          'to': { transform: 'translateY(0)' },
        }
      },
      animation: {
        'slide-up': 'slideUp 0.3s cubic-bezier(0.25, 1, 0.5, 1) forwards',
      }
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.no-scrollbar': {
          '-ms-overflow-style': 'none', /* IE et Edge */
          'scrollbar-width': 'none',    /* Firefox */
          '&::-webkit-scrollbar': {
            'display': 'none',          /* Safari et Chrome */
          },
        },
      })
    },
  ],
};
