/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        surface: '#09090B',
        overlay: 'rgba(6,7,11,0.72)',
        calm: '#1F2937',
        focus: '#4ADE80',
        warning: '#F59E0B',
        crisis: '#EF4444',
      },
      boxShadow: {
        soft: '0 40px 120px rgba(0,0,0,0.24)',
        panel: '0 24px 80px rgba(0,0,0,0.18)',
      },
      fontFamily: {
        heading: ['Bebas Neue', 'Satoshi', 'Inter', 'sans-serif'],
        body: ['DM Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
