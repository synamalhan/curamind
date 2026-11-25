/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Falls back to the system font when offline.
      fontFamily: { sans: ['Nunito', 'ui-rounded', 'system-ui', 'sans-serif'] },
      // Soft, flat pastels: one per section (chat = lilac, dashboard = butter, toolbox = mint).
      colors: {
        paper: '#FBF7F0',
        ink: { DEFAULT: '#2E2A36', soft: '#6B6577' },
        lilac: { light: '#EEE8FF', DEFAULT: '#CBBEFF', deep: '#5B47C7' },
        butter: { light: '#FFF4D2', DEFAULT: '#FFDF85', deep: '#8A6100' },
        mint: { light: '#E2F4E9', DEFAULT: '#A9E0C0', deep: '#1F7A4D' },
        peach: { light: '#FFEBE0', DEFAULT: '#FFC4A6', deep: '#B4532A' },
        sky: { light: '#E3EFFF', DEFAULT: '#A9CBFF', deep: '#2D5FA8' },
      },
    },
  },
  plugins: [],
};
