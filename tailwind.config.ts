import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4DC9E6',
        secondary: '#7EE8C8',
        accent: '#FF8C69',
        background: '#F0FBFF',
        navy: '#2C4A5A',
      },
      fontFamily: {
        sans: ['Noto Sans KR', 'sans-serif'],
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
      },
      boxShadow: {
        card: '0 2px 16px 0 rgba(77,201,230,0.10)',
        hover: '0 6px 24px 0 rgba(77,201,230,0.18)',
      },
      keyframes: {
        wave: {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(-6%)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulse2: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
      },
      animation: {
        wave: 'wave 6s ease-in-out infinite',
        'wave-slow': 'wave 9s ease-in-out infinite reverse',
        fadeUp: 'fadeUp 0.5s ease both',
        pulse2: 'pulse2 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
