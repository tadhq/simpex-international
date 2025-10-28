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
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
