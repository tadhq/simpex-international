import type { Config } from 'tailwindcss';
import { appConfig } from './src/config/app';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        lg: '1296px',
        xl: '1552px',
      },
    },
    extend: {
      colors: appConfig.colors,
      screens: {
        xs: '480px',
        '3xl': '1800px',
        '4xl': '2560px',
      },
      animation: {
        'slow-movement': 'slow-movement 6s ease infinite',
        'subtle-ping': 'subtle-ping 4s cubic-bezier(0, 0, 0.2, 1) infinite',
        'fade-in': 'fade-in 0.7s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.7s ease-out forwards',
        'cs-progress': 'cs-progress 2.8s ease-in-out forwards',
        'cs-text-white': 'cs-text-white 2.8s ease-in-out forwards',
      },
      keyframes: {
        'slow-movement': {
          '0%, 100%': { transform: 'translateY(-25%)' },
          '50%': { transform: 'translateY(0%)' },
        },
        'subtle-ping': {
          '30%, 100%': {
            transform: 'scale(1.5)',
            opacity: 0 as any,
          },
          '0%': {
            opacity: 0 as any,
          },
          '10%': {
            opacity: 1 as any,
          },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'cs-progress': {
          '0%': { width: '0%' },
          '60%': { width: '85%' },
          '100%': { width: '85%' },
        },
        'cs-text-white': {
          '0%': { color: '#64748b' },
          '50%': { color: '#64748b' },
          '55%': { color: '#ffffff' },
          '100%': { color: '#ffffff' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
