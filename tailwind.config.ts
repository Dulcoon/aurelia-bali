import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ivory: '#F7F5EF',
        sand: '#E6DCCB',
        deepGreen: '#263D32',
        forestGreen: '#344F40',
        charcoal: '#262822',
        bronze: '#A88C62',
        stone: '#D4CEC2',
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Georgia', ' Cambria', 'Times New Roman', 'serif'],
        sans: ['var(--font-jakarta)', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        editorial: '0 12px 32px -8px rgba(38, 40, 34, 0.08)',
        subtle: '0 4px 16px -2px rgba(38, 40, 34, 0.05)',
      },
    },
  },
  plugins: [],
};

export default config;
