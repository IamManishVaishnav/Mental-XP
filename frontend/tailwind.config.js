/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        forest:   { DEFAULT: '#2D6A4F', 50: '#F0F7F4', 100: '#D8EDE5', 200: '#A8D5BF', 300: '#74B99A', 400: '#52A07A', 500: '#2D6A4F', 600: '#235440', 700: '#1A3F30', 800: '#112A20', 900: '#081510' },
        amber:    { DEFAULT: '#D97706', 50: '#FFFBEB', 100: '#FEF3C7', 200: '#FDE68A', 300: '#FCD34D', 400: '#FBBF24', 500: '#F59E0B', 600: '#D97706', 700: '#B45309', 800: '#92400E', 900: '#78350F' },
        sage:     { DEFAULT: '#84A98C', 50: '#F4F7F5', 100: '#E8F0EA', 200: '#C8DAcc', 300: '#A6C4AC', 400: '#84A98C', 500: '#6B9174', 600: '#537A5C', 700: '#3E5C45', 800: '#2A3D2F', 900: '#151F18' },
        cream:    { DEFAULT: '#FAFAF7', warm: '#F5F5F0', paper: '#FFFFFE' },
        ink:      { DEFAULT: '#1C1917', soft: '#292524', light: '#57534E', muted: '#A8A29E', faint: '#E7E5E4' },
        surface:  '#FAFAF7',
        dark:     '#141410',
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        body:    ['"Geist"', '"Inter"', 'sans-serif'],
        mono:    ['"Geist Mono"', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.65rem', { lineHeight: '1rem' }],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        soft:   '0 2px 8px 0 rgba(28,25,23,0.06), 0 1px 2px 0 rgba(28,25,23,0.04)',
        card:   '0 4px 24px 0 rgba(28,25,23,0.07), 0 1px 4px 0 rgba(28,25,23,0.05)',
        lifted: '0 8px 32px 0 rgba(28,25,23,0.10), 0 2px 8px 0 rgba(28,25,23,0.06)',
        glow:   '0 0 0 3px rgba(45,106,79,0.18)',
        amber:  '0 0 0 3px rgba(217,119,6,0.18)',
        inner:  'inset 0 1px 3px 0 rgba(28,25,23,0.08)',
      },
      backgroundImage: {
        'grain': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        'fade-up':     { '0%': { opacity: '0', transform: 'translateY(12px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        'fade-in':     { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        'scale-in':    { '0%': { opacity: '0', transform: 'scale(0.96)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
        'fill-bar':    { '0%': { width: '0%' }, '100%': { width: 'var(--bar-width)' } },
        'slide-right': { '0%': { transform: 'translateX(-8px)', opacity: '0' }, '100%': { transform: 'translateX(0)', opacity: '1' } },
        'shimmer':     { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        'pulse-soft':  { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0.6' } },
        'bounce-sm':   { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-3px)' } },
      },
      animation: {
        'fade-up':     'fade-up 0.4s ease-out forwards',
        'fade-in':     'fade-in 0.3s ease-out forwards',
        'scale-in':    'scale-in 0.3s ease-out forwards',
        'fill-bar':    'fill-bar 1s ease-out forwards',
        'slide-right': 'slide-right 0.3s ease-out forwards',
        'shimmer':     'shimmer 2.5s linear infinite',
        'pulse-soft':  'pulse-soft 2s ease-in-out infinite',
        'bounce-sm':   'bounce-sm 0.6s ease-in-out',
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
}
