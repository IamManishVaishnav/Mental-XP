/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#5B6CFF',
        secondary: '#8B5CF6',
        accent: '#22D3EE',
        surface: '#F8FAFC',
        dark: '#0F172A',
        textPrimary: '#1E293B',
        textSecondary: '#64748B',
      },
      fontFamily: {
        display: ['"Syne"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 16px 0 rgba(91,108,255,0.08)',
        glow: '0 0 24px 0 rgba(91,108,255,0.18)',
      },
    },
  },
  plugins: [],
}